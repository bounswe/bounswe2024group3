from django.db import models

# Create your models here.
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
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

class Post(models.Model):
    comment = models.TextField()
    # Single image URL per post
    image = models.URLField(blank=True)
    # Single link per post
    link = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)
    # The content the post is about
    content = models.ForeignKey('Content', on_delete=models.CASCADE)
    tags = models.ManyToManyField('Tag', blank=True)

    # This is the user who created the post
    # Use created_by instead of user for clarity
    #created_by = models.TextField(blank=True) # should be checked
    @property
    def total_likes(self):
        return self.likes.count()

    # Many-to-Many relationship with Tags


class Content(models.Model):
    id = models.AutoField(primary_key=True)
    link = models.URLField()  # URL for the content (e.g., Spotify link)
    description = models.TextField()  # Response from the Spotify API
    content_type = models.CharField(max_length=20, choices=[('artist', 'Artist'), ('album', 'Album'), ('track', 'Track')])

    def __str__(self):
        return f"{self.content_type.capitalize()} - {self.link}"

class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


    def __str__(self):
        return self.title