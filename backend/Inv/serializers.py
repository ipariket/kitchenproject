from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Customer, Tag, Restaurant, Product, Order

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=4)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    restaurant = RestaurantSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'cuisine', 'price', 'image', 'image_url',
                  'quantity', 'pickup_time', 'pickup_duration_mins', 'dietary_info',
                  'date_created', 'is_available', 'restaurant', 'tags')

    def get_image_url(self, obj):
        if obj.image:
            try:
                url = obj.image.url
                # Cloudinary URLs are already absolute
                if url.startswith('http'):
                    return url
                # Local dev: build full URL
                request = self.context.get('request')
                if request:
                    return request.build_absolute_uri(url)
                return url
            except Exception:
                return None
        return None

class OrderSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product', write_only=True)
    class Meta:
        model = Order
        fields = ('id', 'customer', 'product', 'product_id', 'date_created', 'status', 'quantity', 'scheduled_pickup')
