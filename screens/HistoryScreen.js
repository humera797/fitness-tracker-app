import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { auth, db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function HistoryScreen({ navigation }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            setLoading(false);
            return;
        }
        try {
            const historyRef = collection(db, 'users', userId, 'completedWorkouts');
            const q = query(historyRef, orderBy('date', 'desc'));
            const querySnapshot = await getDocs(q);

            const historyList = [];
            querySnapshot.forEach(doc => {
                const data = doc.data();
                historyList.push({
                    id: doc.id,
                    date: data.date,
                    workouts: data.workouts || []
                });
            });
            setHistory(historyList);
        } catch (error) {
            console.log('Error loading history:', error);
        } finally {
            setLoading(false);
        }
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

            <Text style={styles.header}>HISTORY</Text>

            {history.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyscreenText}>No workouts completed yet!</Text>
                    <Text style={styles.emptyscreenSubText}>Complete a workout now</Text>
                </View>
            ) : (
                <FlatList
                    data={history}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.dateText}>{item.date}</Text>
                            <View style={styles.workoutsContainer}>
                                {item.workouts.map((workout, index) => (
                                    <Text key={index} style={styles.workoutName}>• {workout}</Text>
                                ))}
                            </View>
                        </View>
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
    loadingText: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 250,
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 8,
        marginBottom: 10,
    },
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#554440',
        marginBottom: 10,
    },
    workoutsContainer: {
        marginLeft: 10,
    },
    workoutName: {
        fontSize: 14,
        color: '#a49592',
        marginBottom: 4,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

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