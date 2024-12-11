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
    Generate AI description for content using LangChain
    """

    print(os.getenv("OPENAI_API_KEY"))
    print(metadata)
    llm = ChatOpenAI(
        model_name="gpt-3.5-turbo",
        temperature=0.7,
        openai_api_key=os.getenv("OPENAI_API_KEY")
    )

    # Different prompts based on content type
    prompts = {
        "track": """You are a music expert. Given the following song information, provide an interesting 2-3 sentence description about the song and its artists:
        Song: {song_name}
        Artist(s): {artist_names}
        Album: {album_name}
        Focus on making it engaging and informative.""",
        
        "artist": """You are a music expert. Given the following artist information, provide an interesting 2-3 sentence description about the artist and their impact:
        Artist: {artist_names}
        Genres: {genres}
        Focus on their musical style and significance.""",
        
        "album": """You are a music expert. Given the following album information, provide an interesting 2-3 sentence description about the album and its significance:
        Album: {album_name}
        Artist(s): {artist_names}
        Focus on the album's impact and style.""",
        
        "playlist": """You are a music expert. Given the following playlist information, provide an interesting 2-3 sentence description about what listeners might expect:
        Playlist: {playlist_name}
        Focus on the mood and experience."""
    }

    # Create prompt template based on content type
    prompt_template = ChatPromptTemplate.from_template(prompts[content_type])
    
    # Create chain
    chain = LLMChain(llm=llm, prompt=prompt_template)
    
    # Run chain with metadata
    try:
        response = chain.run(**metadata)
        return response.strip()
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
            search_query = f"{suggestion['track_name']} {suggestion['artist']}"
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
                    suggestion = ContentSuggestion.objects.create(
                        content=content,
                        name=track['name'],
                        artist=track['artists'][0]['name'],
                        spotify_url=track['external_urls']['spotify'],
                        reason=suggestion['reason']
                    )
                    saved_suggestions.append(suggestion)

        return saved_suggestions

    except Exception as e:
        print(f"Error getting/creating content suggestions: {e}")
        return []