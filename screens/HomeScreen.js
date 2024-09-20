import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [checkInCompleted, setCheckInCompleted] = useState(false);
  const [lastCheckInDate, setLastCheckInDate] = useState(null);
  const [daysClear, setDaysClear] = useState(0);
  const [goalDays, setGoalDays] = useState(null);
  const [goalSet, setGoalSet] = useState(false);
  const [goalMet, setGoalMet] = useState(false);

  useEffect(() => {
    // Check if a new day has started since the last check-in
    const today = new Date().toDateString();
    if (lastCheckInDate !== today) {
      setCheckInCompleted(false);
      setLastCheckInDate(today);
    }
    loadGoalAndProgress();
  }, []);

  useEffect(() => {
    if (daysClear >= goalDays && goalSet) {
      setGoalMet(true);
    }
  }, [daysClear, goalDays, goalSet]);

  const loadGoalAndProgress = async () => {
    try {
      const storedGoal = await AsyncStorage.getItem('goalDays');
      const storedDays = await AsyncStorage.getItem('daysClear');
      
      if (storedGoal !== null) {
        setGoalDays(parseInt(storedGoal, 10));
        setGoalSet(true);
      }
      
      if (storedDays !== null) {
        setDaysClear(parseInt(storedDays, 10));
      }
    } catch (error) {
      console.error('Error loading goal and progress:', error);
    }
  };

  const handleSetGoal = async () => {
    if (goalDays > 0) {
      try {
        await AsyncStorage.setItem('goalDays', goalDays.toString());
        setGoalSet(true);
        setGoalMet(false);
      } catch (error) {
        console.error('Error saving goal:', error);
      }
    }
  };

  const handleCheckInResponse = async (response) => {
    let newDaysClear = response === 'no' ? daysClear + 1 : 0;
    setDaysClear(newDaysClear);
    try {
      await AsyncStorage.setItem('daysClear', newDaysClear.toString());
    } catch (error) {
      console.error('Error saving days clear:', error);
    }
    setCheckInCompleted(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.dailyCheckIn}>
          <Text style={styles.dailyCheckInTitle}>
            <Ionicons name="calendar-outline" size={24} color="#eee939" /> Daily Check-in
          </Text>
          {!checkInCompleted ? (
            <>
              <Text style={styles.checkInQuestion}>Did you drink yesterday?</Text>
              <View style={styles.responseButtons}>
                <TouchableOpacity 
                  style={[styles.responseButton, styles.yesButton]} 
                  onPress={() => handleCheckInResponse('yes')}
                >
                  <Text style={styles.responseButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.responseButton, styles.noButton]} 
                  onPress={() => handleCheckInResponse('no')}
                >
                  <Text style={styles.responseButtonText}>No</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.completedText}>Great job completing your daily check-in!</Text>
          )}
        </View>

        <View style={styles.urgeSection}>
          <Text style={styles.urgeSectionTitle}>Feeling an Urge?</Text>
          <Text style={styles.urgeSectionSubtitle}>Try one of these activities to help you through it:</Text>
          
          <View style={styles.activitiesGrid}>
            {['Play a Game', 'Listen to Music', 'Watch Inspiration', 'Quick Exercise', 'Mindful Break', 'Quick Chat'].map((activity, index) => (
              <TouchableOpacity key={index} style={styles.activityButton}>
                <Ionicons name={getIconName(activity)} size={24} color="#4380b4" />
                <Text style={styles.activityButtonText}>{activity}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          {!goalSet || goalMet ? (
            <View>
              <Text style={styles.goalQuestion}>
                {goalMet ? "Congratulations! Set a new goal:" : "What is Your First Progress Goal?"}
              </Text>
              <TextInput
                style={styles.goalInput}
                keyboardType="numeric"
                placeholder="Enter number of days"
                value={goalDays ? goalDays.toString() : ''}
                onChangeText={(text) => setGoalDays(parseInt(text) || 0)}
              />
              <TouchableOpacity style={styles.button} onPress={handleSetGoal}>
                <Text style={styles.buttonText}>Set Goal</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.progressText}>You're doing great on your ClearWay journey! Keep it up!</Text>
              <View style={styles.daysContainer}>
                <Ionicons name="trophy" size={24} color="#eee939" />
                <Text style={styles.daysText}>{daysClear} / {goalDays} Days Clear</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.min((daysClear / goalDays) * 100, 100)}%` }]} />
              </View>
            </>
          )}
        </View>

        <View style={styles.journalSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="book-outline" size={24} color="#4380b4" />
          </View>
          <Text style={styles.sectionTitle}>Journal</Text>
          <Text style={styles.sectionText}>Record your thoughts and feelings on your ClearWay journey.</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Open Journal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.meditationSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="headset-outline" size={24} color="#4380b4" />
          </View>
          <Text style={styles.sectionTitle}>Meditation</Text>
          <Text style={styles.sectionText}>Guided meditations for peace and clarity on your ClearWay path.</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Start Meditating</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const getIconName = (activity) => {
  // Map activity names to appropriate Ionicons names
  const iconMap = {
    'Play a Game': 'game-controller-outline',
    'Listen to Music': 'musical-notes-outline',
    'Watch Inspiration': 'videocam-outline',
    'Quick Exercise': 'barbell-outline',
    'Mindful Break': 'cafe-outline',
    'Quick Chat': 'chatbubble-outline',
  };
  return iconMap[activity] || 'help-outline';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  dailyCheckIn: {
    backgroundColor: '#ffffff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    borderColor: '#4380b4',
    borderWidth: 1,
  },
  dailyCheckInTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#183e5e',
  },
  checkInQuestion: {
    fontSize: 18,
    marginBottom: 15,
    color: '#183e5e',
  },
  responseButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  responseButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  yesButton: {
    backgroundColor: '#4380b4',
  },
  noButton: {
    backgroundColor: '#eee939',
  },
  responseButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  completedText: {
    fontSize: 16,
    color: '#183e5e',
    textAlign: 'center',
  },
  urgeSection: {
    margin: 10,
  },
  urgeSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#183e5e',
  },
  urgeSectionSubtitle: {
    fontSize: 16,
    marginBottom: 15,
    color: '#183e5e',
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityButton: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderColor: '#4380b4',
    borderWidth: 1,
  },
  activityButtonText: {
    marginTop: 5,
    textAlign: 'center',
    color: '#183e5e',
  },
  progressSection: {
    backgroundColor: '#ffffff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    borderColor: '#4380b4',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#183e5e',
  },
  progressText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#183e5e',
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  daysText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#183e5e',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  progressFill: {
    width: '10%', // Adjust based on actual progress
    height: '100%',
    backgroundColor: '#eee939',
    borderRadius: 5,
  },
  journalSection: {
    backgroundColor: '#ffffff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    borderColor: '#4380b4',
    borderWidth: 1,
  },
  meditationSection: {
    backgroundColor: '#ffffff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    borderColor: '#4380b4',
    borderWidth: 1,
  },
  iconContainer: {
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#183e5e',
  },
  button: {
    backgroundColor: '#4380b4',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  goalQuestion: {
    fontSize: 18,
    marginBottom: 10,
    color: '#183e5e',
  },
  goalInput: {
    borderWidth: 1,
    borderColor: '#4380b4',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default HomeScreen;
