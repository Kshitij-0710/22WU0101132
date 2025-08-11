# In your_app/models.py

from django.db import models
import uuid

class ShortURL(models.Model):
    """
    data for shortened urls
    """
    shortcode = models.CharField(max_length=15, primary_key=True, unique=True)
    
    original_url = models.URLField(max_length=2048)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    clicks = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.shortcode} for {self.original_url[:30]}"


class Click(models.Model):
    """
    click tracker models
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    short_url = models.ForeignKey(ShortURL, on_delete=models.CASCADE, related_name='click_details')
    
    timestamp = models.DateTimeField(auto_now_add=True)
    
    referrer = models.CharField(max_length=2048, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    def __str__(self):
        return f"clicked on {self.short_url.shortcode} at {self.timestamp}"