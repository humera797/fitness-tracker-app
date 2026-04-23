import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen({ navigation }) {
    useEffect(() => {
        const checkLoginStatus = async () => {
            const userLoggedIn = await AsyncStorage.getItem('userLoggedIn');

            setTimeout(() => {
                if (userLoggedIn === 'true') {
                    navigation.replace('Home');
                } else {
                    navigation.replace('Welcome');
                }
            }, 2000);
        };

        checkLoginStatus();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FITLY</Text>
            <Text style={styles.subtitle}>Your Fitness Journey Starts Here</Text>

            <Image
                source={require('../assets/splashbg.png')}
                style={styles.image}
                resizeMode="cover"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C3B2AE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 35,
        fontWeight: '800',
        color: '#554440',
        textAlign: 'center',
        marginTop: 45
    },
    subtitle: {
        fontSize: 15,
        color: '#342926',
        fontStyle: 'italic',
        marginTop: 9,
        textAlign: 'center'
    },
    image: {
        width: 140,
        height: 140,
        bottom: 25,
        transform: [{ rotate: '160deg' }],
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
    },
});