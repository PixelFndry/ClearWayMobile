import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const meditationVideos = [
  { id: '1', title: 'Introduction to Meditation' },
  { id: '2', title: 'Breathing Techniques' },
  { id: '3', title: 'Body Scan Meditation' },
  // Add more videos as needed
];

const MeditationVideosScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.videoItem}
      onPress={() => {
        // Navigate to video player or start playing video
        console.log(`Play video: ${item.title}`);
      }}
    >
      <Text style={styles.videoTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Guided Meditation Videos</Text>
      <FlatList
        data={meditationVideos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#183e5e',
  },
  videoItem: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    borderColor: '#4380b4',
    borderWidth: 1,
  },
  videoTitle: {
    fontSize: 18,
    color: '#183e5e',
  },
});

export default MeditationVideosScreen;