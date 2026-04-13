"""
API Views for KitchenShare.

These handle HTTP requests from the React frontend and return JSON responses.
Each ViewSet automatically creates CRUD endpoints:
  - GET    /api/products/       → list all products
  - POST   /api/products/       → create a new product
  - GET    /api/products/1/     → get product with id=1
  - PUT    /api/products/1/     → update product with id=1
  - DELETE /api/products/1/     → delete product with id=1

DjangoFilterBackend enables ?tag=1&cuisine=Indian style URL filtering.
SearchFilter enables ?search=pizza style text search.
"""

from rest_framework import viewsets, status, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q

from .models import Customer, Tag, Restaurant, Product, Order
from .serializers import (
    UserSerializer, TagSerializer, RestaurantSerializer,
    ProductSerializer, OrderSerializer
)


# ===========================================================================
# Authentication Views (function-based — simpler for one-off endpoints)
# ===========================================================================

@api_view(['POST'])
@permission_classes([AllowAny])  # Anyone can register (no token needed)
def register(request):
    """
    Register a new user account.

    Expects JSON: {"username": "...", "email": "...", "password": "...", "account_type": "customer|restaurant"}
    Returns: user data + auth token.

    Flow:
    1. Validate the user data with UserSerializer
    2. Create the User object
    3. Create a Customer or Restaurant profile based on account_type
    4. Generate an auth token for immediate login
    """
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        # .save() calls UserSerializer.create() which hashes the password
        user = serializer.save()

        # Determine account type from the request body
        account_type = request.data.get('account_type', 'customer')

        if account_type == 'restaurant':
            # Create a Restaurant profile linked to this user
            Restaurant.objects.create(
                owner=user,
                name=request.data.get('restaurant_name', user.username)
            )
        else:
            # Create a Customer profile linked to this user
            Customer.objects.create(
                user=user,
                name=user.username,
                email=user.email
            )

        # Generate a token — the frontend stores this and sends it
        # in the Authorization header for authenticated requests
        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'account_type': account_type
        }, status=status.HTTP_201_CREATED)

    # If validation fails, return the error messages
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])  # Anyone can try to log in
def login_view(request):
    """
    Log in an existing user.

    Expects JSON: {"username": "...", "password": "..."}
    Returns: auth token + user data + account type.

    authenticate() checks the credentials against Django's auth system.
    """
    username = request.data.get('username')
    password = request.data.get('password')

    # authenticate() returns a User object if credentials are valid, else None
    user = authenticate(username=username, password=password)

    if user:
        # Get or create the auth token
        token, _ = Token.objects.get_or_create(user=user)

        # Determine account type by checking which profile exists
        account_type = 'restaurant' if hasattr(user, 'restaurant') else 'customer'

        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'account_type': account_type
        })

    return Response(
        {'error': 'Invalid credentials'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Must send a valid token
def user_profile(request):
    """
    Get the current logged-in user's profile.

    The token in the Authorization header tells Django who the user is.
    request.user is automatically set by TokenAuthentication middleware.
    """
    user = request.user
    account_type = 'restaurant' if hasattr(user, 'restaurant') else 'customer'

    data = {
        'user': UserSerializer(user).data,
        'account_type': account_type
    }

    # Include restaurant or customer details based on account type
    if account_type == 'restaurant':
        data['restaurant'] = RestaurantSerializer(user.restaurant).data
    elif hasattr(user, 'customer'):
        data['customer'] = {
            'name': user.customer.name,
            'phone': user.customer.phone,
            'email': user.customer.email
        }

    return Response(data)


# ===========================================================================
# ViewSets (class-based — auto-generates all CRUD endpoints)
# ===========================================================================

class TagViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Tags (e.g. "Mexican", "Vegan").
    GET /api/tags/           → list all tags
    POST /api/tags/          → create a new tag
    GET /api/tags/1/         → get tag with id=1

    queryset: the base set of objects this view operates on
    serializer_class: how to convert objects to/from JSON
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class RestaurantViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Restaurants.

    Supports filtering:
      GET /api/restaurants/?search=Italian    → search by name/cuisine
      GET /api/restaurants/?cuisine=Mexican   → filter by cuisine

    filter_backends: enables search via ?search= query parameter
    search_fields: which model fields to search in
    """
    queryset = Restaurant.objects.filter(is_active=True)  # Only active restaurants
    serializer_class = RestaurantSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'cuisine', 'address']

    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        """
        Custom endpoint: GET /api/restaurants/1/products/
        Returns all available products for a specific restaurant.

        @action decorator creates a sub-URL under the restaurant detail.
        detail=True means it requires a restaurant ID in the URL.
        """
        restaurant = self.get_object()
        products = Product.objects.filter(
            restaurant=restaurant,
            is_available=True
        )
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Products (food items).

    Supports:
      GET /api/products/?search=pasta         → text search
      GET /api/products/?tags=1,2             → filter by tag IDs
      GET /api/products/?min_price=5&max_price=20  → price range
      GET /api/products/?restaurant=1         → filter by restaurant
    """
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'dietary_info']

    def get_queryset(self):
        """
        Override the default queryset to add custom filtering.

        This method runs for every GET request. We read query parameters
        from the URL and build a filtered queryset dynamically.
        """
        # Start with all available products
        queryset = Product.objects.filter(is_available=True)

        # --- Tag filtering ---
        # URL: /api/products/?tags=1,2,3
        tags = self.request.query_params.get('tags')
        if tags:
            # Split "1,2,3" into [1, 2, 3] and filter products that have ANY of these tags
            tag_ids = [int(t) for t in tags.split(',') if t.isdigit()]
            queryset = queryset.filter(tags__id__in=tag_ids).distinct()
            # distinct() prevents duplicate results when a product has multiple matching tags

        # --- Restaurant filtering ---
        # URL: /api/products/?restaurant=1
        restaurant_id = self.request.query_params.get('restaurant')
        if restaurant_id:
            queryset = queryset.filter(restaurant_id=restaurant_id)

        # --- Price range filtering ---
        # URL: /api/products/?min_price=5&max_price=20
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=float(min_price))  # gte = greater than or equal
        if max_price:
            queryset = queryset.filter(price__lte=float(max_price))  # lte = less than or equal

        # --- Cuisine filtering (via restaurant's cuisine) ---
        # URL: /api/products/?cuisine=Indian
        cuisine = self.request.query_params.get('cuisine')
        if cuisine:
            queryset = queryset.filter(restaurant__cuisine__icontains=cuisine)
            # icontains = case-insensitive substring match

        return queryset

    def perform_create(self, serializer):
        """
        Called when a POST request creates a new product.
        Automatically links the product to the logged-in user's restaurant.
        """
        if hasattr(self.request.user, 'restaurant'):
            serializer.save(restaurant=self.request.user.restaurant)
        else:
            serializer.save()


