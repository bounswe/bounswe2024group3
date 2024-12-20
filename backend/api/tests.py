from django.urls import reverse
from django.test import TestCase, Client
from django.contrib.auth.models import User
from .models import Profile, Post, Tag, Content
import json

class AuthAPITests(TestCase):
    def setUp(self):
        # Create a test user and profile
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword'
        )
        self.profile = Profile.objects.create(
            user=self.user,
            name='Test',
            surname='User',
            labels=['Artist', 'Listener']
        )
        self.user1 = User.objects.create_user(
            username='testuser1',
            email='test1@example.com',
            password='testpassword'
        )
        self.profile1 = Profile.objects.create(
            user=self.user1,
            name='Test',
            surname='User',
            labels=['Artist', 'Listener']
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            email='test2@example.com',
            password='testpassword'
        )
        self.profile2 = Profile.objects.create(
            user=self.user2,
            name='Another',
            surname='User',
            labels=['Listener']
        )
        
    def test_register(self):
        response = self.client.post(reverse('register'), data=json.dumps({
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword',
            'name': 'New',
            'surname': 'User',
            'labels': ['Listener']
        }), content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Registration successful')
    
    def test_login(self):
        response = self.client.post(reverse('login'), data=json.dumps({
            'username': 'testuser',
            'password': 'testpassword'
        }), content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Login successful')

    def test_get_user(self):
        self.client.login(username='testuser', password='testpassword')  # Log in the user
        response = self.client.get(reverse('get_user'))
        
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'User details retrieved')

    def test_logout(self):
        self.client.login(username='testuser', password='testpassword')  # Log in the user
        response = self.client.post(reverse('logout'))
        
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Logout successful')

    def test_follow_user(self):
        self.client.login(username='testuser1', password='testpassword')  # Log in user1
        response = self.client.post(reverse('follow_user', args=[self.user2.id]))  # Follow user2
        
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, f'You are now following {self.user2.username}')
        
        # Check if user1 follows user2
        self.profile1.refresh_from_db()
        self.assertIn(self.profile2, self.profile1.following.all())

    def test_unfollow_user(self):
        self.client.login(username='testuser1', password='testpassword')  # Log in user1
        # Follow user2 first
        self.profile1.following.add(self.profile2)
        
        response = self.client.post(reverse('unfollow_user', args=[self.user2.id]))  # Unfollow user2
        
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, f'You have unfollowed {self.user2.username}')
        
        # Check if user1 no longer follows user2
        self.profile1.refresh_from_db()
        self.assertNotIn(self.profile2, self.profile1.following.all())

