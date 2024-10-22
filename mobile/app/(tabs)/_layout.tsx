// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2f95dc',
      }}
    >
      <Tabs.Screen
        name="search"
        options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="search-outline" color={color} size={size} />
            ),
        }}
      />
        <Tabs.Screen
            name="index"
            options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" color={color} size={size} />
            ),
            }}
        />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}