class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Orders.

    Customers see their own orders.
    Restaurant owners see orders for their products.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]  # Must be logged in

    def get_queryset(self):
        """
        Filter orders based on who's asking:
        - Customers see only their own orders
        - Restaurant owners see orders for their restaurant's products
        """
        user = self.request.user

        if hasattr(user, 'restaurant'):
            # Restaurant owner: show orders for their products
            return Order.objects.filter(
                product__restaurant=user.restaurant
            )
        elif hasattr(user, 'customer'):
            # Customer: show only their orders
            return Order.objects.filter(customer=user.customer)
        else:
            # Fallback: no orders
            return Order.objects.none()

    def perform_create(self, serializer):
        """
        When a customer places an order, auto-set the customer field
        and reduce the product's available quantity.
        """
        if hasattr(self.request.user, 'customer'):
            order = serializer.save(customer=self.request.user.customer)
            # Reduce product quantity
            product = order.product
            if product:
                product.quantity -= order.quantity
                if product.quantity <= 0:
                    product.is_available = False  # Mark as sold out
                product.save()

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """
        Custom endpoint: PATCH /api/orders/1/update_status/
        Body: {"status": "Ready for Pickup"}

        Allows restaurant owners to update order status.
        """
        order = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(Order.STATUS):
            order.status = new_status
            order.save()
            return Response(OrderSerializer(order).data)
        return Response(
            {'error': 'Invalid status'},
            status=status.HTTP_400_BAD_REQUEST
        )


# ===========================================================================
# Dashboard stats (for kitchen owners)
# ===========================================================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """
    GET /api/dashboard/stats/
    Returns order counts by status for the restaurant owner's dashboard.

    This powers the stat cards (Pending, Ready, Completed, Total).
    """
    user = request.user

    if not hasattr(user, 'restaurant'):
        return Response(
            {'error': 'Not a restaurant owner'},
            status=status.HTTP_403_FORBIDDEN
        )

    # Filter orders belonging to this restaurant's products
    orders = Order.objects.filter(product__restaurant=user.restaurant)

    return Response({
        'pending': orders.filter(status='Pending').count(),
        'ready_for_pickup': orders.filter(status='Ready for Pickup').count(),
        'completed': orders.filter(status='Completed').count(),
        'total': orders.count(),
    })
