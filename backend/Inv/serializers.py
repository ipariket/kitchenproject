"""
Serializers for KitchenShare REST API.

Serializers convert Django model instances (Python objects) into JSON
(for API responses) and validate incoming JSON data (for creating/updating).

Think of them as the translator between your database and your React frontend.

ModelSerializer automatically creates fields matching the model's fields.
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Customer, Tag, Restaurant, Product, Order


class UserSerializer(serializers.ModelSerializer):
    """
    Serializes Django's built-in User model.
    Used for registration and returning user info after login.
    write_only=True on password means it's accepted in input but never
    returned in API responses (security best practice).
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        """
        Override create to hash the password properly.
        create_user() hashes the password; User.objects.create() would store it in plain text.
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class TagSerializer(serializers.ModelSerializer):
    """
    Serializes Tag model. Simple — just the id and name.
    Example output: {"id": 1, "name": "Mexican"}
    """
    class Meta:
        model = Tag
        fields = ('id', 'name')


class RestaurantSerializer(serializers.ModelSerializer):
    """
    Serializes Restaurant model.
    product_count is a computed field — it counts how many active products
    this restaurant has, which is useful for the frontend listing.
    SerializerMethodField calls get_<field_name>() to compute the value.
    """
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = (
            'id', 'name', 'description', 'cuisine', 'address',
            'phone', 'image', 'rating', 'latitude', 'longitude',
            'is_active', 'product_count'
        )

    def get_product_count(self, obj):
        """Count only available products for this restaurant."""
        return obj.products.filter(is_available=True).count()


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializes Product model.

    For read operations (GET), we include nested restaurant and tags data
    so the frontend gets all info in one request (no extra API calls).

    For write operations (POST/PUT), restaurant_id and tag_ids accept
    just the IDs (integers), which is simpler for form submissions.

    PrimaryKeyRelatedField: accepts an integer ID and looks up the related object.
    """
    # Read-only nested serializers (included in GET responses)
    restaurant = RestaurantSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    # Write-only fields for creating/updating (used in POST/PUT requests)
    restaurant_id = serializers.PrimaryKeyRelatedField(
        queryset=Restaurant.objects.all(),
        source='restaurant',      # Maps to the 'restaurant' model field
        write_only=True,
        required=False
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        source='tags',            # Maps to the 'tags' model field
        write_only=True,
        many=True,                # Accepts a list of IDs: [1, 3, 5]
        required=False
    )

    class Meta:
        model = Product
        fields = (
            'id', 'name', 'category', 'description', 'price',
            'image', 'quantity', 'pickup_time', 'dietary_info',
            'date_created', 'is_available',
            'restaurant', 'tags',          # Read (nested objects)
            'restaurant_id', 'tag_ids',    # Write (just IDs)
        )


class OrderSerializer(serializers.ModelSerializer):
    """
    Serializes Order model.

    Same pattern: nested objects for reading, plain IDs for writing.
    This means a GET response includes full customer/product details,
    but a POST request only needs customer_id and product_id.
    """
    customer = serializers.StringRelatedField(read_only=True)
    product = ProductSerializer(read_only=True)

    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )

    class Meta:
        model = Order
        fields = (
            'id', 'customer', 'product', 'product_id',
            'date_created', 'status', 'quantity'
        )
