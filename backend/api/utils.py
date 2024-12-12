from .models import ContentSuggestion, Post
from datetime import datetime
from django.core.paginator import Paginator
from langchain_community.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
import os
from dotenv import load_dotenv
import json
import requests
import time
from bs4 import BeautifulSoup
import random


load_dotenv()




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
    
def fetch_posts(post_id=None, post_link=None, start_date=None, end_date=None, page_number=1, page_size=10):
    """
    Utility function to fetch posts with pagination
    """
    try:
        if post_id:  # If an ID is provided, fetch a single post
            post = Post.objects.filter(id=post_id).first()
            if not post:
                return None, "Post not found", 404
            return [{
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
                    "description": post.content.ai_description,
                    "content_type": post.content.content_type,
                },
                "tags": [tag.name for tag in post.tags.all()],
            }], None, 200
    
        if post_link:  # If a link is provided, fetch posts with the same link
            posts = Post.objects.filter(link=post_link)
            if not posts:
                return None, "Posts not found", 404
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
                    "description": post.content.ai_description,
                    "content_type": post.content.content_type,
                },
                "tags": [tag.name for tag in post.tags.all()],
            } for post in posts]
            return posts_data, None, 200

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
                "description": post.content.ai_description,
                "content_type": post.content.content_type,
            },
            "tags": [tag.name for tag in post.tags.all()],
        } for post in posts_page]

        pagination_data = {
            "current_page": posts_page.number,
            "total_pages": paginator.num_pages,
            "total_posts": paginator.count,
        }

        return posts_data, pagination_data, 200

    except ValueError as e:
        return None, str(e), 400 
    

def get_content_description(content_type, metadata):
    """
    Generate AI description and genres for content using LangChain
    Returns a dict with 'description' and 'genres' (genres only for tracks/albums)
    """
    llm = ChatOpenAI(
        model_name="gpt-3.5-turbo",
        temperature=0.7,
        openai_api_key=os.getenv("OPENAI_API_KEY")
    )

    # Different prompts based on content type
    prompts = {
        "track": """You are a music expert. Given the following song information:
        Song: {song_name}
        Artist(s): {artist_names}
        Album: {album_name}

        Provide two things in JSON format:
        1. A concise description (up to 100 words) about the song, its artists, and its significance. Include information about the song's style, 
           musical elements, impact, or any interesting context about its creation or reception.
        2. A list of 1-4 relevant genres/subgenres for this song (can be just one if it clearly belongs to a specific genre)

        Format your response as a JSON object with 'description' and 'genres' keys. Example:
        {{"description": "Your concise description here", "genres": ["Genre 1", "Genre 2"]}}""",
        
        "album": """You are a music expert. Given the following album information:
        Album: {album_name}
        Artist(s): {artist_names}

        Provide two things in JSON format:
        1. A concise description (up to 100 words) about the album, including its musical style, themes, significance, 
           and impact. You can mention standout tracks, production quality, or its place in the artist's discography.
        2. A list of 1-4 relevant genres/subgenres for this album (can be just one if it clearly belongs to a specific genre)

        Format your response as a JSON object with 'description' and 'genres' keys. Example:
        {{"description": "Your concise description here", "genres": ["Genre 1", "Genre 2"]}}""",
        
        "artist": """You are a music expert. Given the following artist information:
        Artist: {artist_names}
        Genres: {genres}
        
        Provide a concise description (up to 100 words) about the artist. Include information about their musical style, 
        career highlights, influence on music, signature sound, and artistic evolution.""",
        
        "playlist": """You are a music expert. Given the following playlist information:
        Playlist: {playlist_name}
        
        Provide a concise description (up to 100 words) about what listeners might expect from this playlist. 
        Discuss the potential mood, atmosphere, and musical journey it might offer."""
    }

    # Create prompt template based on content type
    prompt_template = ChatPromptTemplate.from_template(prompts[content_type])
    
    # Create chain
    chain = LLMChain(llm=llm, prompt=prompt_template)
    
    try:
        response = chain.run(**metadata)
        if content_type in ["track", "album"]:
            # Parse JSON response for tracks and albums
            response_data = json.loads(response.strip())
            return response_data
        else:
            # For artists and playlists, just return description
            return {"description": response.strip(), "genres": []}
    except Exception as e:
        print(f"Error generating AI description: {e}")
        return None

def get_content_suggestions(metadata, limit=5):
    """
    Generate AI suggestions based on content metadata
    """
    try:
        llm = ChatOpenAI(
            model_name="gpt-3.5-turbo",
            temperature=0.7,
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )

        prompt_template = """You are a music expert. Based on the following content:
        Type: {content_type}
        Track: {song_name}
        Artist(s): {artist_names}
        Album: {album_name}
        Genres: {genres}

        Suggest {limit} different songs that fans might enjoy. For each suggestion, provide:
        1. The track name
        2. The primary artist
        3. A brief reason for the recommendation

        Format your response as a JSON array with objects containing 'track_name', 'artist', and 'reason'.
        Keep the reason concise (max 100 characters).
        """

        prompt = ChatPromptTemplate.from_template(prompt_template)

        print(prompt)
        
        # Create chain
        chain = LLMChain(llm=llm, prompt=prompt)
        
        # Add limit to metadata
        metadata['limit'] = limit
        
        # Get response and parse JSON
        response = chain.run(**metadata)
        suggestions = json.loads(response)
        
        return suggestions

    except Exception as e:
        print(f"Error generating AI suggestions: {e}")
        return []

