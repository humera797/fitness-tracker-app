import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';

export default function ReminderPopover({ visible, onClose, reminders, title }) {
    console.log('ReminderPopover - visible:', visible);
    console.log('ReminderPopover - reminders count:', reminders?.length);

    if (!reminders || reminders.length === 0) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <View style={styles.popup}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title || 'Reminders'}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Text style={styles.close}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={reminders}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.reminderItem}>
                                <Text style={styles.reminderTitle}>{item.title}</Text>
                                <Text style={styles.reminderMessage}>{item.message}</Text>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    popup: {
        backgroundColor: '#A79692',
        borderRadius: 20,
        padding: 23,
        width: '85%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 13,
        paddingBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#C3B2AE',
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        fontStyle: 'italic',
        color: '#554440',
    },
    close: {
        fontSize: 22,
        color: '#C3B2AE',
    },
    reminderItem: {
        paddingVertical: 6,
        borderBottomWidth: 2,
        borderBottomColor: '#C3B2AE',
        alignItems: 'center'
    },
    reminderTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#554440',
        marginBottom: 4,
        alignSelf: 'center',
        bottom: 7,
        right: 6
    },
    reminderMessage: {
        fontSize: 16,
        fontWeight: '400',
        fontStyle: 'italic',
        color: '#ffffff',
        alignSelf: 'center'
    },
});