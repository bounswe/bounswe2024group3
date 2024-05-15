import json
from django.shortcuts import get_object_or_404, render
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse

#import auth_logout,auth_login,authenticate
from django.contrib.auth import logout as auth_logout,login as auth_login,authenticate
from django.middleware.csrf import get_token


from django.views.decorators.csrf import csrf_exempt

from django.http import JsonResponse

#import messages
from django.contrib import messages

#import redirect
from django.shortcuts import redirect

#import User
from django.contrib.auth.models import User

#import BiblioSearchUser
from api.models import BiblioSearchUser, Book, BookList

from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt

#import decorators
from django.contrib.auth.decorators import login_required  

from .models import Book, Author, Genre
from datetime import datetime

# Create your views here.

from api.wikidata_client import search_book_by_keyword

@csrf_exempt
def create_post(request):
    data = json.loads(request.body)
    return create_book(data)


def create_book(data):
    try:

        book_data = data.get('book')
        title_data = data.get('title')
        description_data = data.get('description')
        authors_data = data.get('authors')
        genres_data = data.get('genres')
        isbn_data = data.get('ISBN13')
        publication_year = data.get('publicationYear')

        # Retrieve or create the author
        author_name = authors_data['value']
        first_name, last_name = author_name.split(maxsplit=1)  # Simplistic split; consider edge cases
        author, created_author = Author.objects.get_or_create(name=first_name, surname=last_name)

        # Retrieve or create the genre
        genre_name = genres_data['value']
        genre, created_genre = Genre.objects.get_or_create(name=genre_name)
        
        # Prepare book details
        title = title_data['value']
        description = description_data['value']
        cover_url = book_data['value']
        isbn = isbn_data['value']
        # remove hyphens from ISBN
        isbn = isbn.replace('-', '')

        publication_date = datetime.strptime(publication_year['value'], "%Y").date()

        # Create the book object
        book, created_book = Book.objects.get_or_create(
            title=title,
            description=description,
            cover_url=cover_url,
            isbn=isbn,
            publication_date=publication_date
        )
        book.authors.add(author)
        book.genres.add(genre)
        book.save()

        if created_book:
            return JsonResponse({'message': 'Book created successfully!'}, status=201)
        else:
            return JsonResponse({'message': 'Book already exists!'}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@require_http_methods(["GET"])
def search_book(request):
    keyword = request.GET.get('keyword')
    limit = request.GET.get('limit', 50)
    page = request.GET.get('page', 1)

    if not keyword:
        return JsonResponse({"status": "error", "message": "Keyword is required"}, status=400)
    

    try:
        limit = int(limit)
        page = int(page)
    except ValueError:

        return JsonResponse({"status": "error", "message": "Invalid limit or page number"}, status=400)
    status, data = search_book_by_keyword(keyword, limit, page)

    
    if status != 200:
        return JsonResponse({"status": "error", "message": "Failed to retrieve data from wikidata"}, status=status)
    else:
        return JsonResponse({"message":"successfully fetched data" ,"data": data})
    

# create login view
@require_http_methods(["POST"])
def login(request):
        data = json.loads(request.body)
        username = data['username']
        password = data['password']
        user = authenticate(request, username=username, password=password)

        if user is not None:
            auth_login(request, user)
            return JsonResponse({'message': 'Login successful', 'username': user.username})
        else:
            return JsonResponse({'error': 'Invalid username or password'}, status=400)
    
        

@require_http_methods(["POST"])
def register(request):
        # get the name, username, email, and password from the request body
        data = json.loads(request.body)
        name = data['name']
        surname = data['surname']
        username = data['username']
        email = data['email']
        password = data['password']

    
        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists')
            return JsonResponse({'error': 'Username already exists'}, status=400)
        elif User.objects.filter(email=email).exists():
            messages.error(request, 'Email already registered')
            return JsonResponse({'error': 'Email already registered'}, status=400)
        else:

            user = User.objects.create_user(username=username, email=email, password=password)
            
            bibliosearch_user = BiblioSearchUser.objects.create(user=user, name=name, surname=surname)


            user.save()
            bibliosearch_user.save()

            # Log the user in and redirect to home
            auth_login(request, user)
            messages.success(request, 'Registration successful')

            # return json object user  with user details and status code 200
            return JsonResponse({'message': 'Registration successful', 'username': user.username})
            

    

# create logout view
def logout(request):
    auth_logout(request)
    return JsonResponse({'message': 'Logout successful'})


      
def csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token})


@require_http_methods(["POST"])
@login_required
@csrf_exempt
def create_booklist(request):
    data = json.loads(request.body)
    name = data.get('name', 'My Book List')  # Default name if none provided

    # Create a new book list for the user
    user_profile = get_object_or_404(BiblioSearchUser, user=request.user)
    booklist = user_profile.create_book_list(name=name)

    return JsonResponse({'message': 'Booklist created successfully', 'booklist_id': booklist.id, 'booklist_name': booklist.name})




@require_http_methods(["POST"])
@login_required
@csrf_exempt
def add_books_to_booklist(request):
    data = json.loads(request.body)
    booklist_id = data.get('booklist_id')
    book_ids = data.get('book_ids', [])

    if not booklist_id or not book_ids:
        return JsonResponse({'error': 'Missing booklist_id or book_ids'}, status=400)

    booklist = get_object_or_404(BookList, id=booklist_id, user__user=request.user)
    books = Book.objects.filter(id__in=book_ids)

    booklist.add_books(books)

    return JsonResponse({'message': 'Books added successfully', 'booklist_id': booklist.id, 'book_ids': [book.id for book in books]})
