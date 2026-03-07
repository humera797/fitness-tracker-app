import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import AppButton from '../components/AppButton';

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
                    <AppButton
                        title="Login"
                        type="secondary"
                        onPress={() => navigation.navigate('Login')}
                    />

                    <AppButton
                        title="Signup"
                        type="secondary"
                        onPress={() => navigation.navigate('Signup')}
                    />
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
        marginBottom: 40,
        color: '#C3B2AE',
    },
});