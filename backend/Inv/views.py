from rest_framework import viewsets, status, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Customer, Tag, Restaurant, Product, Order
from .serializers import UserSerializer, TagSerializer, RestaurantSerializer, ProductSerializer, OrderSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        account_type = request.data.get('account_type', 'customer')
        if account_type == 'restaurant':
            Restaurant.objects.create(
                owner=user,
                name=request.data.get('restaurant_name', user.username),
                cuisine=request.data.get('cuisine', ''),
                city=request.data.get('city', ''),
                address=request.data.get('address', ''),
            )
        else:
            Customer.objects.create(user=user, name=user.username, email=user.email, city=request.data.get('city', ''))
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': UserSerializer(user).data, 'account_type': account_type}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    user = authenticate(username=request.data.get('username'), password=request.data.get('password'))
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        account_type = 'restaurant' if hasattr(user, 'restaurant') else 'customer'
        return Response({'token': token.key, 'user': UserSerializer(user).data, 'account_type': account_type})
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    account_type = 'restaurant' if hasattr(user, 'restaurant') else 'customer'
    data = {'user': UserSerializer(user).data, 'account_type': account_type}
    if account_type == 'restaurant':
        data['restaurant'] = RestaurantSerializer(user.restaurant).data
    return Response(data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    user = request.user
    user.delete()
    return Response({'ok': True})

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.filter(is_active=True)
    serializer_class = RestaurantSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'cuisine', 'city']

class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'cuisine', 'dietary_info']

    def get_serializer_context(self):
        return {'request': self.request}

    def get_queryset(self):
        qs = Product.objects.filter(is_available=True).select_related('restaurant')
        # Tag filter
        tags = self.request.query_params.get('tags')
        if tags:
            tag_ids = [int(t) for t in tags.split(',') if t.isdigit()]
            qs = qs.filter(tags__id__in=tag_ids).distinct()
        # Cuisine filter
        cuisine = self.request.query_params.get('cuisine')
        if cuisine:
            qs = qs.filter(Q(cuisine__icontains=cuisine) | Q(restaurant__cuisine__icontains=cuisine))
        # City filter
        city = self.request.query_params.get('city')
        if city:
            qs = qs.filter(restaurant__city__icontains=city)
        return qs

    def perform_create(self, serializer):
        try:
            product = serializer.save(
                restaurant=self.request.user.restaurant if hasattr(self.request.user, 'restaurant') else None,
                is_available=True
            )
            # Auto-create cuisine as a tag if it's custom
            cuisine = self.request.data.get('cuisine', '')
            if cuisine:
                tag, _ = Tag.objects.get_or_create(name__iexact=cuisine, defaults={'name': cuisine})
                product.tags.add(tag)
        except Exception as e:
            print(f"Product create error: {e}")
            raise

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'restaurant'):
            return Order.objects.filter(product__restaurant=user.restaurant).select_related('product', 'product__restaurant', 'customer')
        elif hasattr(user, 'customer'):
            return Order.objects.filter(customer=user.customer).select_related('product', 'product__restaurant')
        return Order.objects.none()

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'customer'):
            order = serializer.save(customer=self.request.user.customer)
            product = order.product
            if product:
                product.quantity = max(0, product.quantity - order.quantity)
                if product.quantity <= 0:
                    product.is_available = False
                product.save()

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        valid = dict(Order.STATUS)
        if new_status in valid:
            order.status = new_status
            order.save()
            # If cancelled, restore quantity
            if new_status == 'Cancelled' and order.product:
                order.product.quantity += order.quantity
                order.product.is_available = True
                order.product.save()
            return Response(OrderSerializer(order).data)
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    if not hasattr(request.user, 'restaurant'):
        return Response({'error': 'Not a restaurant'}, status=403)
    orders = Order.objects.filter(product__restaurant=request.user.restaurant)
    return Response({
        'pending': orders.filter(status='Pending').count(),
        'ready_for_pickup': orders.filter(status='Ready for Pickup').count(),
        'picked_up': orders.filter(status='Picked Up').count(),
        'completed': orders.filter(status='Completed').count(),
        'cancelled': orders.filter(status='Cancelled').count(),
        'total': orders.count(),
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_products(request):
    if not hasattr(request.user, 'restaurant'):
        return Response([])
    products = Product.objects.filter(restaurant=request.user.restaurant).order_by('-date_created')
    return Response(ProductSerializer(products, many=True, context={'request': request}).data)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def edit_product(request, pk):
    if not hasattr(request.user, 'restaurant'):
        return Response({'error': 'Not a restaurant'}, status=403)
    try:
        product = Product.objects.get(pk=pk, restaurant=request.user.restaurant)
        for field in ['name', 'description', 'price', 'quantity', 'pickup_time', 'pickup_duration_mins', 'dietary_info', 'cuisine']:
            if field in request.data:
                setattr(product, field, request.data[field])
        if 'is_available' in request.data:
            product.is_available = request.data['is_available']
        product.save()
        return Response(ProductSerializer(product, context={'request': request}).data)
    except Product.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_product(request, pk):
    if not hasattr(request.user, 'restaurant'):
        return Response({'error': 'Not a restaurant'}, status=403)
    try:
        Product.objects.get(pk=pk, restaurant=request.user.restaurant).delete()
        return Response({'ok': True})
    except Product.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)
