import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function UserDataScreen1({ navigation }) {

  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

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

  return (
    <View style={styles.container}>

      <View style={styles.formWrapper}></View>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Let's Get To Know You</Text>

      {renderDropdown(
        'Age',
        age,
        setAge,
        Array.from({ length: 43 }, (_, i) => (i + 18).toString()),
        'age'
      )}

      {renderDropdown(
        'Height (cm)',
        height,
        setHeight,
        Array.from({ length: 43 }, (_, i) => (i + 140).toString()),
        'height'
      )}

      {renderDropdown(
        'Weight (kg)',
        weight,
        setWeight,
        Array.from({ length: 141 }, (_, i) => (i + 30).toString()),
        'weight'
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UserData2', {
          age: age,
          height: height,
          weight: weight,
        })}
      >
        <Text style={styles.buttonText}>Next</Text>
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
    backgroundColor: '#E5E5E5',
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