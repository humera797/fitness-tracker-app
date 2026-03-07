// WelcomeScreen - The first screen user see when they open the app, with options to navigate to Login or Signup

import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';

export default function WelcomeScreen({ navigation }) {
    return (
        <ImageBackground
            source={require('../assets/pinkbg.png')}
            style={styles.background}
        >
            <View style={styles.overlay}>

                <Text style={styles.title}>DO IT{"\n"}FOR{"\n"}YOURSELF</Text>

                <View style={styles.spacer} />

                <View style={styles.bottomButtons}>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Signup')}
                    >
                        <Text style={styles.buttonText}>Signup</Text>
                    </TouchableOpacity>

                </View>

            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },

    overlay: {
        flex: 1,
        padding: 30,
    },

    title: {
        fontSize: 45,
        fontWeight: 'bold',
        color: '#BBAAA3',
        marginTop: 20,
        left: -25,
    },

    spacer: {
        flex: 1,
    },

    bottomButtons: {
        marginBottom: 50,
    },

    button: {
        backgroundColor: '#C3B2AE',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        width: '75%',
        alignSelf: 'center',
    },

    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '400',
    }
});