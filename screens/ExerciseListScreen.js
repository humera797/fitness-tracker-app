import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { exercisesData } from '../data/exercises';

export default function ExerciseListScreen({ route, navigation }) {
  const { area } = route.params;


  const data = exercisesData[area] || [];

  const handleExercisePress = (exercise) => {
    console.log('Exercise Data:', exercise);
    navigation.navigate('DetailScreen', {
      exercise: exercise,
      area: area
    });
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>{area}</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleExercisePress(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C3B2AE',
    padding: 20,
  },
  header: {
    fontSize: 23,
    fontWeight: '700',
    color: '#554440',
    alignSelf: 'center',
    marginBottom: 100,
    top: 70
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#a49592',
  },
  arrow: {
    fontSize: 18,
    color: '#A79692',
    fontWeight: '600',
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