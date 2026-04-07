import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { exercisesData } from '../data/exercises';
import Entypo from '@expo/vector-icons/Entypo';

export default function FavouritesScreen({ navigation }) {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavourites();
    }, []);

    const loadFavourites = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            setLoading(false);
            return;
        }
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                const data = userDoc.data();
                setFavourites(data.favourites || []);
            }
        } catch (error) {
            console.log('Error loading favourites:', error);
        } finally {
            setLoading(false);
        }
    };
    const getFullExercise = (exerciseName) => {
        const allExercises = [
            ...exercisesData.FULLBODY,
            ...exercisesData.ABS,
            ...exercisesData.LEGS,
            ...exercisesData.ARMS,
            ...exercisesData.BACK,
            ...exercisesData.CHEST,
            ...exercisesData.SHOULDERS,
            ...exercisesData.GLUTES,
        ];
        return allExercises.find(ex => ex.name === exerciseName);
    };

    const handleExercisePress = (exerciseName) => {
        const fullExercise = getFullExercise(exerciseName);
        if (fullExercise) {
            navigation.navigate('DetailScreen', {
                exercise: fullExercise,
                area: 'FAVOURITES'
            });
        }
    };
    const removeFavourite = async (exerciseName) => {
        Alert.alert(
            'Remove Favourite',
            `Remove ${exerciseName} from favourites?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        const userId = auth.currentUser?.uid;
                        if (userId) {
                            await updateDoc(doc(db, 'users', userId), {
                                favourites: arrayRemove(exerciseName)
                            });
                            loadFavourites();
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Just a moment....</Text>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.header}>FAVOURITES</Text>

            {favourites.length === 0 ? (
                <View style={styles.emptyscreenContainer}>
                    <Text style={styles.emptyscreenText}>No favourites yet!</Text>
                    <Text style={styles.emptyscreenSubText}>Add your favourite workouts now</Text>
                </View>
            ) : (
                <FlatList
                    data={favourites}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => handleExercisePress(item)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.exerciseName}>{item}</Text>
                            <TouchableOpacity onPress={() => removeFavourite(item)}>
                                <Entypo name="heart" size={24} color="#d90000e5" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C3B2AE',
        padding: 20,
    },
    header: {
        fontSize: 23,
        fontWeight: '700',
        color: '#554440',
        alignSelf: 'center',
        marginBottom: 80,
        top: 60
    },
    card: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    loadingText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 250,
        fontWeight: '600',
    },
    emptyscreenContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100
    },
    emptyscreenText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#554440',
        textAlign: 'center',
        bottom: 100
    },
    emptyscreenSubText: {
        fontSize: 16,
        color: '#7f8c8d',
        textAlign: 'center',
        marginTop: 10,
        bottom: 100
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