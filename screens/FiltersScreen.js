import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';


export default function FiltersScreen({ navigation }) {


    const [equipment, setEquipment] = useState('');
    const [difficulty, setDifficulty] = useState('');
    const [duration, setDuration] = useState('');


    const [activeDropdown, setActiveDropdown] = useState(null);
    const renderDropdown = (label, value, setValue, options, type) => (

        <View style={styles.dropdowncontainer}>

            <Text style={styles.label}>{label}</Text>

            <TouchableOpacity
                style={styles.dropdownHeader}
                onPress={() =>
                    setActiveDropdown(activeDropdown === type ? null : type)
                }
                activeOpacity={0.8}
            >
                <Text style={styles.headerText}>
                    {value || 'Select'}
                </Text>

                <Text style={styles.arrow}>
                    {activeDropdown === type ? '▲' : '▼'}
                </Text>
            </TouchableOpacity>


            {activeDropdown === type && (
                <View style={styles.dropdownBody}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {options.map((item) => (
                            <TouchableOpacity
                                key={item}
                                style={[
                                    styles.item,
                                    value === item && styles.selectedItem
                                ]}
                                onPress={() => {
                                    setValue(item);
                                    setActiveDropdown(null);
                                }}
                            >
                                <Text style={styles.itemText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>

            <View style={styles.formWrapper}></View>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>


            <Text style={styles.header}>Filter Workouts</Text>
            <Text style={styles.subheader}>Select your workout options</Text>


            {renderDropdown(
                'Equipment',
                equipment,
                setEquipment,
                ['No Equipment', 'Dumbbells', 'Kettlebells', 'Mat'],
                'equipment'
            )}

            {renderDropdown(
                'Difficulty',
                difficulty,
                setDifficulty,
                ['High', 'Medium', 'Low'],
                'difficulty'
            )}

            {renderDropdown(
                'Duration',
                duration,
                setDuration,
                ['5 minutes', '10 minutes', '15 minutes', '20 minutes'],
                'duration'
            )}

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ExerciseList', {
                    filters: {
                        equipment: equipment,
                        difficulty: difficulty,
                        duration: duration
                    }
                })}
            >
                <Text style={styles.buttonText}>Apply filters</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C3B2AE',
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        fontSize: 25,
        fontWeight: '600',
        marginBottom: 5,
        color: 'black',
        left: 92,
        bottom: 20,
    },
    subheader: {
        fontSize: 20,
        fontWeight: '300',
        color: 'black',
        marginBottom: 5,
        left: 55,
        bottom: 10,
    },
    dropdowncontainer: {
        marginBottom: 23,
    },

    label: {
        color: '#Black',
        fontSize: 18,
        marginBottom: 8,
    },
    dropdownHeader: {
        backgroundColor: '#F0F0F0',
        padding: 15,
        borderRadius: 12,
        borderColor: '#4f4c4c',
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerText: {
        fontSize: 16,
        color: '#555',
    },
    arrow: {
        fontSize: 16,
        color: '#555',
    },
    dropdownBody: {
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        marginTop: 5,
        padding: 10,
        maxHeight: 200,
    },

    item: {
        padding: 12,
        borderRadius: 8,
    },

    selectedItem: {
        backgroundColor: '#A79692',
    },

    itemText: {
        fontSize: 16,
    },
    formWrapper: {
        width: '85%',
    },
    button: {
        backgroundColor: '#98837e',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        width: 270,
        left: 35,
        marginTop: 5,
    },
    buttonText: {
        fontWeight: '600',
        fontSize: 16,
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