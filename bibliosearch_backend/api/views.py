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

from .models import Book, Author, Genre, Post
from .create_book import create_book

from datetime import datetime

# Create your views here.

from api.wikidata_client import search_book_by_keyword

@csrf_exempt
def create_post(request):
    try:
        data = json.loads(request.body)
        create_book_response, book = create_book(data)

        if create_book_response.status_code == 400:
            return create_book_response
        
        content = data.get('content')
        django_user = User.objects.get(username=request.user)
        user = BiblioSearchUser.objects.get(user=django_user)

        book_post = Post.objects.create(
            user=user,
            book=book,
            content=content
        )
        return JsonResponse({'message': 'Post created successfully', 'post_id': book_post.id}, status=201)
    
    except BiblioSearchUser.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)
    except KeyError as e:
        return JsonResponse({'error': f'Missing key in request data: {str(e)}'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)



        
    




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
@csrf_exempt
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
@csrf_exempt
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

@require_http_methods(["GET"])
def get_book(request):

    isbn = request.GET.get('isbn')

    isbn = isbn.replace('-', '')

    if not isbn:
        return JsonResponse({'error': 'Missing ISBN'}, status=400)

    book = get_object_or_404(Book, isbn=isbn)
    
    return JsonResponse({
        'title': book.title,
        'cover_url': book.cover_url,
        'authors': [author.name + ' ' + author.surname for author in book.authors.all()],
        'genres': [genre.name for genre in book.genres.all()],
        'isbn': book.isbn,
        'description': book.description,
        'publication_date': book.publication_date,
        'page_count': book.page_count
    })



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
    if not booklist:
        return JsonResponse({'error': 'Booklist not found'}, status=404)
    
    books = Book.objects.filter(id__in=book_ids)
    if not books:
        return JsonResponse({'error': 'Books not found'}, status=404)
    

    booklist.add_books(books)

    return JsonResponse({'message': 'Books added successfully', 'booklist_id': booklist.id, 'book_ids': [book.id for book in books]})


@require_http_methods(["GET"])
@csrf_exempt
def get_specific_booklist(request):
    booklist_id = request.GET.get('booklist_id')

    if not booklist_id:
        return JsonResponse({'error': 'Missing booklist_id'}, status=400)

    booklist = get_object_or_404(BookList, id=booklist_id)
    if not booklist:
        return JsonResponse({'error': 'Booklist not found'}, status=404)

    books_data = [
        {
            'id': book.id,
            'title': book.title,
            'cover_url': book.cover_url,
            'authors': [author.name + ' ' + author.surname for author in book.authors.all()],
            'genres': [genre.name for genre in book.genres.all()],
            'isbn': book.isbn,
            'description': book.description,
            'publication_date': book.publication_date,
            'page_count': book.page_count
        }
        for book in booklist.books.all()
    ]

    return JsonResponse({
        'message': 'Books retrieved successfully',
        'booklist_id': booklist.id,
        'books': books_data
    })

@require_http_methods(["GET"])
@csrf_exempt
def get_booklists_of_user(request):
    user_id = request.GET.get('user_id')

    if not user_id:
        return JsonResponse({'error': 'Missing user_id'}, status=400)

    user = get_object_or_404(BiblioSearchUser, id=user_id)
    if not user:
        return JsonResponse({'error': 'User not found'}, status=404)

    booklists_data = [
        {
            'booklist_name': booklist.name,
            'booklist_id': booklist.id
        }
        for booklist in user.booklist_set.all()
    ]

    return JsonResponse({
        'message': 'Booklists retrieved successfully',
        'user_id': user.id,
        'booklists': booklists_data
    })

@require_http_methods(["GET"])
def check_book_in_booklist(request):
    booklist_id = request.GET.get('booklist_id')
    book_id = request.GET.get('book_id')

    if not booklist_id or not book_id:
        return JsonResponse({'error': 'Missing booklist_id or book_id'}, status=400)

    booklist = get_object_or_404(BookList, id=booklist_id)
    if not booklist:
        return JsonResponse({'error': 'Booklist not found'}, status=404)

    book = get_object_or_404(Book, id=book_id)
    if not book:
        return JsonResponse({'error': 'Book not found'}, status=404)

    if book in booklist.books.all():
        return JsonResponse({'message': 'Book is in the booklist', 'booklist_id': booklist.id, 'book_id': book.id, 'is_in_booklist': True})
    else:
        return JsonResponse({'message': 'Book is not in the booklist', 'booklist_id': booklist.id, 'book_id': book.id,'is_in_booklist': False})
    



@require_http_methods(["DELETE"])
@login_required
@csrf_exempt
def remove_books_from_booklist(request):
    data = json.loads(request.body)
    booklist_id = data.get('booklist_id')
    book_ids = data.get('book_ids', [])

    if not booklist_id or not book_ids:
        return JsonResponse({'error': 'Missing booklist_id or book_ids'}, status=400)

    booklist = get_object_or_404(BookList, id=booklist_id, user__user=request.user)
    if not booklist:
        return JsonResponse({'error': 'Booklist not found'}, status=404)

    books = Book.objects.filter(id__in=book_ids)
    if not books:
        return JsonResponse({'error': 'Books not found'}, status=404)

    booklist.books.remove(*books)

    return JsonResponse({'message': 'Books removed successfully', 'booklist_id': booklist.id, 'book_ids': [book.id for book in books]})


@require_http_methods(["POST"])
@login_required
@csrf_exempt
def add_fav_author(request):
    data = json.loads(request.body)
    author_id = data.get('author_id')
    if not author_id:
        return JsonResponse({'error': 'Missing author_id'}, status=400)

    author = get_object_or_404(Author, id=author_id)
    if not author:
        return JsonResponse({'error': 'Author not found'}, status=404)
        
    user_profile = get_object_or_404(BiblioSearchUser, user=request.user)

    if author in user_profile.fav_authors.all():
        return JsonResponse({'error': 'Author already in favorites'}, status=400)

    user_profile.fav_authors.add(author)

    return JsonResponse({'message': 'Author added to favourites successfully', 'author_id': author.id})


@require_http_methods(["POST"])
@login_required
@csrf_exempt
def add_fav_genre(request):
    data = json.loads(request.body)
    genre_id = data.get('genre_id')
    if not genre_id:
        return JsonResponse({'error': 'Missing genre_id'}, status=400)

    genre = get_object_or_404(Genre, id=genre_id)
    if not genre:
        return JsonResponse({'error': 'Genre not found'}, status=404)

    user_profile = get_object_or_404(BiblioSearchUser, user=request.user)

    if genre in user_profile.fav_genres.all():
        return JsonResponse({'error': 'Genre already in favorites'}, status=400)

    user_profile.fav_genres.add(genre)

    return JsonResponse({'message': 'Genre added to favourites successfully', 'genre_id': genre.id})


@require_http_methods(["GET"])
def get_fav_authors(request):
    user_id = request.GET.get('user_id')

    if not user_id:
        return JsonResponse({'error': 'Missing user_id'}, status=400)

    user = get_object_or_404(BiblioSearchUser, id=user_id)
    if not user:
        return JsonResponse({'error': 'User not found'}, status=404)

    authors_data = [
        {
            'author_id': author.id,
            'author_name': author.name,
            'author_surname': author.surname
        }
        for author in user.fav_authors.all()
    ]

    return JsonResponse({
        'message': 'Favorite authors retrieved successfully',
        'user_id': user.id,
        'authors': authors_data
    })


@require_http_methods(["GET"])
def get_fav_genres(request):
    user_id = request.GET.get('user_id')

    if not user_id:
        return JsonResponse({'error': 'Missing user_id'}, status=400)

    user = get_object_or_404(BiblioSearchUser, id=user_id)
    if not user:
        return JsonResponse({'error': 'User not found'}, status=404)

    genres_data = [
        {
            'genre_id': genre.id,
            'genre_name': genre.name
        }
        for genre in user.fav_genres.all()
    ]


    return JsonResponse({
        'message': 'Favorite genres retrieved successfully',
        'user_id': user.id,
        'genres': genres_data
    })


@require_http_methods(["GET"])
def get_all_genres(request):
    # get all genres except null values and also return if the genre is a favorite of the user or not return all genres
    genres = Genre.objects.exclude(name=None).exclude(name='').all()

    # Check if user is authenticated and exists
    if request.user.is_authenticated:
        user = request.user
        user_profile = BiblioSearchUser.objects.get(user=user)
        fav_genres = user_profile.fav_genres.all()
        genres_data = [
            {
                'genre_id': genre.id,
                'genre_name': genre.name,
                'is_favorite': genre in fav_genres
            }
            for genre in genres
        ]
    else:
        genres_data = [
            {
                'genre_id': genre.id,
                'genre_name': genre.name,
            }
            for genre in genres
        ]
    

    return JsonResponse({'genres': genres_data})

@require_http_methods(["GET"])
def get_all_authors(request):
    # get all authors except null values and also return if the author is a favorite of the user or not return all authors
    authors = Author.objects.exclude(name=None).exclude(name='').all()

    # Check if user is authenticated and exists
    if request.user.is_authenticated:
        user = request.user
        user_profile = BiblioSearchUser.objects.get(user=user)
        fav_authors = user_profile.fav_authors.all()
        authors_data = [
            {
                'author_id': author.id,
                'author_name': author.name,
                'author_surname': author.surname,
                'is_favorite': author in fav_authors
            }
            for author in authors
        ]
    else:
        authors_data = [
            {
                'author_id': author.id,
                'author_name': author.name,
                'author_surname': author.surname,
            }
            for author in authors
        ]
    

    return JsonResponse({'authors': authors_data})


@require_http_methods(["DELETE"])
@csrf_exempt
def remove_genre_from_favorites(request):
    data = json.loads(request.body)
    genre_id = data.get('genre_id')
    if not genre_id:
        return JsonResponse({'error': 'Missing genre_id'}, status=400)

    genre = get_object_or_404(Genre, id=genre_id)
    if not genre:
        return JsonResponse({'error': 'Genre not found'}, status=404)

    user_profile = get_object_or_404(BiblioSearchUser, user=request.user)

    if genre not in user_profile.fav_genres.all():
        return JsonResponse({'error': 'Genre not in favorites'}, status=400)

    user_profile.fav_genres.remove(genre)

    return JsonResponse({'message': 'Genre removed from favorites successfully', 'genre_id': genre.id})


@require_http_methods(["DELETE"])
@csrf_exempt
def remove_author_from_favorites(request):
    data = json.loads(request.body)
    author_id = data.get('author_id')
    if not author_id:
        return JsonResponse({'error': 'Missing author_id'}, status=400)

    author = get_object_or_404(Author, id=author_id)
    if not author:
        return JsonResponse({'error': 'Author not found'}, status=404)

    user_profile = get_object_or_404(BiblioSearchUser, user=request.user)

    if author not in user_profile.fav_authors.all():
        return JsonResponse({'error': 'Author not in favorites'}, status=400)

    user_profile.fav_authors.remove(author)

    return JsonResponse({'message': 'Author removed from favorites successfully', 'author_id': author.id})

@require_http_methods(["GET"])
def get_user_profile(request):
    user_id = request.GET.get('user_id')
    
    if not user_id:
        return JsonResponse({'error': 'Missing user_id'}, status=400)
    
    try:
        user_id = int(user_id)
    except ValueError:
        return JsonResponse({'error': 'Invalid user_id'}, status=400)

    user = get_object_or_404(User, id=user_id)
    user_profile = get_object_or_404(BiblioSearchUser, user=user)


    genres_json_response = get_fav_genres(request)
    # extract json response from get_fav_genres
    fav_genres_data = json.loads(genres_json_response.content)
    fav_genres = fav_genres_data['genres']


    authors_json_response = get_fav_authors(request)
    # extract json response from get_fav_authors
    fav_authors_data = json.loads(authors_json_response.content)
    fav_authors = fav_authors_data['authors']

    booklists_json_response = get_booklists_of_user(request)
    # extract json response from get_booklists_of_user
    booklists_data = json.loads(booklists_json_response.content)
    booklists = booklists_data['booklists']



    return JsonResponse({
        'name': user_profile.name,
        'surname': user_profile.surname,
        'fav_authors': [
            {'author_id': author["author_id"], 'author_name': f"{author["author_name"]} {author["author_surname"]}"} 
            for author in fav_authors
        ],
        'fav_genres': [
            {'genre_id': genre["genre_id"], 'genre_name': genre["genre_name"]} 
            for genre in fav_genres
        ],
        'booklists': [
            {'booklist_name': booklist["booklist_name"], 'booklist_id': booklist["booklist_id"]} 
            for booklist in booklists
        ]
    })


@require_http_methods(["POST"])
@login_required
@csrf_exempt
def update_user_profile(request):
    # Load JSON data from the request body
    data = json.loads(request.body)
    
    # Get the user from the request
    user = request.user
    
    # Retrieve the username, name, surname, and email from the request data
    username = data.get('username')
    name = data.get('name')
    surname = data.get('surname')
    email = data.get('email')
    
    # Validate the provided data
    if username is None or name is None or surname is None or email is None:
        return JsonResponse({'error': 'Missing fields: username, name, surname, and email are required.'}, status=400)
    
    # Update the Django User model fields if they have changed
    if username and username != user.username:
        if User.objects.filter(username=username).exclude(pk=user.pk).exists():
            return JsonResponse({'error': 'This username is already taken.'}, status=400)
        user.username = username

    if email and email != user.email:
        if User.objects.filter(email=email).exclude(pk=user.pk).exists():
            return JsonResponse({'error': 'This email is already in use.'}, status=400)
        user.email = email
    
    # Save the changes to the User model
    user.save()
    
    # Update the BiblioSearchUser model fields
    user_profile = get_object_or_404(BiblioSearchUser, user=user)
    user_profile.name = name
    user_profile.surname = surname
    
    # Save the changes to the BiblioSearchUser model
    user_profile.save()
    
    # Return a success response
    return JsonResponse({
        'message': 'Profile updated successfully',
        'user': {
            'username': user.username,
            'name': user_profile.name,
            'surname': user_profile.surname,
            'email': user.email
        }
    })


@require_http_methods(["DELETE"])
@login_required
@csrf_exempt
def delete_user(request):
    user = request.user
    
    # Delete the user and the BiblioSearchUser profile
    user.delete()
    
    # Return a success response
    return JsonResponse({'message': 'User deleted successfully'})



@require_http_methods(["POST"])
@login_required
@csrf_exempt
def follow_unfollow_user(request):
    # Parse the incoming data
    data = json.loads(request.body)
    target_user_id = data.get('target_user_id')

    #make target_user_id an integer
    try:
        target_user_id = int(target_user_id)
    except ValueError:
        return JsonResponse({'error': 'Invalid target_user_id'}, status=400)
    

    if not target_user_id:
        return JsonResponse({'error': 'Missing target_user_id'}, status=400)
    
    if request.user.id == target_user_id:
        return JsonResponse({'error': 'You cannot follow yourself'}, status=400)
    
    user_profile = get_object_or_404(BiblioSearchUser, user=request.user)

    target_user_profile = get_object_or_404(BiblioSearchUser, user_id=target_user_id)
    
    # Check if the current user is already following the target user
    if user_profile.following.filter(id=target_user_profile.id).exists():
        # If yes, unfollow them
        user_profile.following.remove(target_user_profile)
        action = 'unfollowed'
    else:
        # If no, follow them
        user_profile.following.add(target_user_profile)
        action = 'followed'
    
    return JsonResponse({
        'message': f'Successfully {action} user',
        'target_user_id': target_user_id,
        'action': action
    })


@require_http_methods(["GET"])
@login_required
def get_all_followings(request):
    user_id = request.GET.get('user_id')
    
    if not user_id:
        return JsonResponse({'error': 'Missing user_id'}, status=400)
    
    user_profile = get_object_or_404(BiblioSearchUser, user_id=user_id)
    
    # Get all followings
    followings = user_profile.following.all()

    # Serialize the followings data
    followings_data = [{
        'user_id': following.user.id,
        'username': following.user.username,
        'name': following.name,
        'surname': following.surname
    } for following in followings]

    return JsonResponse({
        'message': 'Followings retrieved successfully',
        'user_id': user_id,
        'followings': followings_data
    })


@require_http_methods(["GET"])
@login_required
def get_all_followers(request):
    user_id = request.GET.get('user_id')
    
    if not user_id:
        return JsonResponse({'error': 'Missing user_id'}, status=400)
    
    user_profile = get_object_or_404(BiblioSearchUser, user_id=user_id)
    
    # Get all followers
    followers = user_profile.followers.all()

    # Serialize the followers data
    followers_data = [{
        'user_id': follower.user.id,
        'username': follower.user.username,
        'name': follower.name,
        'surname': follower.surname
    } for follower in followers]

    return JsonResponse({
        'message': 'Followers retrieved successfully',
        'user_id': user_id,
        'followers': followers_data
    })

@require_http_methods(["GET"])
def check_user_follows_user(request):
    user = request.user
    target_user_id = request.GET.get('target_user_id')
    
    if not user or not target_user_id:
        return JsonResponse({'error': 'Missing user_id or target_user_id'}, status=400)
    
    user_profile = get_object_or_404(BiblioSearchUser, user_id=user.id)
    target_user_profile = get_object_or_404(BiblioSearchUser, user_id=target_user_id)
    
    # Check if the user follows the target user
    follows = user_profile.following.filter(id=target_user_profile.id).exists()
    
    return JsonResponse({
        'message': 'Follow status checked successfully',
        'user_id': user.id,
        'target_user_id': target_user_id,
        'follows': follows
    })


@require_http_methods(["GET"])
def user_feed(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({'error': 'User is not authenticated'}, status=401)

    user_profile = get_object_or_404(BiblioSearchUser, user=user)
    
    # Get the user's followings and include the user themselves
    followings = user_profile.following.all()
    following_users = [following.user for following in followings]  # Extract User instances
    following_users.append(user)  # Include the requesting user

    # Get the posts of the user and their followings
    posts = Post.objects.filter(user__in=following_users).order_by('-created_at')

    posts_data = [
        {
            'user_id': post.user.id,
            'username': post.user.username,
            'content': post.content,
            'created_at': post.created_at.isoformat(),  
            'total_likes': post.total_likes,  
        }
        for post in posts
    ]
        
    return JsonResponse({'posts': posts_data})
