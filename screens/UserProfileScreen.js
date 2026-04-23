import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                setUserEmail(user.email);
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
            }
        } catch (error) {
            console.log('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await AsyncStorage.removeItem('userLoggedIn');
                        await AsyncStorage.removeItem('userEmail');
                        await AsyncStorage.removeItem('userUID');
                        await AsyncStorage.removeItem('lastLoginTime');

                        console.log('AsyncStorage cleared');

                        await auth.signOut();

                        console.log('User signed out');

                        navigation.replace('Welcome');

                    } catch (error) {
                        console.log('Logout error:', error);
                        Alert.alert('Error', 'Could not logout. Please try again.');
                    }
                }
            }
        ]);
    };
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>Your Profile</Text>

            <View style={styles.userCard}>
                <View style={styles.image}>
                    <FontAwesome name="user-circle" size={60} color="#a48b85" />
                </View>
                <View>
                    <Text style={styles.name}>{userData?.fullName || userData?.name }</Text>
                    <Text style={styles.email}>{userEmail}</Text>
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
                    <Entypo name="heart-outlined" size={30} color="black" />
                    <Text style={styles.buttonText}>Favourites</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.userprofileCard}>
                <Text style={styles.sectionTitle}>User Profile</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Age</Text>
                    <Text style={styles.info}>{userData?.age || '—'} Years</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Weight</Text>
                    <Text style={styles.info}>{userData?.weight || '—'} kg</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Height</Text>
                    <Text style={styles.info}>{userData?.height || '—'}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>BMI</Text>
                    <Text style={styles.info}>{userData?.bmi || '—'}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Target goal</Text>
                    <Text style={styles.info}>{userData?.targetgoal || '—'}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.label}>Activity level</Text>
                    <Text style={styles.info}>{userData?.activitylevel || '—'}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
        marginBottom: 2,
        bottom: 15,
        textAlign: 'center'
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#BDBDBD',
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
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
        fontSize: 19,
        fontWeight: '600',
        marginTop: 5,
    },

    info: {
        fontSize: 17,
        fontWeight: '500',
        color: '#987878',
        marginBottom: 5,
        top: 5,
    },

    logoutButton: {
        backgroundColor: '#A79692',
        padding: 12,
        borderRadius: 10,
        marginTop: 15,
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