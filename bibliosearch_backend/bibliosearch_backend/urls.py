"""
URL configuration for bibliosearch_backend project.

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
    path('admin/', admin.site.urls),
    path('api/book/search/', views.search_book),
    path('api/create_post/', views.create_post),
    path('api/login/', views.login),
    path('api/register/', views.register),
    path('api/logout/', views.logout),
    path('api/getToken/', views.csrf_token),
    path('api/create_booklist/', views.create_booklist),
    path('api/add_books_to_booklist/', views.add_books_to_booklist),
    path('api/get_specific_booklist/', views.get_specific_booklist),
    path('api/get_booklists_of_user/', views.get_booklists_of_user),
    path('api/remove_books_from_booklist/', views.remove_books_from_booklist),
]
