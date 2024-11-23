"""
URL configuration for music_app project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from api import views

urlpatterns = [
    path('api/login/', views.login, name='login'),
    path('api/register/', views.register, name='register'),
    path('api/forget-password/', views.forget_password, name='forget_password'),
    path('api/reset-password/', views.reset_password, name='reset_password'),
    path('api/get_user/', views.get_user, name='get_user'),
    path('api/logout/', views.logout, name='logout'),
    path('api/follow/<int:user_id>/', views.follow_user, name='follow_user'),
    path('api/unfollow/<int:user_id>/', views.unfollow_user, name='unfollow_user'),
    path('api/create-post/', views.create_post, name='create_post'),
    path('api/get-posts/', views.get_posts, name='get_posts'),
]
