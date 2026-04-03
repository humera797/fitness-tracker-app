// Home Screen - Displays user's fitness data and allows them to log activities

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { LineChart } from 'react-native-gifted-charts';

export default function HomeScreen() {

    // TODO: Fetch user data from firebase and display it here later
    const username = "Humera";

    const [selectedDate, setSelectedData] = useState("");

    const [calories, setCalories] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [water, setWater] = useState(0);
    const [workouts, setWorkouts] = useState(0);


    const [weightData, setWeightData] = useState([
        { value: 71, label: 'Mon' },
        { value: 70, label: 'Tue' },
        { value: 69, label: 'Wed' },
        { value: 68, label: 'Thu' },
        { value: 68, label: 'Fri' },
        { value: 68, label: 'Sat' },
        { value: 68, label: 'Sun' },
    ]);


    return (
        <SafeAreaView style={styles.container}>

            <ScrollView>

                <Text style={styles.greeting}>Hey {username},</Text>

                <Text style={styles.subgreeting}>Let's workout</Text>

                <View style={styles.calendarCard}>

                    <Calendar
                        onDayPress={(day) => {
                            setSelectedData(day.dateString);
                        }}

                        markedDates={{
                            [selectedDate]: { selected: true, marked: true }
                        }}

                        theme={styles.calendarTheme}
                    />
                </View>

                <Text style={styles.sectionTitle}>Today's Activity</Text>

                <View style={styles.activityCard}>
                    <Text>Calories burned</Text>

                    <View style={styles.counter}>
                        <TouchableOpacity
                            onPress={() => setCalories(Math.max(0, calories - 5))}
                            style={styles.circle}
                        >
                            <Text>-</Text>
                        </TouchableOpacity>

                        <Text>{calories}</Text>

                        <TouchableOpacity
                            onPress={() => setCalories(calories + 5)}
                            style={styles.circle}
                        >
                            <Text>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.activityCard}>
                    <Text>Active minutes</Text>

                    <View style={styles.counter}>
                        <TouchableOpacity
                            onPress={() => setMinutes(Math.max(0, minutes - 5))}
                            style={styles.circle}
                        >
                            <Text>-</Text>
                        </TouchableOpacity>

                        <Text>{minutes}</Text>

                        <TouchableOpacity
                            onPress={() => setMinutes(minutes + 5)}
                            style={styles.circle}
                        >
                            <Text>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.activityCard}>
                    <Text>water intake</Text>

                    <View style={styles.counter}>
                        <TouchableOpacity
                            onPress={() => setWater(Math.max(0, water - 1))}
                            style={styles.circle}
                        >
                            <Text>-</Text>
                        </TouchableOpacity>

                        <Text>{water}</Text>

                        <TouchableOpacity
                            onPress={() => setWater(water + 1)}
                            style={styles.circle}
                        >
                            <Text>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.activityCard}>
                    <Text>workouts logged</Text>

                    <View style={styles.counter}>
                        <TouchableOpacity
                            onPress={() => setWorkouts(Math.max(0, workouts - 1))}
                            style={styles.circle}
                        >
                            <Text>-</Text>
                        </TouchableOpacity>

                        <Text>{workouts}</Text>

                        <TouchableOpacity
                            onPress={() => setWorkouts(workouts + 1)}
                            style={styles.circle}
                        >
                            <Text>+</Text>
                        </TouchableOpacity>
                    </View>
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
                    <Text style={styles.chartTitle}>Weekly Weight</Text>
                    <View style={styles.chartWrapper}>
                        <LineChart
                            data={weightData}
                            width={295}
                            height={200}
                            minValue={68}
                            maxValue={72}
                            stepValue={12}
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
});