def get_or_create_content_suggestions(content):
    """
    Get existing suggestions for content or create new ones if they don't exist
    Returns a list of ContentSuggestion objects
    """
    try:
        # Check if we already have suggestions
        suggestions = content.suggestions.all()
        if suggestions.exists():
            return suggestions

        # If no suggestions exist, generate new ones
        metadata = {
            "content_type": content.content_type,
            "song_name": content.song_name,
            "artist_names": ", ".join(content.artist_names),
            "album_name": content.album_name,
            "genres": ", ".join(content.genres),
        }
        
        # Get AI suggestions
        ai_suggestions = get_content_suggestions(metadata)
        
        # Get Spotify URLs and save suggestions
        access_token = get_access_token()
        if not access_token:
            return []

        saved_suggestions = []
        headers = {"Authorization": f"Bearer {access_token}"}
        
        for suggestion in ai_suggestions:
            # Handle multiple artists in the suggestion
            artists = suggestion['artist'].split(',')  # Split if multiple artists
            primary_artist = artists[0].strip()  # Use the first artist for search
            
            search_query = f"track:{suggestion['track_name']} artist:{primary_artist}"
            search_params = {
                'q': search_query,
                'type': 'track',
                'limit': 1
            }
            
            response = requests.get(
                'https://api.spotify.com/v1/search',
                headers=headers,
                params=search_params
            )

            if response.status_code == 200:
                results = response.json()
                if results['tracks']['items']:
                    track = results['tracks']['items'][0]
                    # Join all artists for storage
                    all_artists = ', '.join([artist['name'] for artist in track['artists']])
                    suggestion = ContentSuggestion.objects.create(
                        content=content,
                        name=track['name'],
                        artist=all_artists,  # Store all artists
                        spotify_url=track['external_urls']['spotify'],
                        reason=suggestion['reason']
                    )
                    saved_suggestions.append(suggestion)

        return saved_suggestions

    except Exception as e:
        print(f"Error getting/creating content suggestions: {e}")
        return []

def fetch_lyrics(url: str) -> str:
    """
    Fetch lyrics from the Musixmatch URL and parse the content.
    """
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all parent divs for verses/choruses
        parent_divs = soup.find_all('div', class_=lambda x: x and 'r-zd98yo' in x)
        
        if parent_divs:
            lyrics_lines = []
            for parent_div in parent_divs:
                # Collect all text from nested divs in the current parent div
                lines = [
                    nested_div.get_text(strip=True) 
                    for nested_div in parent_div.find_all('div')
                    if nested_div.get_text(strip=True) and nested_div.get_text(strip=True).lower() not in ['verse', 'chorus']
                ]
                # Avoid duplicates and add to lyrics lines
                unique_lines = list(dict.fromkeys(lines))
                lyrics_lines.extend(unique_lines)
            
            # Join all lines with a dot and space, separating stanzas with a single space
            formatted_lyrics = '. '.join(lyrics_lines) + '.'
            return formatted_lyrics.strip()
        
        return "Lyrics not found."
    
    except Exception as e:
        print(f"Error fetching lyrics: {e}")
        return None

def get_random_songs_util(search_params=None, limit=5):
    """
    Utility function to fetch random songs from Spotify
    Args:
        search_params: Optional dictionary of search parameters (including genre)
        limit: Number of songs to return (default: 5)
    Returns:
        List of tracks or None if error
    """
    try:
        access_token = get_access_token()
        if not access_token:
            return None

        headers = {"Authorization": f"Bearer {access_token}"}
        
        # Default search parameters
        default_params = {
            'type': 'track',
            'market': 'US',
            'limit': 50  # Maximum allowed by Spotify API
        }
        
        if not search_params:
            # If no search params, just use a random year
            year = random.randint(1950, 2024)
            default_params['q'] = f'year:{year}'
        else:
            # Keep user's search parameters (especially genre)
            default_params.update(search_params)
        
        # Add random offset to get different sections of results
        # Spotify limits offset to 1000, so we keep it under that
        default_params['offset'] = random.randint(0, 950)  # 950 = 1000 - limit
            
        response = requests.get(
            'https://api.spotify.com/v1/search',
            headers=headers,
            params=default_params
        )

        if response.status_code != 200:
            return None

        tracks = response.json()['tracks']['items']
        if not tracks:
            # If no tracks found, try again with a different offset
            return get_random_songs_util(search_params=search_params, limit=limit)
            
        selected_tracks = random.sample(tracks, min(limit, len(tracks)))
        
        return selected_tracks

    except Exception as e:
        print(f"Error fetching random songs: {e}")
        return None
