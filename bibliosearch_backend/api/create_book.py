from django.http import JsonResponse

from django.http import JsonResponse
from .models import Book, Author, Genre
from datetime import datetime

def create_book(data):
    try:
        book_data = data.get('book')
        title_data = data.get('title')
        cover_data = data.get('cover')
        description_data = data.get('description')
        authors_data = data.get('authors')
        genres_data = data.get('genres')
        isbn_data = data.get('ISBN13')
        publication_year = data.get('publicationYear')
        page_data = data.get('pages')

        
        
        # Prepare book details
        if(title_data is not None):
            title = title_data['value']
        else:
            title = None
        
        if(description_data is not None):
            description = description_data['value']
        else:
            description = None
        
        if(cover_data is not None):
            cover_url = book_data['value']
        else:
            cover_url = None
        
        if(isbn_data is not None):
            isbn = isbn_data['value']
            isbn = isbn.replace('-', '')
        else:
            return JsonResponse({'error': 'ISBN is required!'}, status=400), None
        
        if(page_data is not None):
            page_count = page_data['value']
        else:
            page_count = None
        

        if(publication_year is not None):
            publication_date = datetime.strptime(publication_year['value'], "%Y").date()
        else:
            publication_date = None

        # Create the book object
        book, created_book = Book.objects.get_or_create(
            title=title,
            description=description,
            cover_url=cover_url,
            isbn=isbn,
            publication_date=publication_date,
            page_count=page_count

        )

        
        if(authors_data is not None):
            # Retrieve or create the author
            author_name = authors_data['value']
            first_name, last_name = author_name.split(maxsplit=1)  # Simplistic split; consider edge cases
            author, created_author = Author.objects.get_or_create(name=first_name, surname=last_name)

            book.authors.add(author)
        
        if(genres_data is not None):
            # Retrieve or create the genre
            genre_name = genres_data['value']
            genre, created_genre = Genre.objects.get_or_create(name=genre_name)
            book.genres.add(genre)
        book.save()

        if created_book:
            return JsonResponse({'message': 'Book created successfully!'}, status=201), book
        else:
            return JsonResponse({'message': 'Book already exists!'}, status=200), book

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400), None