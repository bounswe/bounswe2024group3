from django.urls import reverse
from django.test import TestCase, Client
from django.contrib.auth.models import User
from .models import Profile, Post, Tag
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