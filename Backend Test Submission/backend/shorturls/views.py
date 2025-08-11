# In shorturls/views.py

from rest_framework import viewsets, status
from rest_framework.response import Response
from django.views import View
from django.http import HttpResponseRedirect, HttpResponseNotFound, HttpResponseGone
from django.utils import timezone
from datetime import timedelta
import string
import random

from .models import ShortURL, Click
from .serailizers import ShortURLSerializer
from backend.logger import Log 

def generate_unique_shortcode(length=6):
    """helper function to generate a unique shortcode"""
    while True:
        code = ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))
        if not ShortURL.objects.filter(shortcode=code).exists():
            return code

class ShortURLViewSet(viewsets.ModelViewSet):
    """
    Handles the /shorturls and /shorturls/{shortcode} endpoints.
    """
    queryset = ShortURL.objects.all()
    serializer_class = ShortURLSerializer
    lookup_field = 'shortcode'

    def create(self, request, *args, **kwargs):
        """
        custom create logic
        """
        Log("info", "handler", "Request received to create short URL.")
        
        original_url = request.data.get('url')
        custom_shortcode = request.data.get('shortcode')
        validity_minutes = request.data.get('validity', 30) #30 min is gonna be default

        if not original_url:
            Log("error", "handler", "Validation failed: 'url' field is missing.")
            return Response({"error": "'url' field is required."}, status=status.HTTP_400_BAD_REQUEST)

        if custom_shortcode:
            if ShortURL.objects.filter(shortcode=custom_shortcode).exists():
                Log("error", "handler", f"Shortcode '{custom_shortcode}' already exists.")
                return Response({"error": "This shortcode is already in use."}, status=status.HTTP_409_CONFLICT)
            shortcode = custom_shortcode
        else:
            shortcode = generate_unique_shortcode()
        
        expires_at = timezone.now() + timedelta(minutes=int(validity_minutes))
        
        instance = ShortURL.objects.create(
            original_url=original_url,
            shortcode=shortcode,
            expires_at=expires_at
        )

        response_data = {
            "shortLink": f"{request.scheme}://{request.get_host()}/{instance.shortcode}",
            "expiry": instance.expires_at.isoformat()
        }
        
        Log("info", "handler", f"Short URL '{shortcode}' created successfully.")
        return Response(response_data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

class RedirectView(View):
    """
    redirection logic
    """
    def get(self, request, shortcode, *args, **kwargs):
        Log("info", "handler", f"Redirect request received for shortcode: {shortcode}")
        try:
            url_object = ShortURL.objects.get(shortcode=shortcode)

            if url_object.expires_at < timezone.now():
                Log("warn", "handler", f"Expired shortcode '{shortcode}' was accessed.")
                return HttpResponseGone("This link has expired.")

            url_object.clicks += 1
            url_object.save() #adds click count
            
            Click.objects.create(
                short_url=url_object,
                referrer=request.META.get('HTTP_REFERER'),
                ip_address=request.META.get('REMOTE_ADDR')
            )
            
            Log("info", "handler", f"Redirecting {shortcode} to {url_object.original_url}")
            return HttpResponseRedirect(url_object.original_url)

        except ShortURL.DoesNotExist:
            Log("warn", "handler", f"non-existent shortcode '{shortcode}' was accessed.")
            return HttpResponseNotFound("short link does not exist.")