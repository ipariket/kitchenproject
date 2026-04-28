from django.db import models
from django.contrib.auth.models import User

class Customer(models.Model):
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=100, null=True)
    phone = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    city = models.CharField(max_length=100, blank=True, default='')
    date_created = models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.name or ''

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    def __str__(self): return self.name or ''

class Restaurant(models.Model):
    owner = models.OneToOneField(User, null=True, blank=True, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')
    cuisine = models.CharField(max_length=100, blank=True, default='')
    address = models.CharField(max_length=255, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    phone = models.CharField(max_length=15, blank=True, default='')
    image = models.ImageField(upload_to='restaurants/', null=True, blank=True)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    is_active = models.BooleanField(default=True)
    date_created = models.DateTimeField(auto_now_add=True)
    def __str__(self): return self.name

class Product(models.Model):
    restaurant = models.ForeignKey(Restaurant, null=True, blank=True, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')
    cuisine = models.CharField(max_length=100, blank=True, default='')
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    quantity = models.IntegerField(default=1)
    pickup_time = models.CharField(max_length=50, blank=True, default='')
    pickup_duration_mins = models.IntegerField(default=30, help_text='Pickup window in minutes')
    dietary_info = models.CharField(max_length=200, blank=True, default='')
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    tags = models.ManyToManyField(Tag, blank=True)
    is_available = models.BooleanField(default=True)
    def __str__(self): return self.name or ''

class Order(models.Model):
    STATUS = (('Pending','Pending'),('Ready for Pickup','Ready for Pickup'),('Picked Up','Picked Up'),('Completed','Completed'),('Cancelled','Cancelled'))
    customer = models.ForeignKey(Customer, null=True, on_delete=models.SET_NULL)
    product = models.ForeignKey(Product, null=True, on_delete=models.SET_NULL)
    date_created = models.DateTimeField(auto_now_add=True, null=True)
    status = models.CharField(max_length=50, null=True, choices=STATUS, default='Pending')
    quantity = models.IntegerField(default=1)
    scheduled_pickup = models.CharField(max_length=100, blank=True, default='')
    def __str__(self): return f"Order #{self.pk}"
