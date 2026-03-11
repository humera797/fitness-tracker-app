import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';

export default function HomeScreen() {

    const username = "Humera";

    const [selectedDate, setSelectedData] = useState("");

    return (
        <SafeAreaView style={styles.container}>

            <Text style={styles.greeting}>Hey {username},</Text>
            
            <Text style={styles.subgreeting}>Lets workout</Text>

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
        top: 65,
        left: 30,
    },
    subgreeting: {
        fontSize: 18,
        fontWeight: '400',
        position: 'absolute',
        top: 100,
        left: 33,
    },
    calendarCard: {
        backgroundColor: '#ffffff',
        color: '#C3B2AE',
        borderRadius: 12,
        padding: 10,
        marginBottom: 250,
    },
    calendarTheme: {
        selectedDayBackgroundColor: "#A79692",
        selectedDayTextColor: "#ffffff",
        todayTextColor: "#A79692",
        arrowColor: "#C3B2AE",
        monthTextColor: "#000000",
    },
});