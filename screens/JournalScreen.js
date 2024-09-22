import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

// ErrorBoundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Text>Something went wrong with the chart.</Text>;
    }

    return this.props.children;
  }
}

const JournalScreen = () => {
  const [journalEntries, setJournalEntries] = useState([]);
  const [timeRange, setTimeRange] = useState(7); // Default to 7 days

  useEffect(() => {
    loadJournalEntries();
    console.log('Journal Entries:', journalEntries);
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

  const getFeelingEmoji = (feeling) => {
    switch (feeling) {
      case 'Awful': return '😢';
      case 'Not Great': return '😕';
      case 'Okay': return '😐';
      case 'Good': return '😊';
      case 'Fantastic': return '😃';
      default: return '❓';
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
          <Ionicons name={item.amount > 0 ? "wine-outline" : "water-outline"} size={24} color={item.amount > 0 ? "#e74c3c" : "#2ecc71"} />
          <Text style={[styles.entryText, { color: item.amount > 0 ? "#e74c3c" : "#2ecc71" }]}>
            {item.amount > 0 ? `Drank ${item.amount} drinks` : "Didn't drink"}
          </Text>
        </View>
        <View style={styles.feelingContainer}>
          <Text style={styles.feelingEmoji}>{getFeelingEmoji(item.feeling)}</Text>
          <Text style={styles.entryText}>Feeling: {item.feeling || 'Not specified'}</Text>
        </View>
      </View>
    </View>
  );

  const getChartData = () => {
    console.log('Raw journal entries:', journalEntries);

    const sortedEntries = [...journalEntries].sort((a, b) => new Date(a.date) - new Date(b.date));
    const recentEntries = sortedEntries.slice(-timeRange);
    
    console.log('Recent entries:', recentEntries);

    const validEntries = recentEntries.filter(entry => entry.date);

    console.log('Valid entries:', validEntries);

    if (validEntries.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{ data: [0] }, { data: [0] }]
      };
    }

    const labels = validEntries.map(entry => {
      const date = new Date(entry.date);
      return `${date.getMonth() + 1}-${date.getDate()}`;
    });

    const maxDrinks = Math.max(...validEntries.map(entry => parseFloat(entry.amount) || 0));

    const drinkData = validEntries.map(entry => {
      const amount = parseFloat(entry.amount);
      return isNaN(amount) ? 0 : amount;
    });

    const feelingData = validEntries.map(entry => {
      switch(entry.feeling) {
        case 'Awful': return maxDrinks * 0.2;
        case 'Not Great': return maxDrinks * 0.4;
        case 'Okay': return maxDrinks * 0.6;
        case 'Good': return maxDrinks * 0.8;
        case 'Fantastic': return maxDrinks;
        default: return 0;
      }
    });

    return {
      labels,
      datasets: [
        {
          data: drinkData,
          color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`, // Red for drinks
          strokeWidth: 2
        },
        {
          data: feelingData,
          color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`, // Blue for feelings
          strokeWidth: 2
        }
      ]
    };
  };

  const addJournalEntry = async (date, amount, feeling) => {
    const newEntry = {
      date,
      amount: parseFloat(amount),
      feeling
    };

    const updatedEntries = [...journalEntries, newEntry];
    setJournalEntries(updatedEntries);

    try {
      await AsyncStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    } catch (error) {
      console.error('Error saving journal entry:', error);
    }
  };

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Journal Entries</Text>
          <TouchableOpacity onPress={loadJournalEntries} style={styles.refreshButton}>
            <Ionicons name="refresh-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {journalEntries.length > 0 ? (
          <View style={styles.chartContainer}>
            <ErrorBoundary>
              <LineChart
                data={getChartData()}
                width={Dimensions.get('window').width - 40}
                height={220}
                yAxisLabel="🍷"
                yAxisSuffix=""
                yAxisInterval={1}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                  },
                  propsForLabels: {
                    fontSize: 10,
                  },
                }}
                bezier
                style={styles.chart}
                legend={['Drinks', 'Feeling']}
                fromZero={true}
                segments={5}
                formatXLabel={(value) => value.split('-')[1]}
                renderRightAxis={() => {
                  const emojis = ['😢', '😕', '😐', '😊', '😃'];
                  return (
                    <View style={{position: 'absolute', right: -35, top: 10, bottom: 10, justifyContent: 'space-between'}}>
                      {emojis.map((emoji, index) => (
                        <Text key={index} style={{fontSize: 20}}>{emoji}</Text>
                      ))}
                    </View>
                  );
                }}
              />
              <Text style={styles.chartExplanation}>
                The red line shows the number of drinks, while the blue line indicates how you felt the next day.
                Higher blue line corresponds to better feelings.
              </Text>
            </ErrorBoundary>
          </View>
        ) : (
          <Text style={styles.noDataText}>No journal entries available</Text>
        )}

        <FlatList
          data={journalEntries}
          renderItem={renderJournalEntry}
          keyExtractor={(item, index) => `${item.date}-${index}`}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
    </ErrorBoundary>
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
    marginTop: 5,
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
  feelingEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  chartExplanation: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 12,
    color: '#666',
  },
});

export default JournalScreen;
