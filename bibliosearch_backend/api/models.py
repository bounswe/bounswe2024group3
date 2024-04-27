from django.db import models
from django.contrib.auth.models import User


# Create your models here.

# Author model
class Author(models.Model):
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)

# Genre model
class Genre(models.Model):
    name = models.CharField(max_length=100)

# Book model with many-to-many relationships with Author and Genre
class Book(models.Model):
    title = models.CharField(max_length=100)
    cover_url = models.URLField()
    authors = models.ManyToManyField(Author)
    genres = models.ManyToManyField(Genre)
    isbn = models.CharField(max_length=13)
    description = models.TextField()
    publication_date = models.DateField()
    page_count = models.IntegerField()

    def __str__(self):
        return self.title + " (" + self.publication_date + ")"


# Django has its own user model, so we need to create a new model that has a one-to-one relationship with the Django user model
# This is because we want to add more fields to the user model
class BiblioSearchUser(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=255, default='')  
    surname = models.CharField(max_length=255, default='')

    fav_authors = models.ManyToManyField(Author, blank=True)
    fav_genres = models.ManyToManyField(Genre, blank=True)

    def create_book_list(self, books=None):
        bl = BookList(user=self)
        bl.save()
        if books:
            for book in books:
                bl.books.add(book)
        return bl
    
# BookList model with many-to-many relationship with Book
# User will have many book lists
class BookList(models.Model):
    books = models.ManyToManyField(Book, blank=True)
    user = models.ForeignKey(
        BiblioSearchUser,
        on_delete=models.CASCADE,
    )