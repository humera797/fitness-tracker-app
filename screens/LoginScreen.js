// Login Screen - Allows users to log in to their account

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

export default function LoginScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}>
                <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.header}>Welcome Back,</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="enter email"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="enter password"
                secureTextEntry
            />

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.replace("Home")}
            >
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.bottomtextcontainer} />

            <Text style={styles.Text}>Dont have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupText}>SignUp</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 30,
        justifyContent: 'center',
    },

    header: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 25,
    },

    label: {
        marginTop: 15,
        fontSize: 15,
        fontWeight: '500',
        justifyContent: 'center',
        alighnItems: 'center',
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        backgroundColor: '#f0eded',
    },
    bottomtextcontainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Text: {
        fontSize: 13,
        fontWeight: '400',
        marginLeft: 65,
    },
    signupText: {
        color: '#a18d88',
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
        marginLeft: 207,
        marginTop: -17,
    },

    button: {
        backgroundColor: '#A79692',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
        width: '75%',
        alignSelf: 'center',
    },

    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },

    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
    },

    backText: {
        fontSize: 16,
        fontWeight: '500',
    },
})
