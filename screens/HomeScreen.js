import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.dailyCheckIn}>
          <Text style={styles.dailyCheckInTitle}>
            <Ionicons name="arrow-up-outline" size={24} color="#eee939" /> Daily Check-in
          </Text>
          <Text style={styles.congrats}>Congrats!</Text>
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
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
          <Text style={styles.progressText}>You're doing great on your ClearWay journey! Keep it up!</Text>
          <View style={styles.daysContainer}>
            <Ionicons name="trophy" size={24} color="#eee939" />
            <Text style={styles.daysText}>1 Days Clear</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
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
    marginBottom: 10,
    color: '#183e5e',
  },
  congrats: {
    fontSize: 16,
    marginBottom: 10,
    color: '#183e5e',
  },
  nextButton: {
    backgroundColor: '#4380b4',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
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
});

export default HomeScreen;
