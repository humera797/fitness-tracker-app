import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function UserDataScreen2({ navigation, route }) {
  const { name, age, height, weight } = route.params;

  const [activitylevel, setActivityLevel] = useState('');
  const [targetgoal, setTargetGoal] = useState('');
  const [targetarea, setTargetArea] = useState('');

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
          {value || `Select`}
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
  const convertHeightToCm = (heightString) => {

    const feet = parseInt(heightString.split("'")[0]);
    const inches = parseInt(heightString.split("'")[1].replace('"', ''));
    const totalCm = (feet * 30.48) + (inches * 2.54);
    return totalCm;
  };
  const calculateBMI = (weight, height) => {
    const heightInCm = convertHeightToCm(height);
    const heightInMeters = heightInCm / 100;
    if (heightInMeters === 0) return 0;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getWorkoutPlan = (goal, bmi) => {
    if (goal === "Lose Weight" && bmi >= 25) return "Fat Loss Workout";
    if (goal === "Gain Muscle") return "Strength Training Plan";
    if (goal === "Maintain Weight") return "Balanced Fitness Plan";
    return "General Fitness Plan";
  };

  const saveUserData = async () => {
    console.log("Button pressed");

    const user = auth.currentUser;
    console.log("Current User:", user);

    if (!user) {
      console.error("No user logged in.");
      return;
    }

    const bmi = calculateBMI(Number(weight), height);
    const recommendedPlan = getWorkoutPlan(targetgoal, bmi);

    await setDoc(doc(db, "users", user.uid), {
      fullName: name,
      age,
      height,
      weight,
      activitylevel,
      targetgoal,
      targetarea,
      bmi,
      recommendedPlan
    });

    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Let's Get To Know You</Text>

      {renderDropdown(
        'Activity Level',
        activitylevel,
        setActivityLevel,
        ['Sedentary (Not Very Active)', 'Lightly Active', 'Moderately Active', 'Very Active'],
        'activityLevel'
      )}

      {renderDropdown(
        'Target Goal',
        targetgoal,
        setTargetGoal,
        ['Lose Weight', 'Maintain Weight', 'Gain Muscle'],
        'targetGoal'
      )}

      {renderDropdown(
        'Target Area',
        targetarea,
        setTargetArea,
        ['Full Body', 'Abs & core', 'Arms & back', 'Legs', 'Glutes'],
        'targetArea'
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={saveUserData}
      >
        <Text style={styles.buttonText}>All Set!</Text>
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
    marginBottom: 30,
    color: 'black',
    left: 50,
  },

  dropdowncontainer: {
    marginBottom: 23,
  },

  label: {
    color: 'white',
    fontSize: 18,
    marginBottom: 8,
  },
  dropdownHeader: {
    backgroundColor: '#A79692',
    padding: 15,
    borderRadius: 12,
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