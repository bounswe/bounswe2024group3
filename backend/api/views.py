import math
import os
import requests
from django.core.paginator import Paginator
from datetime import datetime, timedelta, timezone
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required  
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt, get_token
from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.shortcuts import get_object_or_404
import json
from .models import NowPlaying, PasswordReset, Post, Profile, Tag, Content,SpotifyToken
import time
from django.utils import timezone  # Use this instead of datetime.timezone
from os import getenv
from django.db.models import Count, Q
import random
from .utils import fetch_posts,get_content_description, get_or_create_content_suggestions,get_access_token,fetch_lyrics,get_random_songs_util
import re
from django.shortcuts import redirect
from urllib.parse import quote
from django.http import JsonResponse, HttpResponseRedirect


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
    username = request.GET.get('username')
    
    if not username:
        return JsonResponse({'error': 'Username parameter is required'}, status=400)
    
    try:
        user = User.objects.get(username=username)
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
    except User.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

@require_http_methods(["GET"])
def check_following(request):
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'User not authenticated'}, status=401)
        
    target_username = request.GET.get('username')
    
    if not target_username:
        return JsonResponse({'error': 'Username parameter is required'}, status=400)
    
    try:
        # Get the target user
        target_user = User.objects.get(username=target_username)
        
        # Get the profiles
        user_profile = Profile.objects.get(user=request.user)
        target_profile = Profile.objects.get(user=target_user)
        
        # Check if current user follows target user
        is_following = user_profile.following.filter(id=target_profile.id).exists()
        
        return JsonResponse({
            'is_following': is_following,
            'current_user': request.user.username,
            'target_user': target_username
        })
        
    except User.DoesNotExist:
        return JsonResponse({'error': 'Target user not found'}, status=404)
    except Profile.DoesNotExist:
        return JsonResponse({'error': 'Profile not found'}, status=404)

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


@login_required
@csrf_exempt
@require_http_methods(["POST"])
def create_post(request):
    """
    Create a new post with content and generate AI suggestions
    """
    user = request.user
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    # Extract fields
    link = body.get('link', '').split('?')[0]  # Remove query parameters immediately
    image = body.get('image', '')
    comment = body.get('comment', '')
    latitude = body.get('latitude')
    longitude = body.get('longitude')

    # Validate required fields
    if not link or not comment:
        return JsonResponse({"error": "Link and comment are required!"}, status=400)

    # Set location to None if either coordinate is missing
    if latitude is None or longitude is None:
        latitude = None
        longitude = None

    try:
        # Check for existing content first
        content = Content.objects.filter(link=link).first()
        
        if not content:
            # Only create new content if it doesn't exist
            post_content_type = get_content_type(link)
            
            # Fetch Spotify content
            access_token = get_access_token()
            if not access_token:
                return JsonResponse({"error": "Failed to get Spotify access token"}, status=500)

            # Get content details from Spotify
            headers = {"Authorization": f"Bearer {access_token}"}
            spotify_id = link.split('/')[-1]
            spotify_url = f"https://api.spotify.com/v1/{post_content_type}s/{spotify_id}"
            
            response = requests.get(spotify_url, headers=headers)

            if response.status_code != 200:
                return JsonResponse({
                    "error": f"Failed to fetch Spotify content: {response.status_code}"
                }, status=500)

            # Parse Spotify response based on content type
            content_parsers = {
                "track": parse_spotify_track_response,
                "artist": parse_spotify_artist_response,
                "album": parse_spotify_album_response,
                "playlist": parse_spotify_playlist_response
            }

            print(f"Content type: {post_content_type}")
            
            parser = content_parsers.get(post_content_type)
            if not parser:
                return JsonResponse({
                    "error": f"Unsupported content type: {post_content_type}"
                }, status=400)
                
            parsed_content = parser(response)

            # Prepare metadata for AI description
            metadata = {
                "content_type": post_content_type,
                "song_name": parsed_content.get("song_name", ""),
                "artist_names": ", ".join(parsed_content.get("artist_names", [])),
                "album_name": parsed_content.get("album_name", ""),
                "playlist_name": parsed_content.get("playlist_name", ""),
                "genres": ", ".join(parsed_content.get("genres", [])),
            }

            # Generate AI description
            ai_response = get_content_description(post_content_type, metadata)
            if ai_response:
                ai_description = ai_response.get('description', '')
                # Update genres if they were generated and it's a track/album
                if post_content_type in ['track', 'album']:
                    parsed_content['genres'] = ai_response.get('genres', parsed_content.get('genres', []))
            else:
                ai_description = "AI description generation failed"

                # Create new content
                content = Content(
                    link=link,
                    content_type=post_content_type,
                    artist_names=parsed_content.get("artist_names", []),
                    album_name=parsed_content.get("album_name", ""),
                    playlist_name=parsed_content.get("playlist_name", ""),
                    genres=parsed_content.get("genres", []),
                    song_name=parsed_content.get("song_name", ""),
                    ai_description=ai_description
                )
                content.save()

                # Generate and save AI suggestions
                suggestions = get_or_create_content_suggestions(content)
                if not suggestions:
                    print(f"Warning: Failed to generate suggestions for content {content.id}")


        # Create and save the post
        post = Post(
            comment=comment,
            image=image,
            link=link,
            content=content,
            belongs_to=user,
            latitude=latitude,
            longitude=longitude,
        )
        post.save()

        # Return success response with content details
        return JsonResponse({
            "message": "Post created successfully",
            "post_id": post.id,
            "content_id": content.id,
            "content_type": content.content_type,
            "has_suggestions": bool(content.suggestions.exists())
        }, status=201)

    except requests.RequestException as e:
        return JsonResponse({
            "error": f"Failed to communicate with Spotify API: {str(e)}"
        }, status=503)
    except Exception as e:
        print(f"Error creating post: {str(e)}")  # Log the error
        return JsonResponse({"error": "Failed to create post"}, status=500)


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

