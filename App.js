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
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AIChat" component={AIChatScreen} options={{ title: 'AI Counselor' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Journal" component={JournalScreen} />
        <Stack.Screen 
          name="MeditationVideos" 
          component={MeditationVideosScreen} 
          options={{ title: 'Guided Meditations' }}
        />
        <Stack.Screen name="Inspiration" component={InspirationScreen} options={{ title: 'Daily Inspiration' }} />
        <Stack.Screen name="QuickExercise" component={QuickExerciseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
