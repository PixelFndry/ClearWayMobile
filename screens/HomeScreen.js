import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ navigation }) => {
  const [checkInCompleted, setCheckInCompleted] = useState(false);
  const [lastCheckInDate, setLastCheckInDate] = useState(null);
  const [daysClear, setDaysClear] = useState(0);
  const [goalDays, setGoalDays] = useState(null);
  const [goalSet, setGoalSet] = useState(false);
  const [goalMet, setGoalMet] = useState(false);
  const [drinkAmount, setDrinkAmount] = useState('');
  const [feeling, setFeeling] = useState(null);
  const [checkInStage, setCheckInStage] = useState('initial'); // 'initial', 'amount', 'feeling', 'completed'
  const [drankYesterday, setDrankYesterday] = useState(null);
  const [isSpotifyModalVisible, setIsSpotifyModalVisible] = useState(false);
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false);

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

  const handleCheckInResponse = (response) => {
    setDrankYesterday(response === 'yes');
    setCheckInStage('feeling');
  };

  const handleDrinkAmount = () => {
    if (drinkAmount !== '') {
      setCheckInStage('feeling');
    }
  };

  const handleFeeling = async (feelingValue) => {
    setFeeling(feelingValue);
    if (drankYesterday) {
      setDaysClear(0);
      try {
        await AsyncStorage.setItem('daysClear', '0');
      } catch (error) {
        console.error('Error resetting days clear:', error);
      }
    } else {
      let newDaysClear = daysClear + 1;
      setDaysClear(newDaysClear);
      try {
        await AsyncStorage.setItem('daysClear', newDaysClear.toString());
      } catch (error) {
        console.error('Error saving days clear:', error);
      }
    }
    setCheckInStage('completed');
    await saveJournalEntry();
  };

  const renderFeelingOptions = () => {
    const options = [
      { emoji: '😫', text: 'Awful' },
      { emoji: '😕', text: 'Not Great' },
      { emoji: '😐', text: 'Okay' },
      { emoji: '🙂', text: 'Good' },
      { emoji: '😄', text: 'Fantastic' },
    ];

    return options.map((option, index) => (
      <TouchableOpacity
        key={index}
        style={styles.feelingButton}
        onPress={() => handleFeeling(option.text)}
      >
        <Text style={styles.feelingEmoji}>{option.emoji}</Text>
        <Text style={styles.feelingText}>{option.text}</Text>
      </TouchableOpacity>
    ));
  };

  const saveJournalEntry = async () => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      date: today,
      drank: drankYesterday,
      amount: drankYesterday ? parseInt(drinkAmount, 10) : 0,
      feeling: feeling,
    };

    try {
      const existingEntries = await AsyncStorage.getItem('journalEntries');
      let entries = existingEntries ? JSON.parse(existingEntries) : [];
      entries.unshift(newEntry);
      await AsyncStorage.setItem('journalEntries', JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  const SpotifyPlayer = ({ playlistId }) => {
    const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`;
    
    return (
      <WebView
        source={{ uri: embedUrl }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowsFullscreenVideo={true}
        mediaPlaybackRequiresUserAction={false}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn(
            'WebView received error status code: ',
            nativeEvent.statusCode
          );
        }}
      />
    );
  };

  const openGrandMountainAdventure = async () => {
    // Deep link URL for Grand Mountain Adventure (this is hypothetical and needs to be confirmed with the game developers)
    const deepLink = 'grandmountainadventure://';
    
    // App Store URL for iOS
    const appStoreUrl = 'https://apps.apple.com/us/app/grand-mountain-adventure/id1479711540';
    
    // Google Play Store URL for Android
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.toppluva.grandmountain';

    // Check if the app is installed
    const supported = await Linking.canOpenURL(deepLink);

    if (supported) {
      // Open the app
      await Linking.openURL(deepLink);
    } else {
      // If the app is not installed, open the appropriate store
      if (Platform.OS === 'ios') {
        Linking.openURL(appStoreUrl);
      } else {
        Linking.openURL(playStoreUrl);
      }
    }
  };

  const handleActivityPress = (activity) => {
    console.log('Activity pressed:', activity);
    if (activity === 'Listen to Music') {
      console.log('Setting Spotify modal visible');
      setIsSpotifyModalVisible(true);
    } else if (activity === 'Play a Game') {
      openGrandMountainAdventure();
    } else if (activity === 'Quick Chat') {
      navigation.navigate('AIChat');
    } else if (activity === 'View Inspiration') {
      navigation.navigate('Inspiration');
    } else if (activity === 'Quick Exercise') {
      navigation.navigate('QuickExercise');
    } else if (activity === 'Mindful Break') {
      navigation.navigate('MindfulBreak');
    }
    // Handle other activities here
  };

  const handleLiveSupportPress = () => {
    setIsSupportModalVisible(true);
  };

  const handleSupportOption = (option) => {
    setIsSupportModalVisible(false);
    if (option === 'text') {
      // Placeholder for text chat functionality
      alert('Text chat selected. Implement your chat service here.');
    } else if (option === 'phone') {
      // Replace with the phone number for live support
      const phoneNumber = 'tel:+1234567890';
      Linking.openURL(phoneNumber);
    }
  };

  const handleMeditationPress = () => {
    navigation.navigate('MeditationVideos');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.dailyCheckIn}>
          <Text style={styles.dailyCheckInTitle}>
            <Ionicons name="calendar-outline" size={24} color="#eee939" /> Daily Check-in
          </Text>
          {checkInStage === 'initial' && (
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
          )}
          {checkInStage === 'amount' && (
            <>
              <Text style={styles.checkInQuestion}>How many drinks did you have?</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={drinkAmount}
                onChangeText={setDrinkAmount}
                placeholder="Enter number of drinks"
              />
              <TouchableOpacity 
                style={[styles.responseButton, styles.amountButton]} 
                onPress={handleDrinkAmount}
              >
                <Text style={styles.responseButtonText}>Next</Text>
              </TouchableOpacity>
            </>
          )}
          {checkInStage === 'feeling' && (
            <>
              <Text style={styles.checkInQuestion}>How are you feeling today?</Text>
              <View style={styles.feelingButtons}>
                {renderFeelingOptions()}
              </View>
            </>
          )}
          {checkInStage === 'completed' && (
            <Text style={styles.completedText}>Great job completing your daily check-in!</Text>
          )}
        </View>

        <View style={styles.urgeSection}>
          <Text style={styles.urgeSectionTitle}>Feeling an Urge?</Text>
          <Text style={styles.urgeSectionSubtitle}>Try one of these activities to help you through it:</Text>
          
          <TouchableOpacity 
            style={styles.liveSupportButton}
            onPress={handleLiveSupportPress}
          >
            <Text style={styles.liveSupportButtonText}>Speak to Live Support</Text>
          </TouchableOpacity>
          
          <View style={styles.activitiesGrid}>
            {['Play a Game', 'Listen to Music', 'View Inspiration', 'Quick Exercise', 'Mindful Break', 'Quick Chat'].map((activity, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.activityButton}
                onPress={() => handleActivityPress(activity)}
              >
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
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Journal')}>
            <Text style={styles.buttonText}>View Journal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.meditationSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="headset-outline" size={24} color="#4380b4" />
          </View>
          <Text style={styles.sectionTitle}>Meditation</Text>
          <Text style={styles.sectionText}>Guided meditations for peace and clarity on your ClearWay path.</Text>
          <TouchableOpacity style={styles.button} onPress={handleMeditationPress}>
            <Text style={styles.buttonText}>Start Meditating</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={isSpotifyModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsSpotifyModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setIsSpotifyModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Spotify Player</Text>
            <SpotifyPlayer playlistId="4fB0xwpz8qKQpmaKVr6NJk" />
          </View>
        </View>
      </Modal>

      <Modal
        visible={isSupportModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsSupportModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setIsSupportModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Choose Support Option</Text>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => handleSupportOption('text')}
            >
              <Text style={styles.modalButtonText}>Text Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => handleSupportOption('phone')}
            >
              <Text style={styles.modalButtonText}>Phone Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const getIconName = (activity) => {
  // Map activity names to appropriate Ionicons names
  const iconMap = {
    'Play a Game': 'game-controller-outline',
    'Listen to Music': 'musical-notes-outline',
    'View Inspiration': 'videocam-outline',
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
  amountButton: {
    backgroundColor: '#4380b4',
    marginVertical: 5,
  },
  feelingButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  feelingButton: {
    alignItems: 'center',
    margin: 10,
  },
  feelingEmoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  feelingText: {
    color: '#183e5e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#4380b4',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    height: '80%',
    alignItems: 'center',
    position: 'relative',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#4380b4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  liveSupportButton: {
    backgroundColor: '#4380b4',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  liveSupportButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
