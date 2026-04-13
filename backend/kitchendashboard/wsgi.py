"""
WSGI config for kitchendashboard project.

WSGI (Web Server Gateway Interface) is the standard interface between
Python web apps and web servers. This file is used by:
  - `python manage.py runserver` (development)
  - gunicorn/uwsgi (production)

It exposes the WSGI callable as a module-level variable named `application`.
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kitchendashboard.settings')
application = get_wsgi_application()