class PostTests(TestCase):
    def setUp(self):
        # Initialize the test client
        self.client = Client()
        
        # Create some sample data
        self.valid_post_data = {
            'content': 'Test post content',
            'images': ['https://example.com/image1.jpg'],
            'links': ['https://example.com/link1'],
            'tags': ['test', 'sample']
        }
        
        # Create a test post for get requests
        self.test_post = Post.objects.create(
            content='Existing test post',
            images=['https://example.com/image2.jpg'],
            links=['https://example.com/link2']
        )
        # Add tags to the test post
        tag = Tag.objects.create(name='existing_tag')
        self.test_post.tags.add(tag)

    def test_create_post_success(self):
        """Test creating a post with valid data"""
        response = self.client.post(
            reverse('create_post'),
            data=json.dumps(self.valid_post_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['status'], 'success')
        
        # Verify post was created in database
        created_post = Post.objects.filter(content='Test post content').first()
        self.assertIsNotNone(created_post)
        self.assertEqual(created_post.images, ['https://example.com/image1.jpg'])
        self.assertEqual(created_post.links, ['https://example.com/link1'])
        self.assertEqual(
            set(created_post.tags.values_list('name', flat=True)),
            {'test', 'sample'}
        )

    def test_create_post_invalid_data(self):
        """Test creating a post with invalid data"""
        invalid_data = {
            'images': ['https://example.com/image1.jpg'],
            'links': [],
            'tags': ['test']
            # Missing required 'content' field
        }
        
        response = self.client.post(
            reverse('create_post'),
            data=json.dumps(invalid_data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['status'], 'error')

    def test_create_post_invalid_json(self):
        """Test creating a post with invalid JSON"""
        response = self.client.post(
            reverse('create_post'),
            data='invalid json',
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['status'], 'error')

    def test_get_all_posts(self):
        """Test getting all posts"""
        response = self.client.get(reverse('get_posts'))
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'success')
        
        # Verify the test post is in the response
        posts_data = response.json()['data']
        self.assertTrue(len(posts_data) > 0)
        self.assertEqual(posts_data[0]['content'], 'Existing test post')

    def test_get_single_post(self):
        """Test getting a single post by ID"""
        response = self.client.get(
            reverse('get_post', kwargs={'post_id': self.test_post.id})
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'success')
        self.assertEqual(
            response.json()['data']['content'],
            'Existing test post'
        )

    def test_get_nonexistent_post(self):
        """Test getting a post that doesn't exist"""
        response = self.client.get(
            reverse('get_post', kwargs={'post_id': 99999})
        )
        
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['status'], 'error')

    def test_create_post_with_empty_tags(self):
        """Test creating a post with no tags"""
        data = self.valid_post_data.copy()
        data['tags'] = []
        
        response = self.client.post(
            reverse('create_post'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['status'], 'success')

    def test_create_post_with_duplicate_tags(self):
        """Test creating a post with duplicate tags"""
        data = self.valid_post_data.copy()
        data['tags'] = ['test', 'test', 'sample']
        
        response = self.client.post(
            reverse('create_post'),
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 201)
        created_post = Post.objects.filter(content='Test post content').first()
        # Verify duplicate tags are handled correctly
        self.assertEqual(
            len(set(created_post.tags.values_list('name', flat=True))),
            2  # Should only have 'test' and 'sample'
        )
from django.test import TestCase, Client
from django.contrib.auth.models import User
from .models import NowPlaying
import json

class SaveNowPlayingTest(TestCase):
    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username="testuser", password="password")
        self.client = Client()

        # Authenticate the user
        self.client.login(username="testuser", password="password")

        # Define the URL for the endpoint
        self.url = '/api/save-now-playing/'

    def test_save_now_playing_success(self):
        # Valid request data
        payload = {
            "link": "https://open.spotify.com/track/7eBo7oeGFWJ9GlL1Me6NuV?si=d9afed506e9942e4",
            "latitude": 37.7749,
            "longitude": -122.4194
        }

        # Send a POST request
        response = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json"
        )

        # Assertions
        self.assertEqual(response.status_code, 201)
        self.assertEqual(NowPlaying.objects.count(), 1)
        self.assertEqual(NowPlaying.objects.first().link, "https://open.spotify.com/track/7eBo7oeGFWJ9GlL1Me6NuV?si=d9afed506e9942e4")
        self.assertJSONEqual(
            response.content,
            {"message": "Now playing data saved successfully.", "id": NowPlaying.objects.first().id}
        )

    def test_save_now_playing_missing_fields(self):
        # Payload missing latitude and longitude
        payload = {
            "link": "https://open.spotify.com/track/7eBo7oeGFWJ9GlL1Me6NuV?si=d9afed506e9942e4"
        }

        # Send a POST request
        response = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json"
        )

        # Assertions
        self.assertEqual(response.status_code, 400)
        self.assertEqual(NowPlaying.objects.count(), 0)
        self.assertJSONEqual(
            response.content,
            {"error": "link, latitude, and longitude are required."}
        )

    def test_save_now_playing_invalid_json(self):
        # Invalid JSON payload
        payload = "invalid_json"

        # Send a POST request
        response = self.client.post(
            self.url,
            data=payload,
            content_type="application/json"
        )

        # Assertions
        self.assertEqual(response.status_code, 400)
        self.assertEqual(NowPlaying.objects.count(), 0)
        self.assertJSONEqual(
            response.content,
            {"error": "Invalid JSON."}
        )

    def test_save_now_playing_unauthenticated(self):
        # Log out the user
        self.client.logout()

        # Valid payload
        payload = {
            "link": "https://open.spotify.com/track/7eBo7oeGFWJ9GlL1Me6NuV?si=d9afed506e9942e4",
            "latitude": 37.7749,
            "longitude": -122.4194
        }

        # Send a POST request
        response = self.client.post(
            self.url,
            data=json.dumps(payload),
            content_type="application/json"
        )

        # Assertions
        self.assertEqual(response.status_code, 302)  # Redirect to login
        self.assertEqual(NowPlaying.objects.count(), 0)

    def test_save_now_playing_invalid_method(self):
        # Send a GET request instead of POST
        response = self.client.get(self.url)

        # Assertions
        self.assertEqual(response.status_code, 405)  # Method not allowed
     
    
