import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-gifted-charts';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { getEarnedBadges } from '../utils/gamification';

export default function ActivityScreen({ navigation }) {
    const [activeMinutesData, setActiveMinutesData] = useState([]);
    const [caloriesData, setCaloriesData] = useState([]);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [totalWorkouts, setTotalWorkouts] = useState(0);
    const [totalCalories, setTotalCalories] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [weightLoss, setWeightLoss] = useState(0);
    const [startingWeight, setStartingWeight] = useState(0);
    const [currentWeight, setCurrentWeight] = useState(0);
    const [earnedBadges, setEarnedBadges] = useState([]);

    useEffect(() => {
        loadActivityData();
        loadTotalStats();
        loadWeightLossData();
        loadEarnedBadges();
    }, []);

    const loadEarnedBadges = async () => {
        const badges = await getEarnedBadges();
        console.log('Badges to display:', badges);
        setEarnedBadges(badges);
    };

    const loadActivityData = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;
        try {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const minutes = [];
            const calories = [];

            const today = new Date();
            const dayOfWeek = today.getDay();
            const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const monday = new Date(today);
            monday.setDate(today.getDate() - daysToMonday);

            for (let i = 0; i < 7; i++) {
                const date = new Date(monday);
                date.setDate(monday.getDate() + i);
                const dateStr = date.toISOString().split('T')[0];

                const docRef = doc(db, 'users', userId, 'dailyProgress', dateStr);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    minutes.push({ value: data.minutes || 0, label: days[i] });
                    calories.push({ value: data.calories || 0, label: days[i] });
                } else {
                    minutes.push({ value: 0, label: days[i] });
                    calories.push({ value: 0, label: days[i] });
                }
            }

            setActiveMinutesData(minutes);
            setCaloriesData(calories);
        } catch (error) {
            console.log('Error loading activity:', error);
        }
    };

    const loadWeightLossData = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;
        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            let latestWeight = 0;
            let firstWeight = null;

            if (userDoc.exists()) {
                const userData = userDoc.data();
                latestWeight = userData.weight || 0;
                setCurrentWeight(latestWeight);
            }

            const weightHistoryRef = collection(db, 'users', userId, 'weightHistory');
            const weightQuery = query(weightHistoryRef, orderBy('date', 'asc'), limit(1));
            const weightSnapshot = await getDocs(weightQuery);

            if (!weightSnapshot.empty) {
                const firstWeightDoc = weightSnapshot.docs[0];
                firstWeight = firstWeightDoc.data().weight;
                setStartingWeight(firstWeight);

                if (latestWeight && firstWeight) {
                    const loss = firstWeight - latestWeight;
                    setWeightLoss(loss > 0 ? loss : 0);
                }
            } else {
                setStartingWeight(latestWeight);
                setWeightLoss(0);
            }
        } catch (error) {
            console.log('Error loading weight loss:', error);
        }
    };

    const loadTotalStats = async () => {
        const userId = auth.currentUser?.uid;
        if (!userId) return;

        try {
            const userDoc = await getDoc(doc(db, 'users', userId));
            if (userDoc.exists()) {
                const createdAt = userDoc.data().createdAt?.toDate();
                if (createdAt) {
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    setStartDate(createdAt.toLocaleDateString('en-US', options));
                } else {
                    const now = new Date();
                    const options = { year: 'numeric', month: 'long', day: 'numeric' };
                    setStartDate(now.toLocaleDateString('en-US', options));
                }
            }

            const workoutsRef = collection(db, 'users', userId, 'completedWorkouts');
            const querySnapshot = await getDocs(workoutsRef);

            let totalWorkoutCount = 0;
            querySnapshot.forEach(doc => {
                const data = doc.data();
                totalWorkoutCount += data.count || 0;
            });

            const progressRef = collection(db, 'users', userId, 'dailyProgress');
            const progressSnapshot = await getDocs(progressRef);

            let totalMins = 0;
            let totalCals = 0;
            progressSnapshot.forEach(doc => {
                const data = doc.data();
                totalMins += data.minutes || 0;
                totalCals += data.calories || 0;
            });

            setTotalMinutes(totalMins);
            setTotalCalories(totalCals);
            setTotalWorkouts(totalWorkoutCount);
        } catch (error) {
            console.log('Error loading stats:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Your Progress</Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Journey Started</Text>
                    <Text style={styles.dateText}>{startDate}</Text>

                    <View style={styles.statsGrid}>
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>{totalMinutes}</Text>
                            <Text style={styles.statLabel}>Total active minutes</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>{totalWorkouts}</Text>
                            <Text style={styles.statLabel}>Total workouts</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statNumber}>{totalCalories}</Text>
                            <Text style={styles.statLabel}>Total calories burned</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={[styles.statNumber, weightLoss > 0 && styles.weightLossText]}>
                                {weightLoss > 0 ? `-${weightLoss}` : weightLoss}
                            </Text>
                            <Text style={styles.statLabel}>Total weight loss (kg)</Text>
                            {startingWeight > 0 && currentWeight > 0 && (
                                <Text style={styles.weightDetail}>
                                    {startingWeight}kg → {currentWeight}kg
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.achievementSection}>
                        <Text style={styles.achievementTitle}>🏆 Achievement Badges</Text>
                        <View style={styles.badgeContainer}>
                            {earnedBadges.length === 0 ? (
                                <Text style={styles.noBadgesText}>You have no achievements yet!</Text>
                            ) : (
                                earnedBadges.map((badge, index) => (
                                    <View key={index} style={styles.badgeItem}>
                                        <Text style={styles.badgeIcon}>{badge.icon || '🏆'}</Text>
                                        <View style={styles.badgeInfo}>
                                            <Text style={styles.badgeName}>{badge.name}</Text>
                                            <Text style={styles.badgeDescription}>{badge.description}</Text>
                                        </View>
                                    </View>
                                ))
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Active Minutes (Last 7 days)</Text>
                    {activeMinutesData.length > 0 && (
                        <LineChart
                            data={activeMinutesData}
                            width={250}
                            height={200}
                            color="#A79692"
                            thickness={2}
                            dataPointsColor="#A79692"
                            dataPointsRadius={4}
                            textColor="#554440"
                            backgroundColor="#fff"
                            spacing={42}
                            yAxisTextStyle={{ fontSize: 10 }}
                            xAxisLabelTextStyle={{ fontSize: 11 }}
                            showVerticalLines={true}
                            verticalLinesColor="#e0e0e0"
                            yAxisColor="#ddd"
                            xAxisColor="#ddd"
                        />
                    )}
                </View>
                <View style={styles.chartCard}>
                    <Text style={styles.chartTitle}>Calories Burned (Last 7 days)</Text>
                    {caloriesData.length > 0 && (
                        <LineChart
                            data={caloriesData}
                            width={250}
                            height={200}
                            color="#A79692"
                            thickness={2}
                            dataPointsColor="#A79692"
                            dataPointsRadius={4}
                            textColor="#554440"
                            backgroundColor="#fff"
                            spacing={42}
                            yAxisTextStyle={{ fontSize: 10 }}
                            xAxisLabelTextStyle={{ fontSize: 11 }}
                            showVerticalLines={true}
                            verticalLinesColor="#e0e0e0"
                            yAxisColor="#ddd"
                            xAxisColor="#ddd"
                        />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C3B2AE',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#554440',
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 20,
        borderRadius: 15,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#7f8c8d',
        marginBottom: 5,
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#554440',
        marginBottom: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statBox: {
        width: '48%',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#A79692',
    },
    weightLossText: {
        color: '#A79692',
    },
    statLabel: {
        fontSize: 11,
        color: '#7f8c8d',
        marginTop: 5,
        textAlign: 'center',
    },
    weightDetail: {
        fontSize: 10,
        color: '#000000',
        marginTop: 4,
        textAlign: 'center',
    },
    achievementSection: {
        marginTop: 24,
        paddingTop: 24,
        borderTopWidth: 2,
        borderTopColor: '#dadbdb',
    },
    achievementTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#554440',
        marginBottom: 20,
    },
    badgeContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    badgeItem: {
        backgroundColor: '#f0ddd8',
        borderColor: '#A79692',
        borderWidth: 1,
        padding: 11,
        borderRadius: 15,
        marginBottom: 13,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    badgeInfo: {
        marginLeft: 12,
        flex: 1,
    },
    badgeName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#554440',
    },
    badgeIcon: {
        fontSize: 18,
        alignSelf: 'center',
    },
    badgeDescription: {
        fontSize: 12,
        fontWeight: '700',
        marginTop: 2,
        color: '#A79692',
    },
    noBadgesText: {
        fontSize: 15,
        color: '#554440',
        padding: 15,
        left: 33
    },
    chartCard: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#554440',
        alignSelf: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
    },
    backText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#554440',
    },
});