import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export default function SignupScreen({ navigation }) {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const handleSignup = () => {
        if (password !== confirmPassword) {
            alert("Oops!Passwords do not match");
            return;
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                navigation.replace("UserData1");
            })
            .catch((error) => {
                alert("Unable to create account! Please try again.");
            });
    };
    return (

        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}>
                <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.header}>Welcome, lets get started</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="enter email"
                placeholderTextColor='#666666'
                onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="create a password"
                placeholderTextColor='#666666'
                secureTextEntry
                onChangeText={setPassword}
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
                style={styles.input}
                placeholder="confirm your password"
                placeholderTextColor='#666666'
                secureTextEntry
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleSignup}

            >
                <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>

            <View style={styles.bottomtextcontainer} />

            <Text style={styles.Text}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C3B2AE',
        padding: 30,
        justifyContent: 'center',
    },

    header: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 25,
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

    loginText: {
        color: '#a18d88',
        fontSize: 14,
        fontWeight: '600',
        textDecorationLine: 'underline',
        marginLeft: 225,
        marginTop: -17,
    },

    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        backgroundColor: '#A79692',
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
    label: {
        marginTop: 15,
        fontSize: 15,
        fontWeight: '450',
        justifyContent: 'center',
        alignItems: 'center',
    },

    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
    },

    backText: {
        fontSize: 16,
        fontWeight: '500',
    }
});