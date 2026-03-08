// Reusable button component for the App

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function AppButton({ title, onPress, type = 'primary' }) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                type === 'primary' ? styles.primary : styles.secondary
            ]}
            onPress={onPress}
        >
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    button: {
        height: 55,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 8,
        width: 290,
        left: 25,
    },

    primary: {
        backgroundColor: '#C3B2AE',
        borderWidth: 1,
        borderColor: '#9A8F8A',
    },

    secondary: {
        backgroundColor: '#C3B2AE',
    },

    text: {
        fontWeight: '500',
        fontSize: 16,
        color: 'black',
    },
});