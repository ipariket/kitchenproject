"""
Models for KitchenShare.

This defines the database schema. Each class = one database table.
Django's ORM auto-generates SQL from these Python classes.

Models:
  - Customer: people who order food
  - Tag: labels like "Spicy", "Vegan", "Gluten-Free" for filtering
  - Restaurant: kitchen/restaurant profile (the seller side)
  - Product: a food item posted by a restaurant
  - Order: a customer claiming/ordering a product
"""

from django.db import models
from django.contrib.auth.models import User  # Django's built-in user model


class Customer(models.Model):
    """
    A customer profile linked to Django's User model.
    OneToOneField means each User has exactly one Customer profile.
    """
    # Links this customer to a Django auth user (for login/password)
    user = models.OneToOneField(
        User,
        null=True,          # Allows existing customers without a user
        blank=True,         # Not required in forms
        on_delete=models.CASCADE  # Delete customer if user is deleted
    )
    name = models.CharField(max_length=100, null=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    # auto_now_add=True: set once when the record is first created
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """String representation shown in admin panel and shell."""
        return self.name or "Unnamed Customer"


class Tag(models.Model):
    """
    Tags for filtering food items.
    Examples: "Mexican", "Chinese", "Vegan", "Gluten-Free", "Halal"
    ManyToMany with Product — one product can have multiple tags,
    and one tag can belong to multiple products.
    """
    name = models.CharField(max_length=50, null=True)

    def __str__(self):
        return self.name or ""


class Restaurant(models.Model):
    """
    A restaurant/kitchen profile. This is the seller side.
    Each restaurant is managed by a Django User (the owner).
    """
    # The user who owns/manages this restaurant
    owner = models.OneToOneField(
        User,
        null=True,
        blank=True,
        on_delete=models.CASCADE
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')
    # Cuisine type for filtering: "Indian", "Italian", "Mexican", etc.
    cuisine = models.CharField(max_length=100, blank=True, default='')
    address = models.CharField(max_length=255, blank=True, default='')
    phone = models.CharField(max_length=15, blank=True, default='')
    # Restaurant profile image
    image = models.ImageField(
        upload_to='restaurants/',  # Saved in media/restaurants/
        null=True,
        blank=True
    )
    # Star rating (1.0 to 5.0)
    rating = models.DecimalField(
        max_digits=2,        # Total digits (e.g. "4.8")
        decimal_places=1,    # One decimal place
        default=0.0
    )
    # Geographic coordinates for location-based search
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    """
    A food item posted by a restaurant for pickup.

    CATEGORY is now pickup-only (removed Delivery and Dine In).
    Each product belongs to one restaurant (ForeignKey).
    Products can have multiple tags for filtering.
    """
    CATEGORY = (
        ('Pickup', 'Pickup'),  # Only pickup option as requested
    )

    # Which restaurant posted this food
    restaurant = models.ForeignKey(
        Restaurant,
        null=True,
        blank=True,
        on_delete=models.CASCADE,        # Delete products if restaurant is deleted
        related_name='products'          # restaurant.products.all() to get all food items
    )
    name = models.CharField(max_length=100, null=True)
    category = models.CharField(
        max_length=50,
        null=True,
        choices=CATEGORY,
        default='Pickup'
    )
    description = models.TextField(null=True, blank=True)
    # Price in dollars
    price = models.DecimalField(
        max_digits=6,        # Up to 9999.99
        decimal_places=2,
        default=0.00
    )
    # Food image uploaded by restaurant owner
    image = models.ImageField(
        upload_to='products/',   # Saved in media/products/
        null=True,
        blank=True
    )
    # How many servings are available for pickup
    quantity = models.IntegerField(default=1)
    # When the food can be picked up (e.g. "6:00 PM")
    pickup_time = models.CharField(max_length=50, null=True, blank=True)
    # Dietary info like "Halal", "Vegetarian"
    dietary_info = models.CharField(max_length=200, null=True, blank=True)
    # auto_now=True: updates every time the record is saved
    date_created = models.DateTimeField(auto_now=True, null=True)
    # ManyToMany: a product can have tags like ["Mexican", "Spicy"]
    tags = models.ManyToManyField(Tag, blank=True)
    # Whether this food offer is currently available
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name or "Unnamed Product"


class Order(models.Model):
    """
    An order placed by a customer for a product.

    Status flow: Pending → Out for Delivery → Delivered
    (We keep "Out for Delivery" for status tracking even though
    the actual fulfillment is pickup-based.)
    """
    STATUS = (
        ('Pending', 'Pending'),
        ('Ready for Pickup', 'Ready for Pickup'),
        ('Completed', 'Completed'),
    )

    # Who placed the order
    customer = models.ForeignKey(
        Customer,
        null=True,
        on_delete=models.SET_NULL  # Keep order record even if customer is deleted
    )
    # What they ordered
    product = models.ForeignKey(
        Product,
        null=True,
        on_delete=models.SET_NULL  # Keep order record even if product is deleted
    )
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    status = models.CharField(
        max_length=50,
        null=True,
        choices=STATUS,
        default='Pending'
    )
    # Quantity ordered
    quantity = models.IntegerField(default=1)

    def __str__(self):
        return f"Order #{self.pk} - {self.customer} - {self.product}"
