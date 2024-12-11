import math
import os
import requests
from django.core.paginator import Paginator
from datetime import datetime
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required  
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt, get_token
from django.contrib.auth.models import User
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.shortcuts import get_object_or_404
import json
from .models import NowPlaying, PasswordReset, Post, Profile, Tag, Content
import time
from os import getenv
from django.db.models import Count, Q

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


@login_required
@csrf_exempt
@require_http_methods(["POST"])
def create_post(request):
    user = request.user  # Authenticated user
    try:
        body = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    # Extract required fields from the request body
    link = body.get('link')
    image = body.get('image', '')
    comment = body.get('comment', '')
    latitude = body.get('latitude')
    longitude = body.get('longitude')

    if(latitude is None or longitude is None):
        latitude = None
        longitude = None


    # Validate required fields
    if not link or not comment:
        return JsonResponse({"error": "Link, comment, latitude, and longitude are required!"}, status=400)

    # Detect the content type of the Spotify link
    post_content_type = get_content_type(link)
    existing_content = Content.objects.filter(link=link).first()

    if existing_content:
        # Use the existing Content object
        content = existing_content
    else:
        # Fetch and create a new Content object
        access_token = get_access_token()
        if not access_token:
            return JsonResponse({"error": "Failed to get access token"}, status=500)

        headers = {"Authorization": f"Bearer {access_token}"}
        spotify_url = f"https://api.spotify.com/v1/{post_content_type}s/{link.split('/')[-1]}"
        response = requests.get(spotify_url, headers=headers)

        if response.status_code != 200:
            return JsonResponse({"error": "Failed to fetch content description"}, status=500)

        content_description = response.json()
        content = Content(link=link, content_type=post_content_type, description=content_description)
        content.save()

    # Create and save the post
    post = Post(
        comment=comment,
        image=image,
        link=link,
        content=content,
        belongs_to=user,  # Assign to the authenticated user
        latitude=latitude,
        longitude=longitude,
    )
    post.save()

    return JsonResponse({"message": "Post created successfully", "post_id": post.id}, status=201)

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
    req_user = request.user
    user_id = request.GET.get('user_id')
    page_number = request.GET.get('page', 1)
    page_size = request.GET.get('page_size', 10)

    try:
        target_user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    if req_user != target_user:
        # Check if the requesting user follows the target user
        req_user_profile = req_user.profile
        if not req_user_profile.following.filter(id=target_user.profile.id).exists():
            return JsonResponse({"error": "You do not follow this user"}, status=403)

    posts = Post.objects.filter(belongs_to=target_user).order_by('-created_at')
    
    paginator = Paginator(posts, page_size)
    try:
        page = paginator.page(page_number)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

    posts_data = [
        {
            "id": post.id,
            "comment": post.comment,
            "image": post.image,
            "link": post.link,
            "created_at": post.created_at,
            "total_likes": post.total_likes,
            "total_dislikes": post.total_dislikes,
            "tags": [tag.name for tag in post.tags.all()],
        }
        for post in page.object_list
    ]

    return JsonResponse(
        {
            "posts": posts_data,
            "current_page": page.number,
            "total_pages": paginator.num_pages,
            "total_posts": paginator.count,
        },
        status=200
    )

    


def get_posts(request):
    post_id = request.GET.get('id')  # Get the ID from query params
    post_link = request.GET.get('link')  # Get the link from query params
    start_date = request.GET.get('start_date')  # Start of time interval
    end_date = request.GET.get('end_date')  # End of time interval
    page_number = request.GET.get('page', 1)  # Page number for pagination
    page_size = request.GET.get('page_size', 10)  # Number of items per page

    try:
        if post_id:  # If an ID is provided, fetch a single post
            post = Post.objects.filter(id=post_id).first()
            if not post:
                return JsonResponse({"error": "Post not found"}, status=404)
            return JsonResponse({
                "id": post.id,
                "comment": post.comment,
                "image": post.image,
                "link": post.link,
                "created_at": post.created_at.isoformat(),
                "total_likes": post.total_likes,
                "total_dislikes": post.total_dislikes,
                "username": post.belongs_to.username, 
                "content": {
                    "id": post.content.id,
                    "link": post.content.link,
                    "description": post.content.description,
                    "content_type": post.content.content_type,
                },
                "tags": [tag.name for tag in post.tags.all()],
            })
    
        if post_link:  # If a link is provided, fetch posts with the same link
            posts = Post.objects.filter(link=post_link)
            if not posts:
                return JsonResponse({"error": "Posts not found"}, status=404)
            posts_data = [{
                "id": post.id,
                "comment": post.comment,
                "image": post.image,
                "link": post.link,
                "created_at": post.created_at.isoformat(),
                "total_likes": post.total_likes,
                "total_dislikes": post.total_dislikes,
                "username": post.belongs_to.username,
                "content": {
                    "id": post.content.id,
                    "link": post.content.link,
                    "description": post.content.description,
                    "content_type": post.content.content_type,
                },
                "tags": [tag.name for tag in post.tags.all()],
            } for post in posts]
            return JsonResponse({"posts": posts_data})
        

        # If no ID is provided, fetch posts within a time interval
        posts_query = Post.objects.all()

        if start_date:
            start_date_obj = datetime.fromisoformat(start_date)
            posts_query = posts_query.filter(created_at__gte=start_date_obj)

        if end_date:
            end_date_obj = datetime.fromisoformat(end_date)
            posts_query = posts_query.filter(created_at__lte=end_date_obj)

        # Apply pagination
        paginator = Paginator(posts_query.order_by('-created_at'), page_size)
        posts_page = paginator.get_page(page_number)

        # Serialize the paginated posts
        posts_data = [{
            "id": post.id,
            "comment": post.comment,
            "image": post.image,
            "link": post.link,
            "created_at": post.created_at.isoformat(),
            "total_likes": post.total_likes,
            "total_dislikes": post.total_dislikes,
            "username": post.belongs_to.username,
            "content": {
                "id": post.content.id,
                "link": post.content.link,
                "description": post.content.description,
                "content_type": post.content.content_type,
            },
            "tags": [tag.name for tag in post.tags.all()],
        } for post in posts_page]

        return JsonResponse({
            "posts": posts_data,
            "pagination": {
                "current_page": posts_page.number,
                "total_pages": paginator.num_pages,
                "total_posts": paginator.count,
            },
        })

    except ValueError as e:
        return JsonResponse({"error": str(e)}, status=400)
ACCESS_TOKEN = None
TOKEN_EXPIRY = 0

def get_access_token():
    """Fetch a new access token from Spotify."""
    client_id = os.getenv("SPOTIFY_CLIENT_ID")
    client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")
    url = "https://accounts.spotify.com/api/token"
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    data = {"grant_type": "client_credentials"}
    response = requests.post(url, headers=headers, auth=(client_id, client_secret), data=data)
    if response.status_code == 200:
        token_data = response.json()
        global ACCESS_TOKEN, TOKEN_EXPIRY
        ACCESS_TOKEN = token_data["access_token"]
        TOKEN_EXPIRY = time.time() + token_data["expires_in"] - 60  # Buffer for token renewal
        return ACCESS_TOKEN
    else:
        print(response)
        raise Exception("Failed to get access token: " + response.text)
    
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