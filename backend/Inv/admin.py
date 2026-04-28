from django.contrib import admin
from .models import Customer, Product, Order, Tag, Restaurant
admin.site.register(Customer)
admin.site.register(Tag)
admin.site.register(Restaurant)
admin.site.register(Product)
admin.site.register(Order)
