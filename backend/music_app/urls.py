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
    path('api/check-following/', views.check_following, name='check_following'),
    path('api/create-post/', views.create_post, name='create_post'),
    path('api/get-user-posts/', views.get_user_posts, name= 'get_user_posts'),
    path('api/get-posts/', views.get_posts, name='get_posts'),
    path('api/get-following-posts/', views.get_following_posts, name='get_following_posts'),
    path('api/posts/<int:post_id>/like/', views.like_post, name='like_post'),
    path('api/posts/<int:post_id>/dislike/', views.dislike_post, name='dislike_post'),
    path('api/most-shared-nearby-things/', views.most_shared_nearby_things, name='most_shared_nearby_things'),
    path('api/save-now-playing/', views.save_now_playing, name='save_now_playing'),
    path('api/most-listened-nearby/', views.most_listened_nearby, name='most_listened_nearby'),
    path('api/search/', views.search, name='search'),
    path('api/random-songs/', views.get_random_songs, name='random_songs'),
    path('api/get_pages_of_spot_embeds/', views.get_pages_of_spot_embeds, name='get_pages_of_spot_embeds'),
    path('api/get_lyrics/', views.get_lyrics, name='get_lyrics'),  
    path('api/get_song_quiz_lyrics/', views.get_song_quiz_lyrics, name='get_song_quiz_lyrics'),
    path('api/search_spotify/', views.search_spotify, name='search_spotify'),
    path('api/spotify/auth/', views.spotify_auth, name='spotify_auth'),
    path('api/spotify/callback/', views.spotify_callback, name='spotify_callback'),
    path('api/spotify/status/', views.spotify_status, name='spotify_status'),
    path('api/spotify/playlists/', views.get_user_playlists, name='get_user_playlists'),
    path('api/spotify/playlist/<str:playlist_id>/', views.get_playlist_details, name='get_playlist_details'),
    path('api/spotify/playlist/<str:playlist_id>/tracks/', views.add_track_to_playlist, name='add_track_to_playlist'),
    path('api/spotify/get_user_spotify_playlists/<int:user_id>/', views.get_user_spotify_playlists, name='get_user_spotify_playlists'),
    path('api/edit_profile/', views.edit_profile, name='edit_profile'),
    path('api/add_profile_picture/', views.add_profile_picture, name='add_profile_picture'),
    path('api/spotify/get_user_spotify_tracks/<int:user_id>/', views.get_user_spotify_tracks, name='get_user_spotify_tracks'),
  # New endpoint
]
