import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import BookPage from './BookPage';

const { width } = Dimensions.get('window'); // Get the width of the screen

const MainPage = () => {
    const [query, setQuery] = useState('');
    const [querysend, setQuerySend] = useState(false);
    const handleQuery = () => {
        // Here we send the query to backend.
        console.log('Button pressed!',query);
        setQuerySend(true);
    };
    if (querysend){
        return <BookPage query={query}/>
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.welcome}>
                <Text style={styles.welcomeText}>Welcome! What would you like to read today?</Text>
            </View>
            <View style={styles.inputButtonRow}>
                <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Browse Books"
                    style={styles.input}
                />
                <TouchableOpacity style={styles.button} onPress={handleQuery}>
                    <Text style={styles.buttonText}>Browse!</Text>
                </TouchableOpacity>

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
    },
    headerText: {
        marginLeft: 20,
        fontSize: 35, // Larger text for the app name
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
export default MainPage;