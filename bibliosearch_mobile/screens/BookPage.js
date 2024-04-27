import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, Button, View, Text, Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window'); // Get the width of the screen
const BookPage = ({ query: initialQuery }) => {
    const [query, setQuery] = useState(initialQuery);
    const [inputBox, setInputBox] = useState('');
    const handleQuery = () => {
        // Here we send the query to backend.
        console.log('Button pressed!', inputBox);
        setQuery(inputBox);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputButtonRow}>
                <TextInput
                    value={inputBox}
                    placeholder="Browse Books"
                    onChangeText={setInputBox}
                    style={styles.input}
                />
                <TouchableOpacity style={styles.button} onPress={handleQuery}>
                    <Text style={styles.buttonText}>Browse!</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.header}>
                <Text style={styles.headerText}>{query}</Text>
            </View>
            <View style={styles.welcome}>
                <Text style={styles.welcomeText}>Welcome to the Profile Page for {query}! </Text>
                <Text style={styles.welcomeText}>Here we will add the book information.
Explore a world of literature right at your fingertips. From timeless classics to modern masterpieces, our extensive collection ensures there is something for every reader.
Delve into detailed descriptions, insightful reviews, and author biographies, all designed to enhance your reading experience.</Text>
            </View>

        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#eb2727',
        width: width,
    },
    header: {
        alignSelf: 'center',
        justifyContent: 'flex-end',
        width: width,
        backgroundColor: 'black',
        marginTop: 10,
        marginBottom: 10,
        paddingVertical: 10,
    },
    headerText: {
        marginLeft: 20,
        fontSize: 25, // Larger text for the app name
        fontWeight: 'bold',
        color: 'white',
    },
    welcome: {
        alignSelf: 'center',
        justifyContent: 'flex-end',
        width: width,
    },
    welcomeText: {
        marginLeft: 20,
        marginBottom: 10,
        marginTop: 10,
        fontSize: 18, // Larger text for the app name
        fontWeight: 'bold',
        color: 'white',
    },
    numberone: {
        alignSelf: 'center',
        justifyContent: 'flex-end',
        width: width,
    },
    numberoneText: {
        marginLeft: 20,
        fontSize: 10, // Larger text for the app name
        fontWeight: 'bold',
        color: 'white',
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        width: width * 0.9 * 0.95, // Set the width to 75% of the screen width
        alignSelf: 'center',
        marginTop: 10,
    },
    inputButtonRow: {
        flexDirection: 'row',  // Aligns children in a horizontal row
        alignItems: 'center',  // Aligns children vertically
        width: width * 0.95,  // Match the input fields
        alignSelf: 'center',  // Center the button horizontally
        justifyContent: 'center',  // Center text vertically
        marginTop: 10,
    },
    button: {
        backgroundColor: 'white',  // Example blue background color
        padding: 10,
        borderRadius: 10,
        borderColor: 'gray',
        borderWidth: 1,
        alignItems: 'center',  // Center text horizontally
        alignSelf: 'center',  // Center the button horizontally
        justifyContent: 'center',  // Center text vertically
        marginTop: 10,
    },
    buttonText: {
        color: '#eb2727', // White text color
        fontSize: 16,
        fontWeight: 'bold',
    },

});
export default BookPage;