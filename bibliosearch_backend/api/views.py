from django.shortcuts import render

#import auth
from django.contrib.auth import authenticate, login, logout

#import messages
from django.contrib import messages

#import redirect
from django.shortcuts import redirect

#import User
from django.contrib.auth.models import User

#import BiblioSearchUser
from api.models import BiblioSearchUser


#import decorators
from django.contrib.auth.decorators import login_required  


# Create your views here.


# create login view
def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return render(request, 'home.html')
        else:
            return render(request, 'login.html')


def register(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        email = request.POST.get('email')
        name = request.POST.get('name')

        if User.objects.filter(username=username).exists():
            messages.error(request, 'Username already exists')
            return render(request, 'register.html')
        elif User.objects.filter(email=email).exists():
            messages.error(request, 'Email already registered')
            return render(request, 'register.html')
        else:
            user = User.objects.create_user(username=username, email=email, password=password, name=name)

            bibliosearch_user = BiblioSearchUser.objects.create(user=user)

            user.save()
            bibliosearch_user.save()

            # Log the user in and redirect to home
            login(request, user)
            messages.success(request, 'Registration successful')
            return redirect('home')
    else:
        return render(request, 'register.html')

    

# create logout view
def logout(request):
    logout(request)
    return render(request, 'home.html')

# create home view
def home(request):
    return render(request, 'home.html')

