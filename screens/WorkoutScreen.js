import React from 'react';
import {View, Text, StyleSheet} from 'react-native';


export default function WorkoutScreen() {
    return (
        <View style={styles.container}>
                <Text style={styles.header}>Workout Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: '600',
    },
});


