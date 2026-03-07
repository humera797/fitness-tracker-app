import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';

export default function SignupScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Welcome, lets get started</Text>

      <Text style={styles.label}>Full Name</Text>
      <AppInput placeholder="enter full name" />

      <Text style={styles.label}>Email</Text>
      <AppInput placeholder="enter email" />

      <Text style={styles.label}>Password</Text>
      <AppInput placeholder="create a password" secureTextEntry />

      <Text style={styles.label}>Confirm Password</Text>
      <AppInput placeholder="confirm your password" secureTextEntry />

      <AppButton title="Sign up" onPress={() => navigation.replace("UserData1")}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 30,
    justifyContent: 'center',
  },

  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 25,
  },

  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },

  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },

  backText: {
    fontSize: 16,
    fontWeight: '500',
  }
});