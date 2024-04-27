import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, Button, View, Text, Dimensions, TouchableOpacity } from 'react-native';
import Landing from './Landing';
const { width } = Dimensions.get('window'); // Get the width of the screen

const RegistrationScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullname, setFullname] = useState('');
    const [username, setUsername] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);

    const handleRegistration = () => {
        // Here you would usually send the email and password to your backend service
        console.log('Registering:', fullname, username, email, password);
        // Remember to handle validation, error messages, and security best practices
        setIsRegistered(true);
    };
    if(isRegistered){
        return <Landing />
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Bibliosearch</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name:</Text>
                <TextInput
                    value={fullname}
                    onChangeText={setFullname}
                    placeholder="Enter your full name"
                    style={styles.input}
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Username:</Text>
                <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter your username"
                    style={styles.input}
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    style={styles.input}
                    autoCapitalize="none"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password:</Text>
                <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    style={styles.input}
                    secureTextEntry
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleRegistration}> //Button
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>      
              </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        marginTop: 80,
        marginBottom: 80,
        alignSelf:'center',
        justifyContent: 'flex-end',
        width: width,
    },
    headerText: {
        marginLeft: 20,
        fontSize: 70, // Larger text for the app name
        fontWeight: 'bold',
        color: 'white',
    },
    container: {
        flex: 1,
        padding: 16,
        alignContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#eb2727',
    },
    inputContainer: {
        alignContent: 'center',
        alignSelf: 'center',
        marginBottom: 15,
        width: width * 0.9,
    },
    label: {
        fontSize: 20,
        marginBottom: 6,
        textAlign: 'left',
        color: 'white',
        fontWeight: 'bold'
    },
    input: {
        backgroundColor: 'white',
        height: 40,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        width: width * 0.9 * 0.95, // Set the width to 75% of the screen width
    },
    button: {
      backgroundColor: 'white',  // Example blue background color
      padding: 10,
      borderRadius: 10,
      borderColor: 'gray',
      borderWidth: 1,
      width: 300,  // Match the input fields
      alignItems: 'center',  // Center text horizontally
      alignSelf: 'center',  // Center the button horizontally
      justifyContent: 'center',  // Center text vertically
      marginTop: 50,
    },
    buttonText: {
      color: '#eb2727', // White text color
      fontSize: 16,
      fontWeight: 'bold',
    },

});

export default RegistrationScreen;