class SearchTests(TestCase):
    def setUp(self):
        # Initialize the test client
        self.client = Client()

        # Create some sample Content instances
        self.content1 = Content.objects.create(
            description='First content description',
            content_type='Type A',
            link='http://example.com/1'
        )
        self.content2 = Content.objects.create(
            description='Second content description',
            content_type='Type B',
            link='http://example.com/2'
        )
        self.content3 = Content.objects.create(
            description='Third content description',
            content_type='Type A',
            link='http://example.com/3'
        )
        self.content4 = Content.objects.create(
            description='Fourth content description',
            content_type='Type C',
            link='http://example.com/4'
        )

    def test_search_no_query(self):
        response = self.client.get(reverse('search'))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['total_results'], 4)
        self.assertEqual(data['page'], 1)
        self.assertEqual(data['page_size'], 10)
        self.assertEqual(len(data['contents']), 4)

    def test_search_with_query(self):
        """Test searching with a query that matches some contents"""
        response = self.client.get(reverse('search'), {'search': 'First'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['total_results'], 1)
        self.assertEqual(len(data['contents']), 1)
        self.assertEqual(data['contents'][0]['description'], 'First content description')

    def test_search_no_matches(self):
        """Test searching with a query that matches no contents"""
        response = self.client.get(reverse('search'), {'search': 'asdfasdf'})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['total_results'], 0)
        self.assertEqual(len(data['contents']), 0)

    def test_search_pagination(self):
        """Test pagination parameters"""
        response = self.client.get(reverse('search'), {'page': 1, 'page_size': 2})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['page'], 1)
        self.assertEqual(data['page_size'], 2)
        self.assertEqual(len(data['contents']), 2)

        response = self.client.get(reverse('search'), {'page': 2, 'page_size': 2})
        data = response.json()
        self.assertEqual(data['page'], 2)
        self.assertEqual(len(data['contents']), 2)

    def test_search_pagination_out_of_range(self):
        """Test pagination with page number beyond available pages"""
        response = self.client.get(reverse('search'), {'page': 3, 'page_size': 2})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data['contents']), 0)

    def test_search_method_not_allowed(self):
        """Test that POST method is not allowed"""
        response = self.client.post(reverse('search'))
        self.assertEqual(response.status_code, 405)

    def test_search_content_fields(self):
        """Test that the returned contents have the correct fields"""
        response = self.client.get(reverse('search'))
        data = response.json()
        content = data['contents'][0]
        self.assertIn('id', content)
        self.assertIn('description', content)
        self.assertIn('content_type', content)
        self.assertIn('link', content)

    def test_search_multiple_filters(self):
        """Test searching with a query that should match multiple fields"""
        response = self.client.get(reverse('search'), {'search': 'Type A'})
        data = response.json()
        self.assertEqual(data['total_results'], 2)
        descriptions = [item['description'] for item in data['contents']]
        self.assertIn('First content description', descriptions)
        self.assertIn('Third content description', descriptions)



    def test_search_with_special_characters(self):
        """Test searching with special characters in the query"""
        Content.objects.create(
            description='Special & Content',
            content_type='Type D',
            link='http://example.com/5'
        )
        response = self.client.get(reverse('search'), {'search': '&'})
        data = response.json()
        self.assertEqual(data['total_results'], 1)
        self.assertEqual(data['contents'][0]['description'], 'Special & Content')

    def test_search_case_insensitive(self):
        """Test that the search is case-insensitive"""
        response = self.client.get(reverse('search'), {'search': 'first'})
        data = response.json()
        self.assertEqual(data['total_results'], 1)
        self.assertEqual(data['contents'][0]['description'], 'First content description')


from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import patch
import json

