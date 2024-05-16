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
    path('api/create_book/', views.create_book_endpoint),
    path('api/login/', views.login),
    path('api/register/', views.register),
    path('api/get_user/', views.get_user),
    path('api/logout/', views.logout),
    path('api/getToken/', views.csrf_token),
    path('api/get_book/', views.get_book),
    path('api/create_booklist/', views.create_booklist),
    path('api/add_books_to_booklist/', views.add_books_to_booklist),
    path('api/get_specific_booklist/', views.get_specific_booklist),
    path('api/get_booklists_of_user/', views.get_booklists_of_user),
    path('api/check_book_in_booklist/', views.check_book_in_booklist),
    path('api/remove_books_from_booklist/', views.remove_books_from_booklist),
    path('api/add_fav_author/', views.add_fav_author),
    path('api/add_fav_genre/', views.add_fav_genre),
    path('api/get_fav_authors/', views.get_fav_authors),
    path('api/get_fav_genres/', views.get_fav_genres),
    path('api/get_all_genres/', views.get_all_genres),
    path('api/get_all_authors/', views.get_all_authors),
    path('api/remove_genre_from_favorites/', views.remove_genre_from_favorites),
    path('api/remove_author_from_favorites/', views.remove_author_from_favorites),
    path('api/get_user_profile/', views.get_user_profile),
    path('api/update_user_profile/', views.update_user_profile),
    path('api/delete_user/', views.delete_user),
    path('api/follow_unfollow_user/', views.follow_unfollow_user),
    path('api/get_all_followings/', views.get_all_followings),
    path('api/get_all_followers/', views.get_all_followers),
    path('api/check_user_follows_user/', views.check_user_follows_user),
    path('api/user_feed/', views.user_feed),
    path('api/like_unlike_post/', views.like_unlike_post),
    path('api/search_users/', views.search_users),
    path('api/search_posts/', views.search_posts),

]
