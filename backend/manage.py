#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
# This is the entry point for all Django management commands.
# Run: python manage.py runserver, migrate, createsuperuser, etc.
import os
import sys


def main():
    """Run administrative tasks."""
    # Points Django to our settings file inside the kitchendashboard package
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'kitchendashboard.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    # Passes command-line arguments (e.g. "runserver") to Django's CLI handler
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
