"""
Admin panel configuration.

This registers our models with Django's built-in admin at /admin/.
The @admin.register decorator is a cleaner way to register models.
list_display controls which columns appear in the admin list view.
search_fields adds a search bar that searches the specified fields.
list_filter adds a sidebar filter for the specified fields.
"""

from django.contrib import admin
from .models import Customer, Product, Order, Tag, Restaurant


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    # Columns shown in the customer list view
    list_display = ('name', 'phone', 'email', 'date_created')
    # Fields searchable via the admin search bar
    search_fields = ('name', 'email')


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Restaurant)
class RestaurantAdmin(admin.ModelAdmin):
    list_display = ('name', 'cuisine', 'rating', 'is_active', 'date_created')
    search_fields = ('name', 'cuisine')
    # Sidebar filter options
    list_filter = ('cuisine', 'is_active')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'restaurant', 'price', 'quantity', 'is_available', 'date_created')
    search_fields = ('name', 'description')
    list_filter = ('category', 'is_available', 'tags')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'product', 'status', 'quantity', 'date_created')
    search_fields = ('customer__name', 'product__name')
    list_filter = ('status',)
