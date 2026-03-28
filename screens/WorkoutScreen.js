import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';

export default function WorkoutScreen({ navigation }) {

    const recommended = [

        {
            id: '1',
            name: '35 min full body HIT',
            duration: '35 min',
            difficulty: 'High',
            calories: '40',
            exercises: [
                { name: 'Burpees' },
                { name: 'Jumping Jacks' },
                { name: 'Chest Flys' },
                { name: 'Plank' },
            ]
        },
        {
            id: '2',
            name: '40 min beginner friendly',
            duration: '40 min',
            difficulty: 'Medium',
            calories: '30',
            exercises: [
                { name: 'Front Raises' },
                { name: 'Donkey Kicks' },
                { name: 'Plank' },
                { name: 'Alternating Leg Raises' },
            ]
        },
        {
            id: '3',
            name: '50 minutes full body HIT',
            duration: '50 min',
            difficulty: 'High',
            calories: '40',
            exercises: [
                { name: 'Single Dumbbell Row' },
                { name: 'Incline Chest Press' },
                { name: 'Bicycle Crunches' },
                { name: 'Donkey Kicks' },
            ]
        }
    ];

    const targetAreas = [
        { id: '1', name: 'FULLBODY' },
        { id: '2', name: 'ABS' },
        { id: '3', name: 'LEGS' },
        { id: '4', name: 'BACK' },
        { id: '5', name: 'ARMS' },
        { id: '6', name: 'SHOULDERS' },
        { id: '7', name: 'CHEST' },
        { id: '8', name: 'GLUTES' },
    ];

    const [search, setSearch] = useState("");

    const renderTargetArea = ({ item }) => (
        <TouchableOpacity
            style={styles.targetAreaCard}
            onPress={() => navigation.navigate('ExerciseList', {
                area: item.name
            })}
        >
            <Text style={styles.targetAreaText}>{item.name}</Text>
        </TouchableOpacity>
    );
    const renderRecommended = ({ item }) => (
        <TouchableOpacity
            style={styles.sliderCard}
            onPress={() => navigation.navigate('ExerciseList', {
                area: item.name,
                workoutPlan: item
            })}
            activeOpacity={0.7}
        >
            <Text style={styles.sliderText}>{item.name}</Text>
            <Text style={styles.sliderSubText}>{item.duration} - {item.calories} calories</Text>
        </TouchableOpacity>
    );

    const filteredtargetAreas = targetAreas.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );
    const filteredRecommended = recommended.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.searchBar}>
                <TextInput
                    placeholder="search exercises..."
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                    style={styles.searchInput}
                />
                <View style={{ flexDirection: 'row' }}>
                    <Feather name="search" size={20} color="black" />

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Filter")}
                        style={{ marginLeft: 10 }}
                    >
                        <Feather name="filter" size={20} color="black" />
                    </TouchableOpacity>

                </View>
            </View>

            <Text style={styles.sectionTitle}>Recommended for you</Text>

            <FlatList
                data={filteredRecommended}
                renderItem={renderRecommended}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
            />

            <Text style={styles.sectionTitle}>Target Area</Text>

            <FlatList
                data={filteredtargetAreas}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                renderItem={renderTargetArea}
                keyExtractor={(item) => item.id}
            />
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C3B2AE',
        padding: 20,
    },

    searchBar: {
        flexDirection: 'row',
        backgroundColor: '#f0eded',
        borderRadius: 25,
        paddingHorizontal: 10,
        alignItems: 'center',
        marginBottom: 30,
    },

    searchInput: {
        flex: 1,
        height: 50,
        fontSize: 16,
        paddingHorizontal: 15,
    },

    filterIcon: {
        fontSize: 20,
        color: '#555',
        alignItems: 'center',
        padding: 5,
    },

    sectionTitle: {
        fontSize: 20,
        marginBottom: 9,
        fontWeight: '500',
        top: 7,
    },

    sliderCard: {
        width: 340,
        height: 160,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderColor: '#A79692',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 11,
        top: 15,
    },

    sliderText: {
        fontSize: 20,
        fontWeight: '500',
        marginBottom: 10
    },
    sliderSubText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#9f8f8b'
    },

    targetAreaCard: {
        width: 165,
        height: 88,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderColor: '#A79692',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        top: 9,
    },

    targetAreaText: {
        fontSize: 17,
        fontWeight: '500',
    }
});