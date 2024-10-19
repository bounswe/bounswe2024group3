
import json
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from django.db.models.functions import Concat

#import auth_logout,auth_login,authenticate
from django.contrib.auth import logout as auth_logout,login as auth_login,authenticate

from django.views.decorators.csrf import csrf_exempt

from django.http import JsonResponse

#import messages
from django.contrib import messages


#import User
from django.contrib.auth.models import User

from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt


from datetime import datetime



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

        # Assuming that BiblioSearchUser has a one-to-one relation with Django's User model
        try:
            biblio_user = BiblioSearchUser.objects.get(user=user)
            name = biblio_user.name
            surname = biblio_user.surname
        except BiblioSearchUser.DoesNotExist:
            # Handle case where BiblioSearchUser does not exist for the authenticated user
            name = ''
            surname = ''

        return JsonResponse({
            'message': 'Login successful',
            'username': user.username,
            'user_id': user.id,
            'name': name,
            'surname': surname,
            'email' : user.email
        })
    else:
        return JsonResponse({'error': 'Invalid username or password'}, status=400)
    

@require_http_methods(["GET"])
def get_user(request):
    if request.user.is_authenticated:
        user = request.user
        try:
            biblio_user = BiblioSearchUser.objects.get(user=user)
            name = biblio_user.name
            surname = biblio_user.surname
        except BiblioSearchUser.DoesNotExist:
            # Handle case where BiblioSearchUser does not exist for the authenticated user
            name = ''
            surname = ''

        return JsonResponse({
            'message': 'Login successful',
            'username': user.username,
            'user_id': user.id,
            'name': name,
            'surname': surname,
            'email' : user.email

        })
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
