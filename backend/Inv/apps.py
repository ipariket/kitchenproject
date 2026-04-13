from django.apps import AppConfig


class InvConfig(AppConfig):
    """
    App configuration for the Inv (Inventory/Kitchen) app.
    Django uses this to auto-discover models, admin, signals, etc.
    The 'name' must match the app's Python package name exactly.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Inv'
