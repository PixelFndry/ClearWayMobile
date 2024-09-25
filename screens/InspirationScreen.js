import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

const InspirationScreen = () => {
  const [quote, setQuote] = useState('');
  const [videoId, setVideoId] = useState('JuU5_mlPy50');

  useEffect(() => {
    // Fetch a random quote here
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    // This is a placeholder. You should implement actual API call here.
    setQuote("Believe you can and you're halfway there. - Theodore Roosevelt");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.quoteText}>{quote}</Text>
      <WebView
        style={styles.video}
        javaScriptEnabled={true}
        source={{
          uri: `https://www.youtube.com/embed/${videoId}`,
        }}
      />
      <TouchableOpacity style={styles.button} onPress={fetchQuote}>
        <Text style={styles.buttonText}>Next Quote</Text>
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
