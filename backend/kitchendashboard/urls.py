"""
Root URL configuration for KitchenShare.

All API endpoints live under /api/ so they don't conflict with
the React frontend routes. The admin panel is at /admin/.
Media files (food images) are served in development via the static() helper.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Django admin panel — manage data via browser at /admin/
    path('admin/', admin.site.urls),

    # All our REST API endpoints are prefixed with /api/
    # e.g. /api/products/, /api/orders/, /api/auth/login/
    path('api/', include('Inv.urls')),
]

# In development, Django serves uploaded media files (food images).
# In production, your web server (nginx) handles this instead.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
