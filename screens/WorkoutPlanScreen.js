import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { completeWorkout } from '../utils/workoutPlan';

export default function WorkoutPlanScreen({ navigation, route }) {
    const { date, exercises, planName, isCompleted } = route.params;
    const [workoutCompleted, setWorkoutCompleted] = useState(isCompleted);

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const handleExercisePress = (exercise) => {
        navigation.navigate('DetailScreen', {
            exercise: exercise,
            area: 'WORKOUT PLAN'
        });
    };

    const handleCompleteWorkout = async () => {
        if (!workoutCompleted) {
            await completeWorkout(date);
            setWorkoutCompleted(true);
            Alert.alert('FANTASTIC!', `You completed Workout for ${formatDate(date)}! 💪`);
            navigation.goBack();
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.headerContainer}>
                <Text style={styles.header}>{planName}</Text>
                <Text style={styles.dateText}>{formatDate(date)}</Text>
            </View>

            <FlatList
                data={exercises}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => handleExercisePress(item)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.exerciseNumberContainer}>
                            <Text style={styles.exerciseNumber}>{index + 1}</Text>
                            <Text style={styles.exerciseName}>{item.name}</Text>
                        </View>
                        <Text style={styles.arrow}>→</Text>
                    </TouchableOpacity>
                )}
            />

            {!workoutCompleted && (
                <TouchableOpacity style={styles.completeButton} onPress={handleCompleteWorkout}>
                    <Text style={styles.completeButtonText}>Complete Workout</Text>
                </TouchableOpacity>
            )}

            {workoutCompleted && (
                <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>✓ Workout Completed</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C3B2AE',
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 35,
    },
    header: {
        fontSize: 25,
        fontWeight: '700',
        color: '#554440',
    },
    dateText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#8b736e',
        marginTop: 10,
    },
    card: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    exerciseNumberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    exerciseNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: '#A79692',
        width: 30,
    },
    exerciseName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#a49592',
    },
    arrow: {
        fontSize: 18,
        color: '#A79692',
        fontWeight: '600',
    },
    completeButton: {
        backgroundColor: '#8b736e',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        alignItems: 'center',
        width: '75%',
        alignSelf: 'center',
    },
    completeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    completedBadge: {
        backgroundColor: '#A79692',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    completedText: {
        color: '#fff',
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
});