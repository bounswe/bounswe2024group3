import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CreatePost from './CreatePost';

const FeedPage = () => {
    const [pressedCreatePost, setPressedCreatePost] = useState(false);

    if (pressedCreatePost) {
        return <CreatePost />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Posts</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    setPressedCreatePost(true);
                }}
            >
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const colors = {
    primary: '#F8F4E1',
    secondary: '#AF8F6F',
    third: '#74512D',
    fourth: '#543310',
  };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.third,
    },
    text: {
        fontSize: 36,
        fontWeight: 'bold',
        color: colors.primary,
        fontFamily: 'times new roman',
        textShadowColor: colors.fourth,
        textShadowOffset: { width: 10, height: 10 },
        textShadowRadius: 10,
    },
    button: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 36,
        color: colors.fourth,
        fontWeight: 'bold',
        marginBottom: 3,
    },
});




export default FeedPage;