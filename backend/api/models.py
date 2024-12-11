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
    dislikes = models.ManyToManyField(User, related_name='disliked_posts', blank=True)
    # The content the post is about
    content = models.ForeignKey('Content', on_delete=models.CASCADE)
    tags = models.ManyToManyField('Tag', blank=True)

    latitude = models.DecimalField(null=True, decimal_places=6, max_digits=9)  # Allow null temporarily
    longitude = models.DecimalField(null=True, decimal_places=6, max_digits=9)  # Allow null temporarily
    belongs_to = models.ForeignKey(User, on_delete=models.CASCADE, null=True)  # Allow null temporarily


    # This is the user who created the post
    # Use created_by instead of user for clarity
    #created_by = models.TextField(blank=True) # should be checked
    @property
    def total_likes(self):
        return self.likes.count()
    
    @property
    def total_dislikes(self):
        return self.dislikes.count()

    # Many-to-Many relationship with Tags


class Content(models.Model):
    id = models.AutoField(primary_key=True)
    link = models.URLField()  # URL for the content (e.g., Spotify link)

    content_type = models.CharField(max_length=20, choices=[('artist', 'Artist'), ('album', 'Album'), ('track', 'Track')], default='track')

    artist_names = ArrayField(models.CharField(max_length=100), blank=True, default=list)  # Array of artist names
    playlist_name = models.CharField(max_length=200, blank=True)  # Playlist name
    album_name = models.CharField(max_length=200, blank=True)  # Album name
    song_name = models.CharField(max_length=200, blank=True)  # Song name
    genres = ArrayField(models.CharField(max_length=100), blank=True, default=list)  # Array of genres  
    ai_description = models.TextField(blank=True, null=True)  # New field for AI-generated content
    def __str__(self):
        str_to_return = ""
        for artist in self.artist_names:
            str_to_return += artist + ", "
        if self.album_name != "":
            str_to_return += " - " + self.album_name
        if self.song_name != "":
            str_to_return += " - " + self.song_name
        if self.link != "":
            str_to_return += " - " + self.link
        if self.playlist_name != "":
            str_to_return += " - " + self.playlist_name
        return str_to_return

class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


    def __str__(self):
        return self.title


class NowPlaying(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # User triggering the play
    link = models.URLField()  # Link to the song (e.g., Spotify link)
    latitude = models.FloatField()  # Latitude of the location
    longitude = models.FloatField()  # Longitude of the location
    played_at = models.DateTimeField(auto_now_add=True)  # Timestamp of the play

    def __str__(self):
        return f"{self.user.username} played {self.link} at {self.latitude}, {self.longitude}"

class ContentSuggestion(models.Model):
    content = models.ForeignKey(Content, on_delete=models.CASCADE, related_name='suggestions')
    name = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    spotify_url = models.URLField()
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Suggestion for {self.content}: {self.name} by {self.artist}"
