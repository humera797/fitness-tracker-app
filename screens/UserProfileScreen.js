import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UserProfileScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Your Profile</Text>

            <View style={styles.userCard}>
                <View style={styles.picture} />
                <View>

                    <Text style={styles.name}>Humera Saeed</Text>
                    <Text style={styles.email}>humerasaeed419@gmail.com</Text>
                </View>
            </View>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Activity')}>
                    <Feather name="activity" size={28} color="black" />
                    <Text style={styles.buttonText}>Activity</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('History')}>
                    <Fontisto name="history" size={28} color="black" />
                    <Text style={styles.buttonText}>History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Favourites')}>
                    <MaterialIcons name="favorite-outline" size={24} color="black" />
                    <Text style={styles.buttonText}>Favourites</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.userprofileCard}>
                <Text style={styles.sectionTitle}>User Profile</Text>

                <Text style={styles.label}>Age</Text>
                <Text style={styles.info}>22 Years</Text>

                <Text style={styles.label}>Weight</Text>
                <Text style={styles.info}>59kg</Text>

                <Text style={styles.label}>Height</Text>
                <Text style={styles.info}>172cm</Text>

                <Text style={styles.label}>BMI</Text>
                <Text style={styles.info}>19.9</Text>

                <Text style={styles.label}>Target goal</Text>
                <Text style={styles.info}>Lose weight</Text>

                <Text style={styles.label}>Activity level</Text>
                <Text style={styles.info}>Medium</Text>
            </View>

            <TouchableOpacity style={styles.logoutButton}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C3B2AE',
        padding: 20,
        justifyContent: "center"
    },

    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EDE7E6',
        padding: 15,
        borderRadius: 15,
        marginBottom: 20,
        elevation: 3,
    },
    header: {
        fontSize: 24,
        fontWeight: '600',
        color: 'black',
        marginBottom: 15,
        bottom: 20,
        textAlign: 'center'
    },
    picture: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#BDBDBD',
        marginRight: 15,
    },

    name: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 3,
    },

    email: {
        fontSize: 15,
        color: '#555',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        gap: 15,
    },
    profileButton: {
        flex: 1,
        backgroundColor: '#EDE7E6',
        aspectRatio: 1,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonText: {
        fontSize: 12,
        fontWeight: '500',
        color: 'black',
        marginTop: 8,
    },
    userprofileCard: {
        backgroundColor: '#EDE7E6',
        padding: 15,
        borderRadius: 15,
        elevation: 2,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
        color: '#938582',
    },

    label: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 5,
    },

    info: {
        fontSize: 17,
        fontWeight: '500',
        color: '#987878',
        marginBottom: 5,
    },

    logoutButton: {
        backgroundColor: '#A79692',
        padding: 13,
        borderRadius: 10,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#322f2f',
        borderRadius: 10,
        alignItems: 'center',
        width: '60%',
        alignSelf: 'center'
    },

    logoutText: {
        fontSize: 16,
        fontWeight: '500',
        color: 'black'
    },
});