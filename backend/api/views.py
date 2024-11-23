import os
import requests
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt, get_token
from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.shortcuts import get_object_or_404
import json
from .models import PasswordReset, Post, Profile, Tag, Content
import time
from os import getenv
@require_http_methods(["POST"])
@csrf_exempt
def login(request):
    data = json.loads(request.body)
    username = data['username']
    password = data['password']
    user = authenticate(request, username=username, password=password)

    if user is not None:
        auth_login(request, user)

        # Assuming that Profile has a one-to-one relation with Django's User model
        try:
            profile = Profile.objects.get(user=user)
            name = profile.name
            surname = profile.surname
            labels = profile.labels
        except Profile.DoesNotExist:
            name = ''
            surname = ''
            labels = ''

        return JsonResponse({
            'message': 'Login successful',
            'username': user.username,
            'user_id': user.id,
            'name': name,
            'surname': surname,
            'email': user.email,
            'labels': labels
        })
    else:
        return JsonResponse({'error': 'Invalid username or password'}, status=400)

@require_http_methods(["GET"])
def get_user(request):
    if request.user.is_authenticated:
        user = request.user
        try:
            profile = Profile.objects.get(user=user)
            name = profile.name
            surname = profile.surname
            labels = profile.labels
        except Profile.DoesNotExist:
            name = ''
            surname = ''
            labels = ''

        return JsonResponse({
            'message': 'User details retrieved',
            'username': user.username,
            'user_id': user.id,
            'name': name,
            'surname': surname,
            'email': user.email,
            'labels': labels
        })
    else:
        return JsonResponse({'error': 'User not authenticated'}, status=400)

@require_http_methods(["POST"])
@csrf_exempt
def register(request):
    data = json.loads(request.body)
    name = data['name']
    surname = data['surname']
    username = data['username']
    email = data['email']
    password = data['password']
    labels = data['labels']  # Expecting labels like ['Artist', 'Listener']

    if User.objects.filter(username=username).exists():
        return JsonResponse({'error': 'Username already exists'}, status=400)
    elif User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'Email already registered'}, status=400)
    else:
        user = User.objects.create_user(username=username, email=email, password=password)
        profile = Profile.objects.create(user=user, name=name, surname=surname, labels=labels)
        auth_login(request, user)

        return JsonResponse({
            'message': 'Registration successful',
            'username': user.username,
            'user_id': user.id,
            'name': name,
            'surname': surname,
            'email': user.email,
            'labels': labels
        })

@require_http_methods(["POST"])
@csrf_exempt
def follow_user(request, user_id):
    if request.user.is_authenticated:
        target_user = get_object_or_404(User, id=user_id)
        user_profile = Profile.objects.get(user=request.user)
        target_profile = Profile.objects.get(user=target_user)
        
        user_profile.following.add(target_profile)
        return JsonResponse({'message': f'You are now following {target_user.username}'})
    else:
        return JsonResponse({'error': 'User not authenticated'}, status=400)

@require_http_methods(["POST"])
@csrf_exempt
def unfollow_user(request, user_id):
    if request.user.is_authenticated:
        target_user = get_object_or_404(User, id=user_id)
        user_profile = Profile.objects.get(user=request.user)
        target_profile = Profile.objects.get(user=target_user)
        
        user_profile.following.remove(target_profile)
        return JsonResponse({'message': f'You have unfollowed {target_user.username}'})
    else:
        return JsonResponse({'error': 'User not authenticated'}, status=400)

@require_http_methods(["POST"])
def logout(request):
    auth_logout(request)
    return JsonResponse({'message': 'Logout successful'})

def csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrf_token': csrf_token})

@require_http_methods(["POST"])
@csrf_exempt
def forget_password(request):
    data = json.loads(request.body)
    email = data['email']
    user = User.objects.filter(email__iexact=email).first()

    if user:
        token_generator = PasswordResetTokenGenerator()
        token = token_generator.make_token(user) 
        reset = PasswordReset(email=email, token=token)
        reset.save()

        backend_host = getenv("PROD_HOST")

        if not backend_host:
            backend_host = "0.0.0.0"
        else:
            backend_host = backend_host.split(":")[0]

        reset_url = f"http://{backend_host}:3000/reset/?token={token}" # TODO: make this point to server's domain

        print(
            f"""
            New email:
            to: {email}
            subject: Password Reset

            body:
                to reset your password please go to the following URL:
                {reset_url}
            """
        )
        return JsonResponse({'success': 'We have sent you a link to reset your password'}, status=200)
    else:
        return JsonResponse({"error": "User with credentials not found"}, status=400)
    

