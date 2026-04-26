import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { LineChart } from 'react-native-gifted-charts';
import Slider from '@react-native-community/slider';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import ReminderPopover from '../components/ReminderPopover';
import { getTodayReminder, hasSeenTodayReminder, markReminderSeen } from '../services/reminders';
import { getWorkoutForDate, getCompletedWorkoutDates } from '../services/workoutPlan';
import { checkAndAwardBadges, calculateStreak, getTotalWorkouts, getTotalCalories, getTotalWater, getTotalMinutes } from '../services/gamification';
import { useFocusEffect } from '@react-navigation/native';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function HomeScreen({ navigation }) {

    const today = new Date().toLocaleDateString('en-CA');
    // all the state variables, it keeps track of everything the user does on the home screen 
    const [username, setUsername] = useState('');
    const [selectedDate, setSelectedDate] = useState(today);
    const [calories, setCalories] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [water, setWater] = useState(0);
    const [workouts, setWorkouts] = useState(0);
    const [weight, setWeight] = useState(60);
    const [weightData, setWeightData] = useState([]);
    const [weightRange, setWeightRange] = useState({ min: 60, max: 80 });
    const [todayWorkout, setTodayWorkout] = useState(null);
    const [selectedDateWorkout, setSelectedDateWorkout] = useState(null);
    const [completedDates, setCompletedDates] = useState({});
    const [todaysReminder, setTodaysReminder] = useState(null);
    const [showReminder, setShowReminder] = useState(false);
    const [hasNewReminder, setHasNewReminder] = useState(false);
    const [showBellPopover, setShowBellPopover] = useState(false);
    const [todaysReminderForBell, setTodaysReminderForBell] = useState(null);
    const [isCheckingBadges, setIsCheckingBadges] = useState(false);

    // get the current users uid from firebase auth
    const userId = auth.currentUser?.uid;

    // this is used to fetch all user data when the home screen loads
    useEffect(() => {
        loadUserData();
        loadTodayProgress();
        loadWorkoutsCount();
        loadWeeklyWeightData();
        loadTodayWorkout();
        loadCompletedDates();
        loadWorkoutForSelectedDate(today);
        checkAndShowReminder();
        setSelectedDate(today);
    }, []);

    // reload data every time the user comes back to the screen 
    useFocusEffect(
        useCallback(() => {
            loadTodayProgress();
            loadWorkoutsCount();
            loadWeeklyWeightData();
            loadCompletedDates();
        }, [])
    );

    // get the users name and weight from firestore 
    const loadUserData = async () => {
        if (!userId) return;
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setUsername(data.fullName || data.name);
            if (data.weight) {
                setWeight(data.weight);
                const minW = Math.max(40, data.weight - 5);
                const maxW = data.weight + 5;
                setWeightRange({ min: minW, max: maxW });
            }
        }
    };
    // this loads users weight data for the last 7 days and shows on the chart
    const loadWeeklyWeightData = async () => {
        if (!userId) return;
        try {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const weightHistory = [];

            const todayDate = new Date();
            const dayOfWeek = todayDate.getDay();
            const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            const monday = new Date(todayDate);
            monday.setDate(todayDate.getDate() - daysToMonday);

            // loop through each day and fetch weight data if there is no weight data, it uses the current weight 
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

    // this loads the todays saved progess for calories, minutes and water intake 
    const loadTodayProgress = async () => {
        if (!userId) return;
        const todayStr = new Date().toISOString().split('T')[0];
        const docRef = doc(db, 'users', userId, 'dailyProgress', todayStr);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            setCalories(data.calories || 0);
            setMinutes(data.minutes || 0);
            setWater(data.water || 0);
        }
    };

    // this loads how many workouts the user has completed today
    const loadWorkoutsCount = async () => {
        if (!userId) return;
        const todayStr = new Date().toISOString().split('T')[0];
        const docRef = doc(db, 'users', userId, 'completedWorkouts', todayStr);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setWorkouts(docSnap.data().count || 0);
        } else {
            setWorkouts(0);
        }
    };

    // this saves the users daily progress 
    const saveDailyProgress = async (newCalories, newMinutes, newWater) => {
        if (!userId) return;
        const todayStr = new Date().toISOString().split('T')[0];
        const docRef = doc(db, 'users', userId, 'dailyProgress', todayStr);
        await setDoc(docRef, {
            calories: newCalories,
            minutes: newMinutes,
            water: newWater,
            date: todayStr
        }, { merge: true });
    };

    // this checks if the user has earned any new badges 
    const checkForBadges = async () => {
        if (isCheckingBadges) return;
        setIsCheckingBadges(true);
        const streak = await calculateStreak();
        const totalWorkouts = await getTotalWorkouts();
        const totalCalories = await getTotalCalories();
        const totalWater = await getTotalWater();
        const totalMinutes = await getTotalMinutes();

        const userStats = {
            totalWorkouts: totalWorkouts,
            currentStreak: streak,
            totalCalories: totalCalories,
            totalWater: totalWater,
            totalMinutes: totalMinutes
        };

        const newBadges = await checkAndAwardBadges(userStats);
        if (newBadges.length > 0) {
            const badgeNames = newBadges.map(b => `${b.icon} ${b.name}`).join('\n');
            Alert.alert('NEW ACHIEVEMENT UNLOCKED! 🎉', badgeNames);
        }
        setIsCheckingBadges(false);
    };

    const addCalories = async () => {
        const newValue = calories + 10;
        setCalories(newValue);
        await saveDailyProgress(newValue, minutes, water);
        if (newValue % 5 === 0) {
            await checkForBadges();
        }
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
        if (newValue % 5 === 0) {
            await checkForBadges();
        }
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
        if (newValue % 5 === 0) {
            await checkForBadges();
        }
    };

    const removeWater = async () => {
        const newValue = Math.max(0, water - 1);
        setWater(newValue);
        await saveDailyProgress(calories, minutes, newValue);
    };

    // when user taps on a different date on the calendar data is loaded for that date
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
        const newDate = day.dateString;
        setSelectedDate(newDate);
        await loadDataForDate(newDate);
        await loadWorkoutForSelectedDate(newDate);
    };

    // loads the workout plan for the selecetd date 
    const loadWorkoutForSelectedDate = async (date) => {
        const workout = await getWorkoutForDate(date);
        setSelectedDateWorkout(workout);
    };

    // this loads the todays workout plan 
    const loadTodayWorkout = async () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const workout = await getWorkoutForDate(todayStr);
        setTodayWorkout(workout);
    };

    const handleWorkoutAction = async () => {
        let date, workout;

        if (selectedDate && selectedDate !== new Date().toISOString().split('T')[0]) {
            date = selectedDate;
            workout = selectedDateWorkout;
        } else {
            date = new Date().toISOString().split('T')[0];
            workout = todayWorkout;
        }

        if (!workout) {
            Alert.alert('Error', 'No workout found for this date');
            return;
        }

        if (workout.isCompleted) {
            Alert.alert('Already Completed', 'You already completed this workout!');
        } else {
            navigation.navigate('WorkoutPlan', {
                date: date,
                exercises: workout.exercises,
                planName: workout.planName,
                isCompleted: false
            });
        }
    };

    // this gets all the dates where user completed a workout
    const loadCompletedDates = async () => {
        const dates = await getCompletedWorkoutDates();
        const marked = {};
        dates.forEach(date => {
            marked[date] = {
                marked: true,
                dotColor: '#554440',
                selectedTextColor: '#ffffff'
            };
        });
        setCompletedDates(marked);
    };

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    // this check if the user has seen the rmeinder snd if not it shows the reminder popup
    const checkAndShowReminder = async () => {
        const seen = await hasSeenTodayReminder();
        if (!seen) {
            const reminder = await getTodayReminder();
            if (reminder) {
                setTodaysReminder(reminder);
                setShowReminder(true);
                setHasNewReminder(true);
                await markReminderSeen();
            }
        }
    };
    // this open the bell icon popover
    const openBellPopover = async () => {
        const reminder = await getTodayReminder();
        setTodaysReminderForBell(reminder);
        setShowBellPopover(true);
    };

    const closeBellPopover = () => {
        setShowBellPopover(false);
    };

    const closeReminder = async () => {
        setShowReminder(false);
        await markReminderSeen();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.headerRow}>
                    <Text style={styles.greeting}>Hey {username},</Text>
                    <TouchableOpacity onPress={openBellPopover} style={styles.bellIcon}>
                        <Feather name="bell" size={30} color="#554440" />
                        {hasNewReminder && (
                            <View style={styles.dot}>
                                <Octicons name="dot-fill" size={20} color="#ffffff" />
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                <Text style={styles.subgreeting}>Let's workout</Text>

                <View style={styles.calendarCard}>
                    <Calendar
                        onDayPress={onDaySelect}
                        markedDates={{
                            ...completedDates,
                            [selectedDate]: { selected: true, selectedColor: '#A79692', selectedTextColor: '#ffffff' }
                        }}
                        theme={{
                            ...styles.calendarTheme,
                            todayTextColor: '#A79692',
                        }}
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
                    <Text>Water intake (glasses)</Text>
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
                <Text style={styles.sectionTitle}>
                    {selectedDate === today ? "Today's Plan" : `Your plan for ${formatDate(selectedDate)}`}
                </Text>
                <View style={styles.planCard}>
                    <Text style={styles.planTitle}>
                        {selectedDateWorkout?.planName || todayWorkout?.planName || 'Plan'}
                    </Text>
                    <Text style={styles.planDetails}>Duration: 40-50 minutes</Text>
                    <Text style={styles.planDetails}>
                        Exercises: {selectedDateWorkout?.exercises?.length || todayWorkout?.exercises?.length || 6}
                    </Text>

                    {(selectedDateWorkout?.isCompleted || (selectedDate === today && todayWorkout?.isCompleted)) ? (
                        <View style={[styles.startButton, styles.completedButton]}>
                            <Text style={styles.startText}>Workout Completed ✓</Text>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.startButton} onPress={handleWorkoutAction}>
                            <Text style={styles.startText}>Start Workout</Text>
                        </TouchableOpacity>
                    )}
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
                                const todayStr = new Date().toISOString().split('T')[0];
                                const weightRef = doc(db, 'users', userId, 'weightHistory', todayStr);
                                await setDoc(weightRef, {
                                    weight: value,
                                    date: todayStr,
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
                        <Text style={styles.rangeText}>{weightRange.min} kg</Text>
                        <Text style={styles.rangeText}>{weightRange.max} kg</Text>
                    </View>
                </View>
            </ScrollView>
            <ReminderPopover
                visible={showReminder}
                onClose={closeReminder}
                reminders={todaysReminder ? [todaysReminder] : []}
                title="Today's Goal"
            />
            <ReminderPopover
                visible={showBellPopover}
                onClose={closeBellPopover}
                reminders={todaysReminderForBell ? [todaysReminderForBell] : []}
                title="Today's Reminder"
            />
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
        fontSize: 24,
        fontWeight: '500',
        left: 15,
    },
    subgreeting: {
        fontSize: 20,
        fontWeight: '400',
        position: 'absolute',
        top: 30,
        left: 15,
        marginTop: 5,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    bellIcon: {
        position: 'relative',
        right: 15,
        top: 10,
    },
    dot: {
        position: 'absolute',
        top: 1,
        right: 12,
    },
    calendarCard: {
        backgroundColor: '#ffffff',
        color: '#C3B2AE',
        borderRadius: 12,
        padding: 10,
        marginBottom: 225,
        top: 40,
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
        color: '#ffffff',
        fontWeight: '700',
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
    workoutCount: {
        fontSize: 18,
        fontWeight: '600',
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
    completedButton: {
        backgroundColor: '#A79692',
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