def parse_spotify_track_response(response):
    """Parses the Spotify API response for a track."""
    try:
        data = response.json()
        try:
            album_name= data["album"]["name"]
        except:
            album_name = None
        try:
            artist_names = [artist["name"] for artist in data["artists"]]
        except:
            artist_names = None
        try:
            song_name = data["name"]
        except:
            song_name = None


        if "error" in data:
            return None
        return {
            "album_name": album_name,
            "artist_names": artist_names,
            "song_name": song_name

        }
    except json.JSONDecodeError:
        return None
    
def parse_spotify_artist_response(response):
    """Parses the Spotify API response for an artist."""
    try:
        data = response.json()
        try:
            artist_name = data["name"]
        except:
            artist_name = None
        try:
            genres = data["genres"]
        except:
            genres = None
        
        return {
            "artist_names": [artist_name],
            "genres": genres
        }
    except json.JSONDecodeError:
        return None

def parse_spotify_album_response(response):
    """Parses the Spotify API response for an album."""
    try:
        data = response.json()
        try:
            album_name = data["name"]
        except:
            album_name = None
        try:
            artist_names = [artist["name"] for artist in data["artists"]]
        except:
            artist_names = None
        
        return {
            "album_name": album_name,
            "artist_names": artist_names
        }
    except json.JSONDecodeError:
        return None

def parse_spotify_playlist_response(response):
    """Parses the Spotify API response for a playlist."""
    try:
        data = response.json()
        try:
            playlist_name = data["name"]
        except:
            playlist_name = None
        return {
            "playlist_name": playlist_name,
        }
    except json.JSONDecodeError:
        return None

@require_http_methods(["GET"])
def get_user_posts(request):
    username = request.GET.get('username')
    page_number = request.GET.get('page', 1)
    page_size = request.GET.get('page_size', 10)

    if not username:
        return JsonResponse({"error": "Username parameter is required"}, status=400)

    try:
        target_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    posts = Post.objects.filter(belongs_to=target_user).order_by('-created_at')
    
    paginator = Paginator(posts, page_size)
    try:
        page = paginator.page(page_number)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

    posts_data = []
    for post in page.object_list:
        content_data = None
        if post.content:
            content_data = {
                'id': post.content.id,
                'link': post.content.link,
                'content_type': post.content.content_type,
                'artist_names': post.content.artist_names,
                'playlist_name': post.content.playlist_name,
                'album_name': post.content.album_name,
                'song_name': post.content.song_name,
                'genres': post.content.genres,
                'ai_description': post.content.ai_description or "AI description not yet generated",
            }

        post_data = {
            "id": post.id,
            "comment": post.comment,
            "image": post.image,
            "link": post.link,
            "created_at": post.created_at,
            "total_likes": post.total_likes,
            "total_dislikes": post.total_dislikes,
            "tags": [tag.name for tag in post.tags.all()],
            "content": content_data
        }
        posts_data.append(post_data)

    return JsonResponse({
        "posts": posts_data,
        "pagination": {
            "current_page": page.number,
            "total_pages": paginator.num_pages,
            "total_posts": paginator.count,
        }
    })    


@require_http_methods(["GET"])
def get_posts(request):
    post_id = request.GET.get('id')
    post_link = request.GET.get('link')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    page_number = int(request.GET.get('page', 1))
    page_size = int(request.GET.get('page_size', 10))

    posts_data, pagination_or_error, status_code = fetch_posts(
        post_id=post_id,
        post_link=post_link,
        start_date=start_date,
        end_date=end_date,
        page_number=page_number,
        page_size=page_size
    )

    if status_code != 200:
        return JsonResponse({"error": pagination_or_error}, status=status_code)

    response_data = {"posts": posts_data}
    if pagination_or_error:
        response_data["pagination"] = pagination_or_error

    return JsonResponse(response_data)



    
@require_http_methods(["POST"])
@login_required
def like_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        user = request.user
        if user not in post.likes.all():
            if user in post.dislikes.all():
                post.dislikes.remove(user)
    
            post.likes.add(user)
            post.save()
            return JsonResponse({
                'status': 'success',
                'message': 'Post liked'
            })
        else:
            return JsonResponse({
                'status': 'error',
                'message': 'Post already liked'
            }, status=400)
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
    
@require_http_methods(["POST"])
@login_required
def dislike_post(request, post_id):
    try:
        post = Post.objects.get(id=post_id)
        user = request.user
        if user not in post.dislikes.all():
            if user in post.likes.all():
                post.likes.remove(user)
    
            post.dislikes.add(user)
            post.save()
            return JsonResponse({
                'status': 'success',
                'message': 'Post disliked'
            })
        else:
            return JsonResponse({
                'status': 'error',
                'message': 'Post already disliked'
            }, status=400)
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
    


