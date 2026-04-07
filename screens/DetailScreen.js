import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore';
import Entypo from '@expo/vector-icons/Entypo';

export default function DetailScreen({ route, navigation }) {
    const { exercise, area } = route.params;
    const [isFavourite, setIsFavourite] = useState(false);

    useEffect(() => {
        checkIfFavourite();
    }, []);

    const checkIfFavourite = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                const favourites = userDoc.data().favourites || [];
                setIsFavourite(favourites.includes(exercise.name));
            }
        } catch (error) {
            console.log('Error checking favourite:', error);
        }
    };

    const toggleFavourite = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            Alert.alert('Error', 'Please login to save favourites');
            return;
        }

        try {
            if (isFavourite) {
                await updateDoc(doc(db, 'users', userId), {
                    favourites: arrayRemove(exercise.name)
                });
                setIsFavourite(false);
                Alert.alert('Removed', `${exercise.name} removed from favourites`);
            } else {
                await updateDoc(doc(db, 'users', userId), {
                    favourites: arrayUnion(exercise.name)
                });
                setIsFavourite(true);
                Alert.alert('Added', `${exercise.name} added to favourites!`);
            }
        } catch (error) {
            console.log('Error toggling favourite:', error);
            Alert.alert('Error', 'Could not update favourites');
        }
    };

    const handleCompleteWorkout = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            Alert.alert('Error', 'Please login to save progress');
            return;
        }

        try {
            const today = new Date().toISOString().split('T')[0];
            const workoutRef = doc(db, 'users', userId, 'completedWorkouts', today);

            const docSnap = await getDoc(workoutRef);

            if (docSnap.exists()) {
                await updateDoc(workoutRef, {
                    workouts: arrayUnion(exercise.name),
                    count: (docSnap.data().count || 0) + 1,
                    date: today
                });
            } else {
                await setDoc(workoutRef, {
                    workouts: [exercise.name],
                    count: 1,
                    date: today
                });
            }

            Alert.alert('Great Job!', `${exercise.name} completed! 💪`);
            navigation.goBack();
        } catch (error) {
            console.log('Error saving workout:', error);
            Alert.alert('Error', 'Could not save workout');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <Text style={styles.title} adjustsFontSizeToFit numberOfLines={2}>{exercise.name}</Text>

                {exercise.image && (
                    <View style={styles.imageContainer}>
                        <Image source={exercise.image} style={styles.exerciseImage} resizeMode="contain" />
                    </View>
                )}

                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{exercise.duration}</Text>
                        <Text style={styles.statLabel}>minutes</Text>
                    </View>

                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{exercise.difficulty}</Text>
                        <Text style={styles.statLabel}>difficulty</Text>
                    </View>

                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{exercise.calories}</Text>
                        <Text style={styles.statLabel}>calories burned</Text>
                    </View>

                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{exercise.equipment}</Text>
                        <Text style={styles.statLabel}>equipment</Text>
                    </View>
                </View>

                <View style={styles.descriptionsContainer}>
                    <Text style={styles.descriptionTitle}>How to do it</Text>

                    <TouchableOpacity onPress={toggleFavourite}
                        style={styles.favouriteButton}>
                        <Entypo
                            name={isFavourite ? 'heart' : 'heart-outlined'}
                            size={29}
                            color={isFavourite ? '#d90000e5' : '#000000'}
                        />
                    </TouchableOpacity>
                    <Text style={styles.descriptionsText}>{exercise.descriptions}</Text>

                    <View style={styles.tipsContainer}>
                        <Text style={styles.tipsTitle}>Tip to Remember!</Text>
                        <Text style={styles.tipsText}>• 3 sets of 12 reps and 60 seconds break.</Text>
                        <Text style={styles.tipsText}>• Engage your core.</Text>
                        <Text style={styles.tipsText}>• Don't forget to breath and stay hydrated!</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.completeButton} onPress={handleCompleteWorkout}>
                    <Text style={styles.completeButtonText}>Workout Complete</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffff',
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 35,
    },
    exerciseImage: {
        width: '100%',
        height: 'undefined',
        aspectRatio: 16 / 9,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignSelf: 'center'
    },

    title: {
        fontSize: 30,
        fontWeight: 'bold',
        fontStyle: 'italic',
        color: '#A79692',
        textAlign: 'center',
        flex: 1,
        flexShrink: 1,
        marginTop: 40,
        bottom: 20
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    statBox: {
        backgroundColor: '#d6c4c0',
        borderRadius: 10,
        padding: 10,
        width: '48%',
        marginBottom: 10,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff',
        textAlign: 'center',
    },
    statLabel: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '500',
        marginTop: 4,
    },
    descriptionsContainer: {
        backgroundColor: '#d6c4c0',
        margin: 15,
        padding: 30,
        borderRadius: 12,
        marginTop: 0,
    },
    descriptionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 5,
        bottom: 10
    },
    descriptionsText: {
        fontSize: 18,
        fontWeight: '400',
        color: '#000000',
    },
    completeButton: {
        backgroundColor: '#A79692',
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
    backButton: {
        top: 25,
        left: 20,
    },
    backText: {
        fontSize: 16,
        fontWeight: '500',
    },
    tipsContainer: {
        marginTop: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 10,
    },
    tipsText: {
        fontSize: 15,
        color: '#554440',
        marginBottom: 6,
    },
    favouriteButton: {
        position: 'absolute',
        top: 8,
        right: 12,
    },
});
