import json
from django.shortcuts import render

#import auth
from django.contrib.auth import authenticate

from django.contrib.auth import logout as auth_logout

from django.contrib.auth import login as auth_login

from django.http import JsonResponse

#import messages
from django.contrib import messages

#import redirect
from django.shortcuts import redirect

#import User
from django.contrib.auth.models import User

#import BiblioSearchUser
from api.models import BiblioSearchUser

from django.views.decorators.csrf import csrf_exempt


#import decorators
from django.contrib.auth.decorators import login_required  


# Create your views here.

# create login view
@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data['username']
        password = data['password']
        user = authenticate(request, username=username, password=password)

        if user is not None:
            auth_login(request, user)
            return JsonResponse({'message': 'Login successful', 'username': user.username})
        else:
            return JsonResponse({'error': 'Invalid username or password'}, status=400)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
        

@csrf_exempt
def register(request):
    if request.method == 'POST':
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
            
    else:
        return render(request, 'register.html')

    

# create logout view
@csrf_exempt
def logout(request):
    auth_logout(request)
    return JsonResponse({'message': 'Logout successful'})

# create home view
def home(request):
    return render(request, 'home.html')

