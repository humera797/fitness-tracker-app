import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

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
            <AppInput placeholder="enter email" />

            <Text style={styles.label}>Password</Text>
            <AppInput placeholder="enter password" secureTextEntry />

            <AppButton title="Login" />
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
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 30,
    },

    label: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: '500',
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
    AppButton: { color: '#C3B2AE' }
});
