import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';

export default function WorkoutScreen({ navigation }) {

    const recommended = [
        { id: '1', title: '15 min full body HIT' },
        { id: '2', title: '20 min beginner friendly' },
        { id: '3', title: '30 minutes full body HIT' },
    ];

    const targetAreas = [
        { id: '1', name: 'FULL BODY' },
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
        <View style={styles.targetAreaCard}>
            <Text style={styles.targetAreaText}>{item.name}</Text>
        </View>
    );
    const renderRecommended = ({ item }) => (
        <View style={styles.sliderCard}>
            <Text style={styles.sliderText}>{item.title}</Text>
        </View>
    );

    const filteredtargetAreas = targetAreas.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );
    const filteredRecommended = recommended.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
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
        top: 20,
    },

    sliderText: {
        fontSize: 16,
        fontWeight: '500',
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
        marginBottom: 15,
        top: 9,
    },

    targetAreaText: {
        fontSize: 17,
        fontWeight: '500',
    }

});