@require_http_methods(["GET"])
@login_required
def most_shared_nearby_things(request):
    try:
        # Extract query parameters
        user_lat = float(request.GET.get('latitude'))
        user_lon = float(request.GET.get('longitude'))
        radius_km = float(request.GET.get('radius', 10))  # Default radius: 10 km
        page = int(request.GET.get('page', 1))  # Default page is 1
        size = int(request.GET.get('size', 10))  # Default page size is 10

        # Validate inputs
        if page < 1 or size < 1:
            return JsonResponse({"error": "Page and size must be positive integers."}, status=400)

        # Fetch paginated songs
        offset = (page - 1) * size
        songs, total_songs = get_most_shared_nearby_songs(user_lat, user_lon, radius_km, offset, size)

        # Calculate total pages
        total_pages = math.ceil(total_songs / size)

        # Return response with pagination metadata
        return JsonResponse({
            "songs": songs,
            "pagination": {
                "page": page,
                "size": size,
                "total_pages": total_pages,
                "total_songs": total_songs,
            }
        }, status=200)

    except ValueError:
        return JsonResponse({"error": "Invalid input for latitude, longitude, radius, page, or size."}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


def get_most_shared_nearby_songs(user_lat, user_lon, radius_km, offset, limit):
    try:
        # Compute bounding box to narrow down the query
        min_lat, max_lat, min_lon, max_lon = bounding_box(user_lat, user_lon, radius_km)

        print(f"Bounding box: {min_lat}, {max_lat}, {min_lon}, {max_lon}")

        # Filter posts within bounding box and calculate counts
        posts_within_radius = Post.objects.filter(
            Q(latitude__gte=min_lat) &
            Q(latitude__lte=max_lat) &
            Q(longitude__gte=min_lon) &
            Q(longitude__lte=max_lon)
        )

        # Further filter posts using the Haversine formula and annotate with song counts
        posts_within_radius = [
            post for post in posts_within_radius
            if haversine(user_lat, user_lon, post.latitude, post.longitude) <= radius_km
        ]
        post_ids = [post.id for post in posts_within_radius]

        # Query songs with pagination
        songs = (
            Post.objects.filter(id__in=post_ids)
            .values('content__link', 'content__description')
            .annotate(count=Count('content__link'))
            .order_by('-count')[offset:offset + limit]
        )

        # Get total count of songs for pagination metadata
        total_songs = len(posts_within_radius)

        return list(songs), total_songs

    except Exception as e:
        raise Exception(f"Error fetching songs: {e}")


def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0  
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def bounding_box(lat, lon, radius_km):
    """
    Calculate the bounding box for a given latitude, longitude, and radius in kilometers.
    """
    lat_delta = radius_km / 111  # 1 degree of latitude is ~111 km
    lon_delta = radius_km / (111 * math.cos(math.radians(lat)))  

    min_lat = lat - lat_delta
    max_lat = lat + lat_delta
    min_lon = lon - lon_delta
    max_lon = lon + lon_delta

    return min_lat, max_lat, min_lon, max_lon


@require_http_methods(["POST"])
@login_required
def save_now_playing(request):
    try:
        # Parse the request body
        body = json.loads(request.body)

        user = request.user  # The authenticated user
        link = body.get("link")
        latitude = body.get("latitude")
        longitude = body.get("longitude")

        # Validate inputs
        if not link or not latitude or not longitude:
            return JsonResponse({"error": "link, latitude, and longitude are required."}, status=400)

        # Save the data to the database
        now_playing = NowPlaying.objects.create(
            user=user,
            link=link,
            latitude=latitude,
            longitude=longitude
        )

        return JsonResponse({"message": "Now playing data saved successfully.", "id": now_playing.id}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON."}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@require_http_methods(["GET"])
@login_required
def most_listened_nearby(request):
    try:
        # Extract query parameters
        user_lat = float(request.GET.get("latitude"))
        user_lon = float(request.GET.get("longitude"))
        radius_km = float(request.GET.get("radius", 10))  # Default radius: 10 km

        # Validate inputs
        if user_lat is None or user_lon is None or radius_km is None or math.isnan(user_lat) or math.isnan(user_lon) or math.isnan(radius_km):
            return JsonResponse({"error": "latitude and longitude are required."}, status=400)

        # Compute bounding box
        min_lat, max_lat, min_lon, max_lon = bounding_box(user_lat, user_lon, radius_km)
        print(f"Bounding box: {min_lat}, {max_lat}, {min_lon}, {max_lon}")

        nearby_tracks = NowPlaying.objects.filter(
            latitude__gte=min_lat,
            latitude__lte=max_lat,
            longitude__gte=min_lon,
            longitude__lte=max_lon
        )

        # Further filter by Haversine formula
        nearby_tracks = [
            track for track in nearby_tracks
            if haversine(user_lat, user_lon, track.latitude, track.longitude) <= radius_km
        ]

        # Get distinct links from NowPlaying in the filtered area
        track_links = [track.link for track in nearby_tracks]

        # Aggregate play counts from NowPlaying
        link_counts = (
            NowPlaying.objects.filter(link__in=track_links)
            .values("link")
            .annotate(count=Count("link"))
            .order_by("-count")
        )

        # Fetch descriptions from Post table for these links
        posts_with_descriptions = {
            post.link: post.content.description
            for post in Post.objects.filter(link__in=[entry["link"] for entry in link_counts])
        }

        # Prepare the result
        result = [
            {
                "link": entry["link"],
                "description": posts_with_descriptions.get(entry["link"], "No description available"),
                "count": entry["count"]
            }
            for entry in link_counts
        ]

        # Return response
        return JsonResponse({"tracks": result}, status=200)

    except ValueError:
        return JsonResponse({"error": "Invalid input for latitude, longitude, or radius."}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

@require_http_methods(["GET"])
@csrf_exempt
def search(request):
    contents = Content.objects.all()

    search_query = request.GET.get('search', '')
    page = int(request.GET.get('page', 1))
    page_size = int(request.GET.get('page_size', 10))



    if search_query:
        contents = Content.objects.filter(
            Q(description__icontains=search_query) |
            Q(content_type__icontains=search_query) |
            Q(link__icontains=search_query)
        )
    else:
        contents = Content.objects.all()

    total_results = contents.count()

    # Implement pagination
    start = (page - 1) * page_size
    end = start + page_size
    contents_paginated = contents[start:end]
    
    content_list = list(contents_paginated.values())

    response = {
        'total_results': total_results,
        'page': page,
        'page_size': page_size,
        'contents': content_list
    }

    return JsonResponse(response)

@require_http_methods(["GET"])
def get_random_songs(request):
    """
    Fetch random songs from Spotify.
    Query parameters:
    - limit: number of songs to return (default: 5, max: 20)
    - genre: specific genre to filter by (optional)
    - q: search query (optional)
    """
    try:
        limit = min(int(request.GET.get('limit', 5)), 20)
        
        # Build search params from request
        search_params = {}
        if request.GET.get('q'):
            search_params['q'] = request.GET.get('q')
        if request.GET.get('genre'):
            search_params['q'] = f"genre:{request.GET.get('genre')}"

        selected_tracks = get_random_songs_util(search_params=search_params, limit=limit)
        if not selected_tracks:
            return JsonResponse({"error": "Failed to fetch from Spotify API"}, status=500)
        
        songs = [{
            'link': track['external_urls']['spotify'],
            'name': track['name'],
            'artist': track['artists'][0]['name']
        } for track in selected_tracks]

        return JsonResponse({
            'songs': songs,
            'count': len(songs)
        })

    except ValueError:
        return JsonResponse({"error": "Invalid limit parameter"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@require_http_methods(["GET"])
def get_pages_of_spot_embeds(request):
    """
    Fetch posts with AI descriptions and content suggestions
    """
    try:
        # Get parameters from request
        post_id = request.GET.get('id')
        post_link = request.GET.get('link')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        page_number = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 10))

        # Fetch posts using the utility function
        posts_data, pagination_or_error, status_code = fetch_posts(
            post_id=post_id,
            post_link=post_link,
            start_date=start_date,
            end_date=end_date,
            page_number=page_number,
            page_size=page_size
        )

        if status_code != 200 and not post_link:
            return JsonResponse({"error": pagination_or_error}, status=status_code)

        content_data = None
        
        # Try to get content either from posts or directly
        if posts_data:
            content = Content.objects.get(id=posts_data[0]['content']['id'])
        elif post_link:
            # Clean the link
            clean_link = post_link.split('?')[0]
            
            # Try to get existing content
            content = Content.objects.filter(link=clean_link).first()
            
            if not content:
                # Generate new content similar to create_post
                post_content_type = get_content_type(clean_link)
                
                # Fetch Spotify content
                access_token = get_access_token()
                if not access_token:
                    return JsonResponse({"error": "Failed to get Spotify access token"}, status=500)

                # Get content details from Spotify
                headers = {"Authorization": f"Bearer {access_token}"}
                spotify_id = clean_link.split('/')[-1]
                spotify_url = f"https://api.spotify.com/v1/{post_content_type}s/{spotify_id}"
                
                response = requests.get(spotify_url, headers=headers)
                if response.status_code != 200:
                    return JsonResponse({
                        "error": f"Failed to fetch Spotify content: {response.status_code}"
                    }, status=500)

                # Parse Spotify response
                content_parsers = {
                    "track": parse_spotify_track_response,
                    "artist": parse_spotify_artist_response,
                    "album": parse_spotify_album_response,
                    "playlist": parse_spotify_playlist_response
                }
                
                parser = content_parsers.get(post_content_type)
                if not parser:
                    return JsonResponse({
                        "error": f"Unsupported content type: {post_content_type}"
                    }, status=400)
                    
                parsed_content = parser(response)

                # Prepare metadata for AI description
                metadata = {
                    "content_type": post_content_type,
                    "song_name": parsed_content.get("song_name", ""),
                    "artist_names": ", ".join(parsed_content.get("artist_names", [])),
                    "album_name": parsed_content.get("album_name", ""),
                    "playlist_name": parsed_content.get("playlist_name", ""),
                    "genres": ", ".join(parsed_content.get("genres", [])),
                }

                # Generate AI description
                ai_response = get_content_description(post_content_type, metadata)
                if ai_response:
                    ai_description = ai_response.get('description', '')
                    # Update genres if they were generated and it's a track/album
                    if post_content_type in ['track', 'album']:
                        parsed_content['genres'] = ai_response.get('genres', parsed_content.get('genres', []))
                else:
                    ai_description = "AI description generation failed"

                # Create new content
                content = Content(
                    link=clean_link,
                    content_type=post_content_type,
                    artist_names=parsed_content.get("artist_names", []),
                    album_name=parsed_content.get("album_name", ""),
                    playlist_name=parsed_content.get("playlist_name", ""),
                    genres=parsed_content.get("genres", []),
                    song_name=parsed_content.get("song_name", ""),
                    ai_description=ai_description
                )
                content.save()

        if content:

            if content.ai_description == "AI description generation failed" or not content.ai_description:
                # Prepare metadata for AI description
                metadata = {
                    "content_type": content.content_type,
                    "song_name": content.song_name,
                    "artist_names": ", ".join(content.artist_names),
                    "album_name": content.album_name,
                    "playlist_name": content.playlist_name,
                    "genres": ", ".join(content.genres),
                }

                # Try to generate AI description again
                new_ai_response = get_content_description(content.content_type, metadata)
                if new_ai_response:
                    content.ai_description = new_ai_response.get('description', '')
                    # Update genres if they were generated and it's a track/album
                    if content.content_type in ['track', 'album']:
                        content.genres = new_ai_response.get('genres', content.genres)
                    content.save()
            # Get or create suggestions for the content
            suggestions = get_or_create_content_suggestions(content)

            # Prepare content data with suggestions
            content_data = {
                'id': content.id,
                'link': content.link,
                'content_type': content.content_type,
                'artist_names': content.artist_names,
                'playlist_name': content.playlist_name,
                'album_name': content.album_name,
                'song_name': content.song_name,
                'genres': content.genres,
                'ai_description': content.ai_description or "AI description not yet generated",
                'suggestions': [{
                    'name': suggestion.name,
                    'artist': suggestion.artist,
                    'spotify_url': suggestion.spotify_url,
                    'reason': suggestion.reason
                } for suggestion in suggestions]
            }

        # Process posts without content information
        processed_posts = []
        if posts_data:
            for post in posts_data:
                post_copy = post.copy()
                del post_copy['content']  # Remove content since we're returning it separately
                processed_posts.append(post_copy)

        # Prepare response data
        response_data = {
            "posts": processed_posts,
            "content": content_data
        }
        if pagination_or_error:
            response_data["pagination"] = pagination_or_error

        return JsonResponse(response_data)

    except Content.DoesNotExist:
        return JsonResponse({"error": "Content not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@require_http_methods(["GET"])
def get_lyrics(request):
    """
    Get lyrics from database or fetch from Musixmatch if not available.
    Query parameters:
    - spotify_url: Spotify URL to lookup content and fetch lyrics
    - force_refresh: Optional boolean to force refresh lyrics from Musixmatch
    """
    try:
        spotify_url = request.GET.get('spotify_url')
        force_refresh = request.GET.get('force_refresh', '').lower() == 'true'
        
        if not spotify_url:
            return JsonResponse({"error": "spotify_url parameter is required"}, status=400)

        # Clean the URL by removing query parameters
        spotify_url = spotify_url.split('?')[0]

        # Find the content in database
        content = Content.objects.filter(link=spotify_url).first()
        if not content:
            return JsonResponse({"error": "Content not found in database"}, status=404)

        # Only tracks have lyrics
        if content.content_type != 'track':
            return JsonResponse({"error": "Lyrics are only available for tracks"}, status=400)

        # Return existing lyrics if available and not forcing refresh
        if content.lyrics and not force_refresh:
            return JsonResponse({
                "lyrics": content.lyrics,
                "source": "database"
            })

        # If we need to fetch new lyrics
        if not content.artist_names or not content.song_name:
            return JsonResponse({"error": "Missing artist or song information"}, status=400)

        # Format artist name for URL (use first artist if multiple)
        artist_name = '-'.join(content.artist_names).replace(' ', '-')        
        print(artist_name)
        song_name = content.song_name.split(' - ')[0]
        
        # Replace quotes and clean up special characters
        song_name = song_name.replace('"', '')
        song_name = song_name.replace(' ', '-')
        # Remove special characters from names
        artist_name = re.sub(r'[^a-zA-Z0-9-]', '', artist_name)
        song_name = re.sub(r'[^a-zA-Z0-9-]', '', song_name)

        musixmatch_url = f"https://www.musixmatch.com/lyrics/{artist_name}/{song_name}"

        # Fetch and parse lyrics
        lyrics = fetch_lyrics(musixmatch_url)
        if not lyrics or lyrics == "Lyrics not found.":
            if content.lyrics:  # Keep old lyrics if fetch fails
                return JsonResponse({
                    "lyrics": content.lyrics,
                    "source": "database"
                })
            return JsonResponse({"error": "Failed to fetch lyrics"}, status=404)

        # Update the database with new lyrics
        content.lyrics = lyrics
        content.save()

        return JsonResponse({
            "lyrics": lyrics,
            "source": "musixmatch",
            "source_url": musixmatch_url
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



@require_http_methods(["GET"])
def get_song_quiz_lyrics(request):
    try:
        base_query = Content.objects.filter(
            content_type='track',
            lyrics__isnull=False
        ).exclude(
            lyrics__exact=''
        ).exclude(
            lyrics='Lyrics not found.'
        )

        print(base_query)

        # Apply genre filter if provided
        if request.GET.get('genre'):
            requested_genre = request.GET.get('genre')
            # Use __icontains for case-insensitive search within the array
            base_query = base_query.filter(genres__icontains=requested_genre)


        # Get a random track from the filtered query
        correct_content = base_query.order_by('?').first()

        if not correct_content:
            return JsonResponse({"error": "No songs with lyrics found in database"}, status=404)

        # Build search params from request for the other 3 songs
        search_params = {}
        query_parts = []
        
        if request.GET.get('genre'):
            query_parts.append(f"genre:{request.GET.get('genre')}")
        if request.GET.get('year'):
            query_parts.append(f"year:{request.GET.get('year')}")
            
        if query_parts:
            search_params['q'] = ' '.join(query_parts)

        # Get 3 random tracks from Spotify
        other_tracks = get_random_songs_util(search_params=search_params, limit=3)
        if not other_tracks:
            return JsonResponse({"error": "Failed to fetch additional songs from Spotify"}, status=500)

        # Combine all tracks for options
        all_tracks = [{
            "link": correct_content.link,
            "name": correct_content.song_name,
            "artist": correct_content.artist_names[0]
        }] + [{
            "link": track['external_urls']['spotify'],
            "name": track['name'],
            "artist": track['artists'][0]['name']
        } for track in other_tracks]

        # Shuffle the options
        random.shuffle(all_tracks)

        # Get a random lyric snippet from the correct track
        lyrics_lines = [line.strip() for line in correct_content.lyrics.split('.') if line.strip()]
        if not lyrics_lines:
            return JsonResponse({"error": "No valid lyrics found"}, status=404)
            
        start_idx = random.randint(0, len(lyrics_lines) - 1)
        num_lines = random.randint(1, min(2, len(lyrics_lines) - start_idx))
        lyric_snippet = ' '.join(lyrics_lines[start_idx:start_idx + num_lines])

        # Prepare the quiz data
        quiz_data = {
            "lyric_snippet": lyric_snippet,
            "options": all_tracks,
            "correct_link": correct_content.link
        }

        return JsonResponse(quiz_data)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@require_http_methods(["GET"])
def search_spotify(request):
    """
    Simple Spotify search endpoint.
    Query parameters:
    - q: search query (required)
    - type: comma-separated list of types to search (optional, default: 'track,album,artist')
    - limit: maximum number of results (optional, default: 20)
    """
    try:
        # Get query parameters
        query = request.GET.get('q')
        types = request.GET.get('type', 'track,album,artist')
        limit = min(int(request.GET.get('limit', 20)), 50)  # Cap at 50 results

        if not query:
            return JsonResponse({
                "error": "Search query is required"
            }, status=400)

        # Get Spotify access token
        access_token = get_access_token()
        if not access_token:
            return JsonResponse({
                "error": "Failed to get Spotify access token"
            }, status=500)

        # Make request to Spotify Search API
        response = requests.get(
            'https://api.spotify.com/v1/search',
            headers={"Authorization": f"Bearer {access_token}"},
            params={
                'q': query,
                'type': types,
                'limit': limit
            }
        )

        if response.status_code != 200:
            return JsonResponse({
                "error": f"Spotify API error: {response.status_code}"
            }, status=response.status_code)

        data = response.json()
        results = {}

        # Process tracks
        if 'tracks' in data:
            results['tracks'] = [{
                'id': track['id'],
                'name': track['name'],
                'artists': [artist['name'] for artist in track['artists']],
                'album': track['album']['name'],
                'preview_url': track['preview_url'],
                'external_url': track['external_urls']['spotify'],
                'image_url': track['album']['images'][0]['url'] if track['album']['images'] else None
            } for track in data['tracks']['items']]

        # Process albums
        if 'albums' in data:
            results['albums'] = [{
                'id': album['id'],
                'name': album['name'],
                'artists': [artist['name'] for artist in album['artists']],
                'release_date': album['release_date'],
                'external_url': album['external_urls']['spotify'],
                'image_url': album['images'][0]['url'] if album['images'] else None
            } for album in data['albums']['items']]

        # Process artists
        if 'artists' in data:
            results['artists'] = [{
                'id': artist['id'],
                'name': artist['name'],
                'genres': artist['genres'],
                'external_url': artist['external_urls']['spotify'],
                'image_url': artist['images'][0]['url'] if artist['images'] else None
            } for artist in data['artists']['items']]

        return JsonResponse({
            "results": results,
            "query": query
        })

    except ValueError:
        return JsonResponse({
            "error": "Invalid limit parameter"
        }, status=400)
    except requests.RequestException as e:
        return JsonResponse({
            "error": f"Failed to communicate with Spotify API: {str(e)}"
        }, status=503)
    except Exception as e:
        return JsonResponse({
            "error": str(e)
        }, status=500)



@require_http_methods(["GET"])
def spotify_auth(request):
    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    redirect_uri = "http://localhost:8000/api/spotify/callback/"
    scope = "playlist-modify-public playlist-modify-private user-read-private"
    
    # Make sure to properly encode the redirect URI and scope
    encoded_redirect_uri = quote(redirect_uri)
    encoded_scope = quote(scope)
    
    auth_url = (
        "https://accounts.spotify.com/authorize"
        f"?client_id={client_id}"
        f"&response_type=code"
        f"&redirect_uri={encoded_redirect_uri}"
        f"&scope={encoded_scope}"
        "&show_dialog=true"
    )
    print(auth_url)
    return JsonResponse({"auth_url": auth_url})


@require_http_methods(["GET"])
def spotify_status(request):
    access_token = request.session.get("spotify_access_token")
    refresh_token = request.session.get("spotify_refresh_token")

    if not access_token:
        return JsonResponse({"connected": False})

    # Test if the access token is still valid
    response = requests.get(
        "https://api.spotify.com/v1/me",
        headers={"Authorization": f"Bearer {access_token}"},
    )

    # If token expired or invalid, attempt to refresh
    if response.status_code == 401:
        if not refresh_token:
            return JsonResponse({"connected": False})

        refresh_response = requests.post(
            "https://accounts.spotify.com/api/token",
            data={
                "grant_type": "refresh_token",
                "refresh_token": refresh_token,
                "client_id": os.getenv("SPOTIFY_CLIENT_ID"),
                "client_secret": os.getenv("SPOTIFY_CLIENT_SECRET"),
            },
        )

        if refresh_response.status_code != 200:
            return JsonResponse({"connected": False})

        tokens = refresh_response.json()
        access_token = tokens.get("access_token")

        # Update session with new token
        request.session["spotify_access_token"] = access_token

    return JsonResponse({"connected": True})


def spotify_callback(request):
    code = request.GET.get("code")

    if not code:
        return JsonResponse({"error": "Authorization code missing"}, status=400)

    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
    redirect_uri = "http://localhost:8000/api/spotify/callback/"

    try:
        # Get access token
        token_response = requests.post(
            "https://accounts.spotify.com/api/token",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": redirect_uri,
                "client_id": client_id,
                "client_secret": client_secret,
            },
        )

        if token_response.status_code != 200:
            print(f"Token response error: {token_response.status_code}")
            print(f"Token response content: {token_response.text}")
            return JsonResponse({"error": "Failed to get access token"}, status=500)
        
        token_data = token_response.json()
        access_token = token_data.get("access_token")
        refresh_token = token_data.get("refresh_token")
        expires_in = token_data.get("expires_in", 3600)

        if not access_token:
            return JsonResponse({"error": "Access token not found"}, status=500)

        # Calculate expiration time
        expires_at = timezone.now() + timedelta(seconds=expires_in)

        # Fetch user's Spotify profile with error logging
        profile_response = requests.get(
            "https://api.spotify.com/v1/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )

        print(f"Profile response status: {profile_response.status_code}")
        print(f"Profile response content: {profile_response.text}")

        if profile_response.status_code != 200:
            return JsonResponse({
                "error": f"Failed to fetch Spotify profile. Status: {profile_response.status_code}, Response: {profile_response.text}"
            }, status=500)

        profile_data = profile_response.json()
        spotify_user_id = profile_data.get("id")

        if not spotify_user_id:
            return JsonResponse({"error": "Spotify user ID not found in profile"}, status=500)

        # Check if user is authenticated
        if not request.user.is_authenticated:
            return JsonResponse({"error": "User not authenticated"}, status=401)

        # Save or update the SpotifyToken
        spotify_token, created = SpotifyToken.objects.update_or_create(
            user=request.user,
            defaults={
                'access_token': access_token,
                'refresh_token': refresh_token,
                'spotify_user_id': spotify_user_id,
                'expires_at': expires_at
            }
        )

        request.session["spotify_access_token"] = access_token
        request.session["spotify_refresh_token"] = refresh_token

        return HttpResponseRedirect("http://localhost:3000/view-playlist?connected=true")

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return JsonResponse({"error": str(e)}, status=500)
        
            
@require_http_methods(["GET"])
def get_user_spotify_playlists(request, user_id):
    """Get public playlists for a specific user."""
    try:
        # Get user's Spotify token
        try:
            user = User.objects.get(id=user_id)
            spotify_token = SpotifyToken.objects.get(user=user)
        except (User.DoesNotExist, SpotifyToken.DoesNotExist):
            return JsonResponse({
                "error": "User not found or not connected to Spotify",
                "is_connected": False
            }, status=200)  # Return 200 but indicate not connected

        # Use the stored access token
        access_token = spotify_token.access_token

        # Fetch playlists from Spotify API
        response = requests.get(
            f'https://api.spotify.com/v1/users/{spotify_token.spotify_user_id}/playlists',
            headers={"Authorization": f"Bearer {access_token}"},
            params={"limit": 50}
        )

        if response.status_code == 401:
            # Token expired, try to refresh
            refresh_token = spotify_token.refresh_token
            if not refresh_token:
                return JsonResponse({
                    "error": "Spotify token expired and no refresh token available",
                    "is_connected": False
                }, status=401)

            # Try to refresh the token
            refresh_response = requests.post(
                "https://accounts.spotify.com/api/token",
                data={
                    "grant_type": "refresh_token",
                    "refresh_token": refresh_token,
                    "client_id": os.getenv("SPOTIFY_CLIENT_ID"),
                    "client_secret": os.getenv("SPOTIFY_CLIENT_SECRET"),
                },
            )

            if refresh_response.status_code != 200:
                return JsonResponse({
                    "error": "Failed to refresh token",
                    "is_connected": False
                }, status=401)

            # Update access token in database
            tokens = refresh_response.json()
            new_access_token = tokens.get("access_token")
            spotify_token.access_token = new_access_token
            spotify_token.save()

            # Retry the playlist request with new token
            response = requests.get(
                f'https://api.spotify.com/v1/users/{spotify_token.spotify_user_id}/playlists',
                headers={"Authorization": f"Bearer {new_access_token}"},
                params={"limit": 50}
            )

        if response.status_code != 200:
            return JsonResponse({
                "error": f"Failed to fetch playlists: {response.status_code}",
                "is_connected": True
            }, status=500)

        data = response.json()
        
        # Process and return only public playlists
        playlists = [{
            'id': playlist['id'],
            'name': playlist['name'],
            'description': playlist['description'],
            'image_url': playlist['images'][0]['url'] if playlist['images'] else None,
            'tracks_total': playlist['tracks']['total'],
            'external_url': playlist['external_urls']['spotify']
        } for playlist in data['items'] if playlist['public']]

        return JsonResponse({
            "playlists": playlists,
            "total": len(playlists),
            "is_connected": True
        })

    except requests.RequestException as e:
        return JsonResponse({
            "error": f"Failed to communicate with Spotify API: {str(e)}"
        }, status=503)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
# backend/api/views.py


@require_http_methods(["GET"])
def get_user_playlists(request):
    """Get user's Spotify playlists."""
    access_token = request.session.get("spotify_access_token")
    if not access_token:
        return JsonResponse({"error": "Not connected to Spotify"}, status=401)

    try:
        # Get query parameters for pagination
        limit = min(int(request.GET.get('limit', 20)), 50)  # Cap at 50 playlists
        offset = int(request.GET.get('offset', 0))

        # Get user's playlists from Spotify
        response = requests.get(
            'https://api.spotify.com/v1/me/playlists',
            headers={"Authorization": f"Bearer {access_token}"},
            params={
                'limit': limit,
                'offset': offset
            }
        )

        if response.status_code == 401:
            # Token expired, try to refresh
            refresh_token = request.session.get("spotify_refresh_token")
            if not refresh_token:
                return JsonResponse({"error": "Spotify session expired"}, status=401)

            # Refresh the token
            refresh_response = requests.post(
                "https://accounts.spotify.com/api/token",
                data={
                    "grant_type": "refresh_token",
                    "refresh_token": refresh_token,
                    "client_id": os.getenv("SPOTIFY_CLIENT_ID"),
                    "client_secret": os.getenv("SPOTIFY_CLIENT_SECRET"),
                },
            )

            if refresh_response.status_code != 200:
                return JsonResponse({"error": "Failed to refresh token"}, status=401)

            # Update access token and retry request
            tokens = refresh_response.json()
            access_token = tokens.get("access_token")
            request.session["spotify_access_token"] = access_token

            response = requests.get(
                'https://api.spotify.com/v1/me/playlists',
                headers={"Authorization": f"Bearer {access_token}"},
                params={
                    'limit': limit,
                    'offset': offset
                }
            )

        if response.status_code != 200:
            return JsonResponse({
                "error": f"Spotify API error: {response.status_code}"
            }, status=response.status_code)

        data = response.json()
        
        # Process playlists to include additional information
        playlists = []
        for item in data['items']:
            playlist = {
                'id': item['id'],
                'name': item['name'],
                'description': item['description'],
                'public': item['public'],
                'tracks_total': item['tracks']['total'],
                'external_url': item['external_urls']['spotify'],
                'image_url': item['images'][0]['url'] if item['images'] else None,
                'owner': {
                    'display_name': item['owner']['display_name'],
                    'id': item['owner']['id']
                },
                'followers': item.get('followers', {}).get('total'),
                'created_at': None,  # Spotify API doesn't provide this directly
                'last_modified': None  # Will be fetched for each playlist
            }
            playlists.append(playlist)

        return JsonResponse({
            "playlists": playlists,
            "total": data['total'],
            "limit": limit,
            "offset": offset,
            "next": data['next'],
            "previous": data['previous']
        })

    except ValueError:
        return JsonResponse({"error": "Invalid limit or offset parameter"}, status=400)
    except requests.RequestException as e:
        return JsonResponse({"error": str(e)}, status=503)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["GET"])
def get_playlist_details(request, playlist_id):
    """Get detailed information about a specific playlist."""
    access_token = request.session.get("spotify_access_token")
    print(access_token)
    if not access_token:
        return JsonResponse({"error": "Not connected to Spotify"}, status=401)

    try:
        # Get playlist details
        response = requests.get(
            f'https://api.spotify.com/v1/playlists/{playlist_id}',
            headers={"Authorization": f"Bearer {access_token}"}
        )

        if response.status_code != 200:
            return JsonResponse({
                "error": f"Failed to fetch playlist: {response.status_code}"
            }, status=response.status_code)

        data = response.json()

        # Get all tracks (handling pagination)
        tracks = []
        tracks_url = data['tracks']['href']
        while tracks_url:
            tracks_response = requests.get(
                tracks_url,
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if tracks_response.status_code != 200:
                break

            tracks_data = tracks_response.json()
            for item in tracks_data['items']:
                if item['track']:  # Check if track exists (not null)
                    track = item['track']
                    tracks.append({
                        'id': track['id'],
                        'name': track['name'],
                        'artist': ', '.join(artist['name'] for artist in track['artists']),
                        'album': track['album']['name'],
                        'duration_ms': track['duration_ms'],
                        'image_url': track['album']['images'][0]['url'] if track['album']['images'] else None,
                        'preview_url': track['preview_url'],
                        'added_at': item['added_at'],
                        'added_by': item['added_by']['id']
                    })
            
            tracks_url = tracks_data.get('next')

        playlist_details = {
            'id': data['id'],
            'name': data['name'],
            'description': data['description'],
            'public': data['public'],
            'tracks_total': data['tracks']['total'],
            'image_url': data['images'][0]['url'] if data['images'] else None,
            'external_url': data['external_urls']['spotify'],
            'owner': {
                'display_name': data['owner']['display_name'],
                'id': data['owner']['id']
            },
            'followers': data['followers']['total'],
            'tracks': tracks
        }

        return JsonResponse(playlist_details)

    except requests.RequestException as e:
        return JsonResponse({"error": str(e)}, status=503)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@require_http_methods(["POST"])
def add_track_to_playlist(request, playlist_id):
    """Add a track to a playlist."""
    access_token = request.session.get("spotify_access_token")
    if not access_token:
        return JsonResponse({"error": "Not connected to Spotify"}, status=401)

    try:
        track_id = request.POST.get('track_id')
        if not track_id:
            return JsonResponse({"error": "Track ID is required"}, status=400)

        # Add track to playlist
        response = requests.post(
            f'https://api.spotify.com/v1/playlists/{playlist_id}/tracks',
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-Type": "application/json"
            },
            json={
                "uris": [f"spotify:track:{track_id}"]
            }
        )

        if response.status_code != 201:
            return JsonResponse({
                "error": f"Failed to add track: {response.status_code}"
            }, status=response.status_code)

        return JsonResponse({"success": True})

    except requests.RequestException as e:
        return JsonResponse({"error": str(e)}, status=503)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)