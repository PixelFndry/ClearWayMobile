import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import AIChatScreen from './screens/AIChatScreen';
import ProfileScreen from './screens/ProfileScreen';
import JournalScreen from './screens/JournalScreen';
import { useFonts, Roboto_100Thin } from '@expo-google-fonts/roboto';
import MeditationVideosScreen from './screens/MeditationVideosScreen';
import InspirationScreen from './screens/InspirationScreen';
import QuickExerciseScreen from './screens/QuickExerciseScreen';
import VideoPlayerScreen from './screens/VideoPlayerScreen';
import MindfulBreakScreen from './screens/MindfulBreakScreen';

const Stack = createStackNavigator();

export default function App() {
  let [fontsLoaded] = useFonts({
    Roboto_100Thin,
  });

  if (!fontsLoaded) {
    return null; // or a loading component
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AIChat" component={AIChatScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Journal" component={JournalScreen} />
        <Stack.Screen name="MeditationVideos" component={MeditationVideosScreen} />
        <Stack.Screen name="Inspiration" component={InspirationScreen} />
        <Stack.Screen name="QuickExercise" component={QuickExerciseScreen} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
        <Stack.Screen name="MindfulBreak" component={MindfulBreakScreen} />
        {/* Add other screens as needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
