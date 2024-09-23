import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Video } from 'expo-av';

const InspirationScreen = () => {
  const [quote, setQuote] = useState('');
  const [videoUri, setVideoUri] = useState('');

  useEffect(() => {
    // Fetch a random quote and video URI here
    fetchQuoteAndVideo();
  }, []);

  const fetchQuoteAndVideo = async () => {
    // This is a placeholder. You should implement actual API calls here.
    setQuote("Believe you can and you're halfway there. - Theodore Roosevelt");
    setVideoUri("https://example.com/inspirational-video.mp4");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.quoteText}>{quote}</Text>
      <Video
        source={{ uri: videoUri }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay
        isLooping
        style={styles.video}
      />
      <TouchableOpacity style={styles.button} onPress={fetchQuoteAndVideo}>
        <Text style={styles.buttonText}>Next Inspiration</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  quoteText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#183e5e',
  },
  video: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4380b4',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default InspirationScreen;
