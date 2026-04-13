"""
Django settings for kitchendashboard project.

This configures the Django backend to serve as a REST API for our React frontend.
Key additions over default Django:
  - rest_framework for building the API
  - corsheaders so the React dev server (port 3000) can talk to Django (port 8000)
  - Media file handling for restaurant food images
"""

import os
from pathlib import Path

# BASE_DIR = the 'backend/' folder. All paths are relative to this.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
# In production, load this from an environment variable instead.
SECRET_KEY = os.environ.get(
    'DJANGO_SECRET_KEY',
    'django-insecure-change-this-in-production-kitchenshare-2024'
)

# SECURITY WARNING: don't run with debug turned on in production!
# Set DEBUG=False and configure ALLOWED_HOSTS for deployment.
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

# Hosts that Django will accept requests from.
# '*' allows all in dev; lock this down in production.
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '*').split(',')

# ---------------------------------------------------------------------------
# Installed apps: Django built-ins + our additions
# ---------------------------------------------------------------------------
INSTALLED_APPS = [
    'django.contrib.admin',        # Admin panel at /admin/
    'django.contrib.auth',         # User authentication system
    'django.contrib.contenttypes', # Framework for content types
    'django.contrib.sessions',     # Session framework (stores login state)
    'django.contrib.messages',     # Flash messages framework
    'django.contrib.staticfiles',  # Serves static files in development

    # Third-party
    'rest_framework',              # Django REST Framework — builds our API
    'rest_framework.authtoken',    # Token-based auth (login returns a token)
    'corsheaders',                 # Adds CORS headers so React can call our API

    # Our app
    'Inv',                         # The Inventory/Kitchen app with models & views
]

# ---------------------------------------------------------------------------
# Middleware: request/response processing pipeline (order matters!)
# ---------------------------------------------------------------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',          # MUST be first — adds CORS headers
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Root URL configuration — Django looks here first to route requests
ROOT_URLCONF = 'kitchendashboard.urls'

# Template configuration (still needed for admin panel)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,   # Finds templates inside each app's templates/ folder
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'kitchendashboard.wsgi.application'

# ---------------------------------------------------------------------------
# Database: SQLite for development, easy to swap to PostgreSQL for production
# ---------------------------------------------------------------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation rules (Django built-in)
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ---------------------------------------------------------------------------
# Static files (CSS, JavaScript, Images bundled with the app)
# ---------------------------------------------------------------------------
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# ---------------------------------------------------------------------------
# Media files (user-uploaded content like food images)
# ---------------------------------------------------------------------------
MEDIA_URL = '/media/'                    # URL prefix for media files
MEDIA_ROOT = BASE_DIR / 'media'          # Filesystem path where uploads are saved

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ---------------------------------------------------------------------------
# Django REST Framework configuration
# ---------------------------------------------------------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',  # Token in header
        'rest_framework.authentication.SessionAuthentication', # Cookie-based (admin)
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',  # Open by default; lock per-view
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,  # Return 20 items per page by default
}

# ---------------------------------------------------------------------------
# CORS: Allow React dev server to call our API
# ---------------------------------------------------------------------------
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',    # React dev server (npm start)
    'http://127.0.0.1:3000',
    'http://localhost:5173',    # Vite dev server
    'http://127.0.0.1:5173',
]
# Also allow credentials (cookies/tokens) in cross-origin requests
CORS_ALLOW_CREDENTIALS = True
