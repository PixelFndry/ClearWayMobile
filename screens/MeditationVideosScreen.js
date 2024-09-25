import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const meditationVideos = [
  { id: '1', title: 'Introduction to Meditation', url: 'https://www.youtube.com/watch?v=M0oxtg56mzs' },
  { id: '2', title: 'Breathing Techniques', url: 'https://www.youtube.com/watch?v=NGHmWIEGSoM' },
  { id: '3', title: 'Body Scan Meditation', url: 'https://www.youtube.com/watch?v=ic31bfDFPv0' },
  // Add more videos as needed
];

const MeditationVideosScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.videoItem}
      onPress={() => {
        if (item.url) {
          navigation.navigate('VideoPlayer', { videoUrl: item.url });
        } else {
          console.log(`Play video: ${item.title}`);
        }
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
