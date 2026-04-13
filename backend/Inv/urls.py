"""
URL routing for the Inv app's REST API.

Uses DRF's DefaultRouter to auto-generate URL patterns from ViewSets.
A ViewSet registered as router.register('products', ProductViewSet)
auto-creates these URLs:
  GET    /api/products/       → ProductViewSet.list()
  POST   /api/products/       → ProductViewSet.create()
  GET    /api/products/1/     → ProductViewSet.retrieve()
  PUT    /api/products/1/     → ProductViewSet.update()
  DELETE /api/products/1/     → ProductViewSet.destroy()

Additional function-based views are added manually with path().
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# DefaultRouter auto-generates URL patterns for ViewSets
router = DefaultRouter()
router.register('tags', views.TagViewSet)                  # /api/tags/
router.register('restaurants', views.RestaurantViewSet)     # /api/restaurants/
router.register('products', views.ProductViewSet,           # /api/products/
                basename='product')  # basename needed because we override get_queryset()
router.register('orders', views.OrderViewSet,               # /api/orders/
                basename='order')    # basename needed because we override get_queryset()

urlpatterns = [
    # Include all auto-generated ViewSet URLs
    path('', include(router.urls)),

    # Auth endpoints (function-based views, manually routed)
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login_view, name='login'),
    path('auth/profile/', views.user_profile, name='profile'),

    # Dashboard stats for restaurant owners
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
]
