import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const exercises = [
  {
    name: 'Jumping Jacks',
    duration: '30 seconds',
    description: 'Stand with your feet together and arms at your sides. Jump your feet out to the sides while raising your arms above your head. Jump back to the starting position.',
  },
  {
    name: 'High Knees',
    duration: '30 seconds',
    description: 'Run in place, lifting your knees high towards your chest. Pump your arms as you run.',
  },
  {
    name: 'Arm Circles',
    duration: '30 seconds',
    description: 'Stand with your feet shoulder-width apart. Extend your arms out to the sides. Make small circles with your arms, gradually increasing the size of the circles.',
  },
];

const QuickExerciseScreen = () => {
  const [currentExercise, setCurrentExercise] = useState(0);

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Quick Exercise</Text>
        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseName}>{exercises[currentExercise].name}</Text>
          <Text style={styles.exerciseDuration}>{exercises[currentExercise].duration}</Text>
          <Text style={styles.exerciseDescription}>{exercises[currentExercise].description}</Text>
        </View>
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={[styles.navButton, currentExercise === 0 && styles.disabledButton]} 
            onPress={prevExercise}
            disabled={currentExercise === 0}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navButton, currentExercise === exercises.length - 1 && styles.disabledButton]} 
            onPress={nextExercise}
            disabled={currentExercise === exercises.length - 1}
          >
            <Text style={styles.navButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#183e5e',
    marginBottom: 20,
  },
  exerciseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderColor: '#4380b4',
    borderWidth: 1,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#183e5e',
    marginBottom: 10,
  },
  exerciseDuration: {
    fontSize: 16,
    color: '#4380b4',
    marginBottom: 10,
  },
  exerciseDescription: {
    fontSize: 16,
    color: '#183e5e',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    backgroundColor: '#4380b4',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  navButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});

export default QuickExerciseScreen;
