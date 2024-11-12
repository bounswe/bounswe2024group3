from django.db import models

# Create your models here.

from django.db import models
from django.contrib.auth.models import User
from django.contrib.gis.db import models as gis_models 

class UserLabel(models.TextChoices):
    ARTIST = 'Artist', 'Artist'
    LISTENER = 'Listener', 'Listener'
    TEACHER = 'Teacher', 'Teacher'
    PRODUCER = 'Producer', 'Producer'
    # Add more labels as needed

class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=100, blank=False)
    surname = models.CharField(max_length=100, blank=False)
    geolocation = gis_models.PointField(blank=True, null=True, geography=True)  # Use PointField for latitude/longitude
    
    # User labels (can select multiple)
    labels = models.CharField(
        max_length=50,
        choices=UserLabel.choices,
        blank=False
    )
    
    # Following and Followers relationships
    following = models.ManyToManyField(
        'self', 
        related_name='followers', 
        symmetrical=False,
        blank=True
    )

    def __str__(self):
        return f"{self.user.username}'s Profile"

    def get_following(self):
        return self.following.all()

    def get_followers(self):
        return self.followers.all()

class PasswordReset(models.Model):
    email = models.EmailField()
    token = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)