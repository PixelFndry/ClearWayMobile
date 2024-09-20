import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import { collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth } from '../firebase';
import { Picker } from '@react-native-picker/picker';

const JournalScreen = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const [mood, setMood] = useState('neutral');
  const [goal, setGoal] = useState('');
  const [goalCompleted, setGoalCompleted] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'journal_entries'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const fetchedEntries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntries(fetchedEntries);
    }
  };

  const addEntry = async () => {
    if (newEntry.trim() === '') return;
    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(db, 'journal_entries'), {
          userId: user.uid,
          content: newEntry,
          mood: mood,
          goal: goal,
          goalCompleted: goalCompleted,
          createdAt: new Date().toISOString(),
        });
        setNewEntry('');
        setMood('neutral');
        setGoal('');
        setGoalCompleted(false);
        fetchEntries();
      } catch (error) {
        console.error('Error adding entry: ', error);
      }
    }
  };

  const updateEntry = async () => {
    if (editingEntry && editingEntry.content.trim() !== '') {
      try {
        const entryRef = doc(db, 'journal_entries', editingEntry.id);
        await updateDoc(entryRef, { 
          content: editingEntry.content,
          mood: editingEntry.mood,
          goal: editingEntry.goal,
          goalCompleted: editingEntry.goalCompleted
        });
        setEditingEntry(null);
        fetchEntries();
      } catch (error) {
        console.error('Error updating entry: ', error);
      }
    }
  };

  const deleteEntry = async (id) => {
    try {
      await deleteDoc(doc(db, 'journal_entries', id));
      fetchEntries();
    } catch (error) {
      console.error('Error deleting entry: ', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.entryItem}>
      {editingEntry && editingEntry.id === item.id ? (
        <>
          <TextInput
            style={styles.editInput}
            value={editingEntry.content}
            onChangeText={(text) => setEditingEntry({ ...editingEntry, content: text })}
            multiline
          />
          <Picker
            selectedValue={editingEntry.mood}
            onValueChange={(itemValue) => setEditingEntry({ ...editingEntry, mood: itemValue })}
            style={styles.picker}
          >
            <Picker.Item label="😊 Happy" value="happy" />
            <Picker.Item label="😐 Neutral" value="neutral" />
            <Picker.Item label="😔 Sad" value="sad" />
            <Picker.Item label="😠 Angry" value="angry" />
          </Picker>
          <TextInput
            style={styles.editInput}
            value={editingEntry.goal}
            onChangeText={(text) => setEditingEntry({ ...editingEntry, goal: text })}
            placeholder="Set a goal"
          />
          <TouchableOpacity
            style={[styles.goalButton, editingEntry.goalCompleted ? styles.goalCompleted : {}]}
            onPress={() => setEditingEntry({ ...editingEntry, goalCompleted: !editingEntry.goalCompleted })}
          >
            <Text style={styles.goalButtonText}>
              {editingEntry.goalCompleted ? 'Goal Completed' : 'Mark Goal as Complete'}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.entryContent}>{item.content}</Text>
          <Text style={styles.entryMood}>Mood: {item.mood}</Text>
          <Text style={styles.entryGoal}>Goal: {item.goal}</Text>
          <Text style={styles.entryGoalStatus}>
            Goal Status: {item.goalCompleted ? 'Completed' : 'Not Completed'}
          </Text>
          <Text style={styles.entryDate}>{new Date(item.createdAt).toLocaleString()}</Text>
        </>
      )}
      <View style={styles.entryActions}>
        {editingEntry && editingEntry.id === item.id ? (
          <TouchableOpacity onPress={updateEntry} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setEditingEntry(item)} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteEntry(item.id)} style={[styles.actionButton, styles.deleteButton]}>
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Journal</Text>
      <TextInput
        style={styles.input}
        placeholder="Write a new entry..."
        value={newEntry}
        onChangeText={setNewEntry}
        multiline
      />
      <Picker
        selectedValue={mood}
        onValueChange={(itemValue) => setMood(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="😊 Happy" value="happy" />
        <Picker.Item label="😐 Neutral" value="neutral" />
        <Picker.Item label="😔 Sad" value="sad" />
        <Picker.Item label="😠 Angry" value="angry" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Set a goal for today"
        value={goal}
        onChangeText={setGoal}
      />
      <TouchableOpacity
        style={[styles.goalButton, goalCompleted ? styles.goalCompleted : {}]}
        onPress={() => setGoalCompleted(!goalCompleted)}
      >
        <Text style={styles.goalButtonText}>
          {goalCompleted ? 'Goal Completed' : 'Mark Goal as Complete'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={addEntry}>
        <Text style={styles.addButtonText}>Add Entry</Text>
      </TouchableOpacity>
      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.entriesList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // ... (copy all the styles from the original file)
});

export default JournalScreen;
