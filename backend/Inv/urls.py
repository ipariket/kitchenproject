from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('tags', views.TagViewSet)
router.register('restaurants', views.RestaurantViewSet)
router.register('products', views.ProductViewSet, basename='product')
router.register('orders', views.OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', views.register),
    path('auth/login/', views.login_view),
    path('auth/profile/', views.user_profile),
    path('auth/delete-account/', views.delete_account),
    path('dashboard/stats/', views.dashboard_stats),
    path('my-products/', views.my_products),
    path('my-products/<int:pk>/edit/', views.edit_product),
    path('my-products/<int:pk>/delete/', views.delete_product),
]
