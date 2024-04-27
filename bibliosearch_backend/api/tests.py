from django.test import TestCase

from api.models import *

# Create your tests here.

class BibliosearchUserTestCase(TestCase):
    def setUp(self):
        a = Author(name="Test", surname="Author")
        a.save()
        a2 = Author(name="Test 2", surname="Author 2")
        a2.save()

        g = Genre(name="Test Genre")
        g.save()

        g2 = Genre(name="Test Genre 2")
        g2.save()

        b = Book(title="Test Book", cover_url="http://test.com", isbn="1234567890123", description="Test description", publication_date="2021-01-01", page_count=100)
        b.save()

        b2 = Book(title="Test Book 2", cover_url="http://test2.com", isbn="1234567890124", description="Test description 2", publication_date="2021-01-02", page_count=200)
        b2.save()

        b.authors.add(a)
        b.authors.add(a2)

        b.genres.add(g)
        b.genres.add(g2)

        b2.authors.add(a)
        b2.genres.add(g2)

        b.save()
        b2.save()

        bl = BookList()
        bl.save()

        bl.books.add(b)

        u = User.objects.create_user(username="testuser", password="testpassword")
        u.save()

        bu = BiblioSearchUser(user=u)
        bu.save()
        

        bu.fav_authors.add(a)

        bu.fav_genres.add(g)

        bu.book_lists.add(bl)

        bu.save()

    def test_user_has_fav_authors(self):
        u = User.objects.get(username="testuser")
        bu = BiblioSearchUser.objects.get(user=u)

        self.assertEqual(bu.fav_authors.count(), 1)

    def test_user_has_fav_genres(self):
        u = User.objects.get(username="testuser")
        bu = BiblioSearchUser.objects.get(user=u)

        self.assertEqual(bu.fav_genres.count(), 1)

    def test_user_has_book_lists(self):
        u = User.objects.get(username="testuser")
        bu = BiblioSearchUser.objects.get(user=u)

        self.assertEqual(bu.book_lists.count(), 1)

    def test_user_has_books_in_book_list(self):
        u = User.objects.get(username="testuser")
        bu = BiblioSearchUser.objects.get(user=u)

        bl = bu.book_lists.first()

        self.assertEqual(bl.books.count(), 1)

    def test_user_has_books_in_fav_authors(self):
        u = User.objects.get(username="testuser")
        bu = BiblioSearchUser.objects.get(user=u)

        a = bu.fav_authors.first()

        self.assertEqual(a.book_set.count(), 2)

    def test_user_has_books_in_fav_genres(self):
        u = User.objects.get(username="testuser")
        bu = BiblioSearchUser.objects.get(user=u)

        g = bu.fav_genres.first()

        self.assertEqual(g.book_set.count(), 1)

        