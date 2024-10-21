from django.urls import reverse
from django.test import TestCase
from django.contrib.auth.models import User
from .models import Profile
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
