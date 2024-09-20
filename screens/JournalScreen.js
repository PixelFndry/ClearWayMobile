import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

const JournalScreen = () => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [timeRange, setTimeRange] = useState(7); // Default to 7 days

  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = async () => {
    try {
      const entries = await AsyncStorage.getItem('journalEntries');
      if (entries !== null) {
        setJournalEntries(JSON.parse(entries));
      }
    } catch (error) {
      console.error('Error loading journal entries:', error);
    }
  };

  const getFeelingIcon = (feeling) => {
    switch (feeling) {
      case 'Awful': return 'sad-outline';
      case 'Not Great': return 'frown-outline';
      case 'Okay': return 'happy-outline';
      case 'Good': return 'smile-outline';
      case 'Fantastic': return 'sunny-outline';
      default: return 'help-outline';
    }
  };

  const renderJournalEntry = ({ item }) => (
    <View style={styles.entryContainer}>
      <View style={styles.dateContainer}>
        <Ionicons name="calendar-outline" size={24} color="#4380b4" />
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.drinkStatus}>
          <Ionicons name={item.drank ? "wine-outline" : "water-outline"} size={24} color={item.drank ? "#e74c3c" : "#2ecc71"} />
          <Text style={[styles.entryText, { color: item.drank ? "#e74c3c" : "#2ecc71" }]}>
            {item.drank ? `Drank ${item.amount} drinks` : "Didn't drink"}
          </Text>
        </View>
        {item.drank && (
          <View style={styles.feelingContainer}>
            <Ionicons name={getFeelingIcon(item.feeling)} size={24} color="#4380b4" />
            <Text style={styles.entryText}>Feeling: {item.feeling}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const getChartData = () => {
    const sortedEntries = [...journalEntries].sort((a, b) => new Date(a.date) - new Date(b.date));
    const recentEntries = sortedEntries.slice(-timeRange);
    
    return {
      labels: recentEntries.map(entry => entry.date.slice(5)), // MM-DD format
      datasets: [
        {
          data: recentEntries.map(entry => entry.amount || 0),
          color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`, // Red for drinks
          strokeWidth: 2
        },
        {
          data: recentEntries.map(entry => {
            switch(entry.feeling) {
              case 'Awful': return 1;
              case 'Not Great': return 2;
              case 'Okay': return 3;
              case 'Good': return 4;
              case 'Fantastic': return 5;
              default: return 0;
            }
          }),
          color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`, // Blue for feelings
          strokeWidth: 2
        }
      ]
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Journal Entries</Text>
        <TouchableOpacity onPress={loadJournalEntries} style={styles.refreshButton}>
          <Ionicons name="refresh-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={getChartData()}
          width={Dimensions.get('window').width - 20}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            }
          }}
          bezier
          style={styles.chart}
        />
        <View style={styles.timeRangeButtons}>
          <TouchableOpacity onPress={() => setTimeRange(7)} style={[styles.timeRangeButton, timeRange === 7 && styles.activeTimeRange]}>
            <Text style={styles.timeRangeText}>7 Days</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTimeRange(30)} style={[styles.timeRangeButton, timeRange === 30 && styles.activeTimeRange]}>
            <Text style={styles.timeRangeText}>30 Days</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTimeRange(90)} style={[styles.timeRangeButton, timeRange === 90 && styles.activeTimeRange]}>
            <Text style={styles.timeRangeText}>90 Days</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={journalEntries}
        renderItem={renderJournalEntry}
        keyExtractor={(item, index) => `${item.date}-${index}`}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4380b4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  refreshButton: {
    padding: 5,
  },
  listContainer: {
    padding: 10,
  },
  entryContainer: {
    backgroundColor: '#ffffff',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#183e5e',
  },
  detailsContainer: {
    padding: 15,
  },
  drinkStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  feelingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#183e5e',
  },
  chartContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  timeRangeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  timeRangeButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTimeRange: {
    backgroundColor: '#4380b4',
  },
  timeRangeText: {
    color: '#183e5e',
    fontWeight: 'bold',
  },
});

export default JournalScreen;