@require_http_methods(["POST"])
@csrf_exempt
def reset_password(request):
    data = json.loads(request.body)
    token = data['token']
    new_password = data['new_password']
    confirm_password = data['confirm_password']

    if new_password != confirm_password:
            return JsonResponse({"error": "Passwords do not match"}, status=400)
        
    reset_obj = PasswordReset.objects.filter(token=token).first()
    
    if not reset_obj:
        return JsonResponse({'error':'Invalid token'}, status=400)
    
    user = User.objects.filter(email=reset_obj.email).first()
    
    if user:
        user.set_password(data['new_password'])
        user.save()
        
        reset_obj.delete()
        
        return JsonResponse({'success':'Password updated'})
    else: 
        return JsonResponse({'error':'No user found'}, status=404)


@csrf_exempt
@require_http_methods(["POST"])
def create_post(request):
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    link = body.get('link')
    image = body.get('image')
    comment = body.get('content')
    #created_by = body.get('created_by') # Should be checked
    if not link: # If no link is provided, return an error
            return JsonResponse({"error": "Link and content are required!"}, status=400)
    
    post_content_type = get_content_type(link)  # Detect the content type of the Spotify link
    existing_content = Content.objects.filter(link=link).first() # Check if content already exists in database
    if existing_content: 
        # If content exists, use the existing Content object
        content = existing_content
        print("Content already exists:", content)
    else:
        # If content does not exist, create a new Content object
        # first, fetch the content description from the Spotify API
        access_token = get_access_token()  # Get an access token from Spotify
        if not access_token:
            return JsonResponse({"error": "Failed to get access token"}, status=500)
        headers = {"Authorization": f"Bearer {access_token}"}
        response = requests.get(f"https://api.spotify.com/v1/{post_content_type}s/{link.split('/')[-1]}", headers=headers)
        print("Spotify API response:", response.status_code, response.text)
        if response.status_code != 200:
            return JsonResponse({"error": "Failed to fetch content description"}, status=500)
        content_description = response.json()
        # then, create a new Content object
        content = Content(link=link, content_type=post_content_type, description=content_description)
        content.save()

    #if not created_by:
    #    return JsonResponse({"error": "User is not authenticated"}, status=403)
    
    # post = Post(comment=comment, image=image, link=link, content=content,created_by=created_by) # should be checked
    post = Post(comment=comment, image=image, link=link, content=content) # should be checked

    post.save()

    print("Post created:", post)
    return JsonResponse({"message": "Post created successfully"}, status=201)

def get_content_type(link):
    """Detects whether the Spotify link is for a track, album, playlist, or artist."""
    if "album" in link:
        return "album"
    elif "playlist" in link:
        return "playlist"
    elif "artist" in link:
        return "artist"
    else:
        return "track"



@require_http_methods(["GET"])
def get_posts(request):
    try:
        posts = Post.objects.all().order_by('-timestamp')  # Get all posts, newest first
        posts_data = []
        
        for post in posts:
            posts_data.append({
                'id': post.id,
                'content': post.content,
                'images': post.images,
                'links': post.links,
                'timestamp': post.timestamp,
                'tags': list(post.tags.values_list('name', flat=True))
            })
        
        return JsonResponse({
            'status': 'success',
            'data': posts_data
        })

    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
@require_http_methods(["GET"])
def get_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        post_data = {
            'id': post.id,
            'content': post.content,
            'images': post.images,
            'links': post.links,
            'timestamp': post.timestamp,
            'tags': list(post.tags.values_list('name', flat=True))
        }
        
        return JsonResponse({
            'status': 'success',
            'data': post_data
        })

    except Post.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': 'Post not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)
    
ACCESS_TOKEN = None
TOKEN_EXPIRY = 0

def get_access_token():
    """Fetch a new access token from Spotify."""
    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
    url = "https://accounts.spotify.com/api/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"grant_type": "client_credentials"}
    response = requests.post(url, headers=headers, auth=(client_id, client_secret), data=data)
    if response.status_code == 200:
        token_data = response.json()
        global ACCESS_TOKEN, TOKEN_EXPIRY
        ACCESS_TOKEN = token_data["access_token"]
        TOKEN_EXPIRY = time.time() + token_data["expires_in"] - 60  # Buffer for token renewal
        return ACCESS_TOKEN
    else:
        print(response)
        raise Exception("Failed to get access token: " + response.text)