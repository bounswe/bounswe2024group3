// app/(tabs)/components/FloatingButton.tsx

import React, { useRef } from 'react';
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Easing,
  AccessibilityRole,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FloatingButtonProps {
  onPress: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onPress }) => {
  // Initialize Animated.Value for scaling
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Function to handle the press animation
  const handlePress = () => {
    // Sequence: Shrink -> Return to original size
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.8, // Shrink to 80%
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1, // Return to original size
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Trigger the onPress action after animation completes
      onPress();
    });
  };

  return (
    <TouchableWithoutFeedback
      onPress={handlePress}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Create a new post"
    >
      <Animated.View
        style={[
          styles.fab,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#1DB954', // Spotify's green
    borderRadius: 30,
    elevation: 8, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 }, // For iOS shadow
    shadowOpacity: 0.3, // For iOS shadow
    shadowRadius: 4, // For iOS shadow
  },
});


export default FloatingButton;
