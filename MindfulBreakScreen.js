import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

const MindfulBreakScreen = () => {
  useEffect(() => {
    let soundObject = new Audio.Sound();
    const playSound = async () => {
      try {
        await soundObject.loadAsync(require('../assets/deep-meditation-192828.mp3'));
        await soundObject.playAsync();
      } catch (error) {
        console.log(error);
      }
    };

    playSound();

    return () => {
      soundObject.unloadAsync();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>Close your eyes and take slow, long breaths...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  prompt: {
    fontSize: 24,
    textAlign: 'center',
    margin: 20,
    color: '#183e5e',
  },
});

export default MindfulBreakScreen;
