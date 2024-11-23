from os import getenv

from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt, get_token
from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.shortcuts import get_object_or_404
import json
from .models import PasswordReset, Post, Profile, Tag

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
        data = json.loads(request.body)
        
        # Create post with initial data
        post = Post.objects.create(
            content=data['content'],
            images=data.get('images', []),  
            links=data.get('links', [])    
        )
        
        # Handle tags
        tags = data.get('tags', [])
        for tag_name in tags:
            tag, _ = Tag.objects.get_or_create(name=tag_name)
            post.tags.add(tag)
        
        return JsonResponse({
            'status': 'success',
            'message': 'Post created successfully',
            'data': {
                'id': post.id,
                'content': post.content,
                'images': post.images,
                'links': post.links,
                'timestamp': post.timestamp,
                'tags': list(post.tags.values_list('name', flat=True))
            }
        }, status=201)
        
    except KeyError as e:
        return JsonResponse({
            'status': 'error',
            'message': f'Missing required field: {str(e)}'
        }, status=400)
    except json.JSONDecodeError:
        return JsonResponse({
            'status': 'error',
            'message': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=500)

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
