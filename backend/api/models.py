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
    id = models.AutoField(primary_key=True)
    content = models.TextField()
    images = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    links = ArrayField(models.CharField(max_length=200), blank=True, default=list)
    timestamp = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)

    def __str__(self):
        return f"Post by {self.user.username} on {self.created_at.strftime('%Y-%m-%d')}"
    
    @property
    def total_likes(self):
        return self.likes.count()
    # Many-to-Many relationship with Tags
    tags = models.ManyToManyField('Tag', blank=True)

    

class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


    def __str__(self):
        return self.title