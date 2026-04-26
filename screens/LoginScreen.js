import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        checkLoggedInStatus();
    }, []);

    const checkLoggedInStatus = async () => {
        try {
            const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');
            const userEmail = await AsyncStorage.getItem('userEmail');

            console.log('Checking login status - logged in:', userLoggedIn);
            console.log('Checking login status - email:', userEmail);

            if (userLoggedIn === 'true' && userEmail) {
                console.log('User was previously logged in, redirecting to Home');
                navigation.replace('Home');
            }
        } catch (error) {
            console.log('Error checking login status:', error);
        }
    };

    const loadSavedUserData = async (user) => {
        try {
            await AsyncStorage.setItem('userLoggedIn', 'true');
            await AsyncStorage.setItem('userEmail', user.email);
            await AsyncStorage.setItem('userUID', user.uid);
            await AsyncStorage.setItem('lastLoginTime', new Date().toISOString());

            console.log('User data saved successfully');
            return true;
        } catch (error) {
            console.log('Error saving user data:', error);
            return false;
        }
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await loadSavedUserData(user);

            navigation.replace('Home');
        } catch (error) {
            let errorMessage = 'Login failed';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'User not found';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Wrong password';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            }
            Alert.alert('Login Failed', errorMessage);
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.header}>Welcome Back,</Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor='#666666'
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor='#666666'
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                <Text style={styles.buttonText}>
                    {loading ? 'Logging in...' : 'Login'}
                </Text>
            </TouchableOpacity>

            <View style={styles.bottomtextcontainer} />

            <Text style={styles.Text}>Dont have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupText}>SignUp</Text>
            </TouchableOpacity >
        </SafeAreaView >
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
        backgroundColor: '#A79692',
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
