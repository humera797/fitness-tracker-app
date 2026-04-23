// WelcomeScreen - The first screen user see when they open the app, with options to navigate to Login or Signup

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.overlay}>

                <Text style={styles.title}>DO IT FOR{"\n"}YOURSELF</Text>

                <Image
                    source={require('../assets/splashbg.png')}
                    style={styles.image}
                    resizeMode="cover"
                />

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
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C3B2AE'
    },
    image: {
        width: 220,
        height: 160,
        alignSelf: 'center',
        transform: [{ rotate: '160deg' }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },

    overlay: {
        flex: 1,
        padding: 30,
    },

    title: {
        fontSize: 45,
        fontWeight: '700',
        color: '#554440',
        marginTop: 140,
        textAlign: 'center',
        opacity: 0.95
    },

    bottomButtons: {
        position: 'absolute',
        bottom: 130,
        left: 30,
        right: 30
    },

    button: {
        backgroundColor: '#A79692',
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