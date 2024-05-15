import json
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse

#import auth_logout,auth_login,authenticate
from django.contrib.auth import logout as auth_logout,login as auth_login,authenticate
from django.middleware.csrf import get_token


from django.http import JsonResponse

#import messages
from django.contrib import messages

#import redirect
from django.shortcuts import redirect

#import User
from django.contrib.auth.models import User

#import BiblioSearchUser
from api.models import BiblioSearchUser

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
