from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt, get_token
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
import json
from .models import Profile

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
