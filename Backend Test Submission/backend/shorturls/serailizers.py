# In shorturls/serializers.py

from rest_framework import serializers
from .models import ShortURL, Click

class ClickSerializer(serializers.ModelSerializer):
    """
    single click details.
    """
    class Meta:
        model = Click
        fields = ['timestamp', 'referrer', 'ip_address']

class ShortURLSerializer(serializers.ModelSerializer):
    """
    serializer for the shortURL model. it includes nested click details
    """
    click_details = ClickSerializer(many=True, read_only=True)

    class Meta:
        model = ShortURL
        fields = [
            'shortcode',
            'original_url',
            'created_at',
            'expires_at',
            'clicks',
            'click_details',
        ]
        read_only_fields = ['created_at', 'expires_at', 'clicks', 'click_details']