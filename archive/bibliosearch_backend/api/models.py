from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


# Create your models here.

# Author model
class Author(models.Model):
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)

# Genre model
class Genre(models.Model):
    name = models.CharField(max_length=100)

class Subject(models.Model):
    name = models.CharField(max_length=100)

# Book model with many-to-many relationships with Author and Genre
class Book(models.Model):
    title = models.CharField(max_length=100)
    cover_url = models.URLField(blank=True, null=True)
    authors = models.ManyToManyField(Author, blank=True, null=True)
    genres = models.ManyToManyField(Genre, blank=True, null=True)
    #make isbn unique
    isbn = models.CharField(max_length=13, unique=True)
    description = models.TextField(blank=True, null=True)
    publication_date = models.DateField(blank=True, null=True)
    page_count = models.IntegerField(blank=True, null=True)

    subjects = models.ManyToManyField(Subject, blank=True, null=True)

    def __str__(self):
        return self.title + " (" + self.publication_date + ")"


# Django has its own user model, so we need to create a new model that has a one-to-one relationship with the Django user model
# This is because we want to add more fields to the user model
class BiblioSearchUser(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=100, blank=False)
    surname = models.CharField(max_length=100, blank=False)

    following = models.ManyToManyField('self', 
                                       related_name='followers', 
                                       symmetrical=False,
                                       blank=True)


    fav_authors = models.ManyToManyField(Author, blank=True)
    fav_genres = models.ManyToManyField(Genre, blank=True)

    def create_book_list(self,name, books=None):
        bl = BookList(user=self, name =name)
        bl.save()
        if books:
            for book in books:
                bl.books.add(book)
        return bl
    
# BookList model with many-to-many relationship with Book
# User will have many book lists
class BookList(models.Model):
    name = models.CharField(max_length=255, default='My Book List')
    books = models.ManyToManyField('Book', blank=True)
    user = models.ForeignKey('BiblioSearchUser', on_delete=models.CASCADE)
    
    def __str__(self):
        return f"{self.name} by {self.user}"

    def add_books(self, books):
        """Add a list of books to the booklist."""
        for book in books:
            self.books.add(book)
        self.save()

#
class Post(models.Model):
    content = models.TextField()
    user = models.ForeignKey(
        BiblioSearchUser,
        on_delete=models.CASCADE,
        related_name='book_posts'
    )
    book = models.ForeignKey(
        'Book',  # Use the string name of the model if it's defined later in the same file or in another file
        on_delete=models.CASCADE,
        related_name='posts'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)

    def __str__(self):
        return f"Post by {self.user.username} on {self.created_at.strftime('%Y-%m-%d')}"
      
    
    @property
    def total_likes(self):
        return self.likes.count()

