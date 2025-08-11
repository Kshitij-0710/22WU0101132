from rest_framework.routers import DefaultRouter
from shorturls.views import ShortURLViewSet

# This sets up the router for our ViewSet.
router = DefaultRouter()
router.register(r'shorturls', ShortURLViewSet, basename='shorturls')