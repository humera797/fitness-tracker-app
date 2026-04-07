// Home Screen - Displays user's fitness data and allows them to log out

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { LineChart } from 'react-native-gifted-charts';
import Slider from '@react-native-community/slider';
import { useFocusEffect } from '@react-navigation/native';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function HomeScreen() {
    const [username, setUsername] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [calories, setCalories] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [water, setWater] = useState(0);
    const [workouts, setWorkouts] = useState(0);
    const [weight, setWeight] = useState(69);
    const [weightData, setWeightData] = useState([]);
    const [weightRange, setWeightRange] = useState({ min: 60, max: 80 });

    const userId = auth.currentUser?.uid;

    useEffect(() => {
        loadUserData();
        loadTodayProgress();
        loadWorkoutsCount();
        loadWeeklyWeightData();
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadTodayProgress();
            loadWorkoutsCount();
            loadWeeklyWeightData();
        }, [])
    );

    const loadUserData = async () => {
        if (!userId) return;
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setUsername(data.name || 'User');
            if (data.weight) {
                setWeight(data.weight);
                const minW = Math.max(40, data.weight - 5);
                const maxW = data.weight + 5;
                setWeightRange({ min: minW, max: maxW });
            }
        }
    };
    const loadWeeklyWeightData = async () => {
        if (!userId) return;
        try {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const weightHistory = [];

            const today = new Date();
            const dayOfWeek = today.getDay();
            const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const monday = new Date(today);
            monday.setDate(today.getDate() - daysToMonday);

            for (let i = 0; i < 7; i++) {
                const date = new Date(monday);
                date.setDate(monday.getDate() + i);
                const dateStr = date.toISOString().split('T')[0];

                const weightRef = doc(db, 'users', userId, 'weightHistory', dateStr);
                const weightSnap = await getDoc(weightRef);

                if (weightSnap.exists()) {
                    const data = weightSnap.data();
                    weightHistory.push({
                        value: data.weight,
                        label: days[i],
                        date: dateStr
                    });
                } else {
                    const userDoc = await getDoc(doc(db, 'users', userId));
                    if (userDoc.exists() && userDoc.data().weight) {
                        weightHistory.push({
                            value: userDoc.data().weight,
                            label: days[i],
                            date: dateStr
                        });
                    } else {
                        weightHistory.push({ value: 0, label: days[i], date: dateStr });
                    }
                }
            }
            setWeightData(weightHistory);

            const values = weightHistory.filter(w => w.value > 0).map(w => w.value);
            if (values.length > 0) {
                const minVal = Math.min(...values) - 2;
                const maxVal = Math.max(...values) + 2;
                setWeightRange({ min: minVal, max: maxVal });
            }
        } catch (error) {
            console.log('Error loading weight data:', error);
        }
    };

    const loadTodayProgress = async () => {
        if (!userId) return;
        const today = new Date().toISOString().split('T')[0];
        const docRef = doc(db, 'users', userId, 'dailyProgress', today);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setCalories(data.calories || 0);
            setMinutes(data.minutes || 0);
            setWater(data.water || 0);
        }
    };

    const loadWorkoutsCount = async () => {
        if (!userId) return;
        const today = new Date().toISOString().split('T')[0];
        const docRef = doc(db, 'users', userId, 'completedWorkouts', today);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setWorkouts(docSnap.data().count || 0);
        } else {
            setWorkouts(0);
        }
    };

    const saveDailyProgress = async (newCalories, newMinutes, newWater) => {
        if (!userId) return;
        const today = new Date().toISOString().split('T')[0];
        const docRef = doc(db, 'users', userId, 'dailyProgress', today);
        await setDoc(docRef, {
            calories: newCalories,
            minutes: newMinutes,
            water: newWater,
            date: today
        }, { merge: true });
    };

    const saveWeight = async () => {
        if (!userId) return;
        const today = new Date().toISOString().split('T')[0];
        const weightRef = doc(db, 'users', userId, 'weightHistory', today);
        await setDoc(weightRef, {
            weight: weight,
            date: today
        });

        await setDoc(doc(db, 'users', userId), {
            weight: weight
        }, { merge: true });

        Alert.alert('Weight Saved', `Your weight ${weight} kg has been recorded`);
        loadWeeklyWeightData();
    };

    const addCalories = async () => {
        const newValue = calories + 10;
        setCalories(newValue);
        await saveDailyProgress(newValue, minutes, water);
    };

    const removeCalories = async () => {
        const newValue = Math.max(0, calories - 10);
        setCalories(newValue);
        await saveDailyProgress(newValue, minutes, water);
    };

    const addMinutes = async () => {
        const newValue = minutes + 5;
        setMinutes(newValue);
        await saveDailyProgress(calories, newValue, water);
    };

    const removeMinutes = async () => {
        const newValue = Math.max(0, minutes - 5);
        setMinutes(newValue);
        await saveDailyProgress(calories, newValue, water);
    };

    const addWater = async () => {
        const newValue = water + 1;
        setWater(newValue);
        await saveDailyProgress(calories, minutes, newValue);
    };

    const removeWater = async () => {
        const newValue = Math.max(0, water - 1);
        setWater(newValue);
        await saveDailyProgress(calories, minutes, newValue);
    };

    const loadDataForDate = async (date) => {
        if (!userId) return;
        const docRef = doc(db, 'users', userId, 'dailyProgress', date);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setCalories(data.calories || 0);
            setMinutes(data.minutes || 0);
            setWater(data.water || 0);
        } else {
            setCalories(0);
            setMinutes(0);
            setWater(0);
        }
    };

    const onDaySelect = async (day) => {
        setSelectedDate(day.dateString);
        await loadDataForDate(day.dateString);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.greeting}>Hey {username},</Text>
                <Text style={styles.subgreeting}>Let's workout</Text>

                <View style={styles.calendarCard}>
                    <Calendar
                        onDayPress={onDaySelect}
                        markedDates={{
                            [selectedDate]: { selected: true, selectedColor: '#A79692' }
                        }}
                        theme={styles.calendarTheme}
                    />
                </View>

                <Text style={styles.sectionTitle}>Today's Activity</Text>

                <View style={styles.activityCard}>
                    <Text>Calories burned</Text>
                    <View style={styles.counter}>
                        <TouchableOpacity onPress={removeCalories} style={styles.circle}>
                            <Text>-</Text>
                        </TouchableOpacity>
                        <Text>{calories}</Text>
                        <TouchableOpacity onPress={addCalories} style={styles.circle}>
                            <Text>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.activityCard}>
                    <Text>Active minutes</Text>
                    <View style={styles.counter}>
                        <TouchableOpacity onPress={removeMinutes} style={styles.circle}>
                            <Text>-</Text>
                        </TouchableOpacity>
                        <Text>{minutes}</Text>
                        <TouchableOpacity onPress={addMinutes} style={styles.circle}>
                            <Text>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.activityCard}>
                    <Text>Water intake</Text>
                    <View style={styles.counter}>
                        <TouchableOpacity onPress={removeWater} style={styles.circle}>
                            <Text>-</Text>
                        </TouchableOpacity>

                        <Text>{water}</Text>
                        <TouchableOpacity onPress={addWater} style={styles.circle}>
                            <Text>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.activityCard}>
                    <Text>workouts logged</Text>
                    <Text style={styles.workoutCount}>{workouts}</Text>
                </View>

                <Text style={styles.sectionTitle}>Today's Plan</Text>

                <View style={styles.planCard}>
                    <Text style={styles.planTitle}>Plan</Text>
                    <Text style={styles.planDetails}>Duration: 30 minutes</Text>
                    <Text style={styles.planDetails}>Exercises: 6</Text>
                    <TouchableOpacity style={styles.startButton}>
                        <Text style={styles.startText}>Start Workout</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Weekly Weight (kg)</Text>
                    <View style={styles.chartWrapper}>
                        {weightData.length > 0 && (
                            <LineChart
                                data={weightData}
                                width={295}
                                height={200}
                                maxValue={weightRange.max}
                                mostNegativeValue={weightRange.min}
                                stepValue={10}
                                color="#A79692"
                                thickness={3}
                                hideDataPoints={false}
                                dataPointsColor="#A79692"
                                dataPointsRadius={5}
                                textColor="#554440"
                                backgroundColor="#fff"
                                isAnimated={true}
                                spacing={40}
                                yAxisTextStyle={{ fontSize: 11 }}
                                xAxisLabelTextStyle={{ fontSize: 11 }}
                                showVerticalLines={true}
                                verticalLinesColor="#e0e0e0"
                                yAxisColor="#ddd"
                                xAxisColor="#ddd"
                                noOfSections={6}
                                yAxisLabelWidth={35}

                            />
                        )}
                    </View>
                </View>

                <View style={styles.weightContainer}>
                    <Text style={styles.weightTitle}>Update Today's Weight</Text>
                    <Text style={styles.weightValue}>
                        {weight && typeof weight === 'number' ? weight.toFixed(1) : '0'} kg</Text>

                    <Slider
                        style={styles.slider}
                        minimumValue={weightRange.min}
                        maximumValue={weightRange.max}
                        step={0.5}
                        value={weight}
                        onValueChange={(value) => setWeight(value)}
                        inverted={true}
                        onSlidingComplete={async (value) => {
                            if (userId) {
                                const today = new Date().toISOString().split('T')[0];
                                const weightRef = doc(db, 'users', userId, 'weightHistory', today);
                                await setDoc(weightRef, {
                                    weight: value,
                                    date: today,
                                    timestamp: new Date().toISOString()
                                }, { merge: true });

                                await setDoc(doc(db, 'users', userId), {
                                    weight: value
                                }, { merge: true });

                                Alert.alert('Weight Updated', `${value.toFixed(1)} kg saved to your profile`);
                                loadWeeklyWeightData();
                            }
                        }}
                        minimumTrackTintColor="#A79692"
                        maximumTrackTintColor="#d6c4c0"
                        thumbTintColor="#A79692"
                        thumbSize={27}
                        tapToSeek={true}
                    />

                    <View style={styles.weightRange}>
                        <Text style={styles.rangeText}>{weightRange.max} kg</Text>
                        <Text style={styles.rangeText}>{weightRange.min} kg</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C3B2AE',
        padding: 30,
        justifyContent: 'center',
    },
    greeting: {
        fontSize: 25,
        fontWeight: '500',
        position: 'absolute',
        left: 8,
    },
    subgreeting: {
        fontSize: 18,
        fontWeight: '400',
        position: 'absolute',
        top: 30,
        left: 10,
    },
    calendarCard: {
        backgroundColor: '#ffffff',
        color: '#C3B2AE',
        borderRadius: 12,
        padding: 10,
        marginBottom: 250,
        top: 70,
    },
    calendarTheme: {
        selectedDayBackgroundColor: "#A79692",
        selectedDayTextColor: "#ffffff",
        todayTextColor: "#A79692",
        arrowColor: "#C3B2AE",
        monthTextColor: "#000000",
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: '500',
        marginBottom: 15,
        bottom: 170,
        left: 5
    },

    activityCard: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        bottom: 170,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    counter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15
    },

    circle: {
        width: 30,
        height: 30,
        backgroundColor: '#EAEAEA',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15
    },
    planCard: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        bottom: 170,
    },
    planTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 10,
    },
    planDetails: {
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 12,
    },
    startButton: {
        backgroundColor: '#A79692',
        padding: 10,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    startText: {
        color: '#ffffff',
        fontWeight: '500',
    },
    chartContainer: {
        backgroundColor: '#fff',
        bottom: 160,
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    chartWrapper: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#554440',
        alignSelf: 'center',
    },
    weightContainer: {
        backgroundColor: '#fff',
        margin: 15,
        padding: 20,
        borderRadius: 10,
        bottom: 150,
        width: '100%',
        alignSelf: 'center',
    },
    weightTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: '#7f8c8d',
        marginBottom: 20,
        textAlign: 'left',
    },
    weightValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#554440',
        textAlign: 'left',
        marginBottom: 20
    },
    slider: {
        width: '100%',
        height: 33,
    },
    weightRange: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 4
    },
    rangeText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#7f8c8d',
        marginBottom: 10,
    },
});