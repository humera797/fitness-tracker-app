import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function AppInput({ placeholder, secureTextEntry = false }) {
    return (
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
        />
    );
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#f2f2f2',
        padding: 12,
        borderRadius: 8,
        marginVertical: 5,
    },
});