class SpotifyEmbedTests(TestCase):
    def setUp(self):
        # Create test content
        self.content = Content.objects.create(
            link="https://open.spotify.com/track/123",
            content_type="track",
            artist_names=["Test Artist"],
            song_name="Test Song",
            album_name="Test Album",
            genres=["pop"],
            ai_description="Test description"
        )
        
        # Create test suggestions
        self.suggestion = ContentSuggestion.objects.create(
            content=self.content,
            name="Suggested Song",
            artist="Suggested Artist",
            spotify_url="https://open.spotify.com/track/456",
            reason="Test reason",
            type="track"
        )

    @patch('api.views.get_access_token')
    @patch('api.views.requests.get')
    def test_get_pages_existing_content(self, mock_requests, mock_token):
        response = self.client.get(
            reverse('get_pages_of_spot_embeds'),
            {'link': self.content.link}
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verify content data
        self.assertIn('content', data)
        content_data = data['content']
        self.assertEqual(content_data['link'], self.content.link)
        self.assertEqual(content_data['song_name'], self.content.song_name)
        
        # Verify suggestions
        self.assertIn('suggestions', content_data)
        self.assertEqual(len(content_data['suggestions']), 1)
        self.assertEqual(content_data['suggestions'][0]['name'], "Suggested Song")

    @patch('api.views.get_access_token')
    @patch('api.views.requests.get')
    def test_get_pages_new_content(self, mock_requests, mock_token):
        # Mock Spotify API responses
        mock_token.return_value = "fake_token"
        mock_requests.return_value.status_code = 200
        mock_requests.return_value.json.return_value = {
            "name": "New Song",
            "artists": [{"name": "New Artist"}],
            "album": {"name": "New Album"}
        }

        response = self.client.get(
            reverse('get_pages_of_spot_embeds'),
            {'link': 'https://open.spotify.com/track/789'}
        )
        
        self.assertEqual(response.status_code, 200)
        self.assertTrue(Content.objects.filter(link='https://open.spotify.com/track/789').exists())

    def test_get_pages_invalid_link(self):
        response = self.client.get(
            reverse('get_pages_of_spot_embeds'),
            {'link': 'invalid_link'}
        )
        
        self.assertEqual(response.status_code, 400)


class LyricsQuizTests(TestCase):
    def setUp(self):
        # Create test content with lyrics
        self.content = Content.objects.create(
            link="https://open.spotify.com/track/123",
            content_type="track",
            artist_names=["Test Artist"],
            song_name="Test Song",
            lyrics="Line 1. Line 2. Line 3.",
            ai_description="Test description"
        )
        
        # Create suggestions
        for i in range(3):
            ContentSuggestion.objects.create(
                content=self.content,
                name=f"Suggested Song {i}",
                artist=f"Artist {i}",
                spotify_url=f"https://open.spotify.com/track/45{i}",
                reason="Test reason",
                type="track"
            )

    @patch('api.views.get_random_songs_util')
    def test_get_song_quiz_success(self, mock_random_songs):
        # Mock random Spotify track
        mock_random_songs.return_value = [{
            'external_urls': {'spotify': 'https://open.spotify.com/track/789'},
            'name': 'Random Song',
            'artists': [{'name': 'Random Artist'}]
        }]

        response = self.client.get(reverse('get_song_quiz_lyrics'))
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        
        # Verify response structure
        self.assertIn('lyric_snippet', data)
        self.assertIn('options', data)
        self.assertIn('correct_link', data)
        
        # Verify options
        self.assertEqual(len(data['options']), 4)  # 1 correct + 2 suggestions + 1 random
        self.assertEqual(data['correct_link'], self.content.link)

    def test_get_song_quiz_no_lyrics(self):
        # Delete lyrics from test content
        self.content.lyrics = ""
        self.content.save()

        response = self.client.get(reverse('get_song_quiz_lyrics'))
        
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())

    @patch('api.views.get_random_songs_util')
    def test_get_song_quiz_no_random_track(self, mock_random_songs):
        # Mock random songs utility to return None
        mock_random_songs.return_value = None

        response = self.client.get(reverse('get_song_quiz_lyrics'))
        
        self.assertEqual(response.status_code, 500)
        self.assertIn('error', response.json())

    def test_get_song_quiz_no_suggestions(self):
        # Delete all suggestions
        ContentSuggestion.objects.all().delete()

        response = self.client.get(reverse('get_song_quiz_lyrics'))
        
        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())