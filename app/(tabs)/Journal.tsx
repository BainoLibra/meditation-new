import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import ParallaxScrollView from '../../components/parallax-scroll-view';
import { useThemeColor } from '../../hooks/use-theme-color';

type MoodType = 'great' | 'good' | 'okay' | 'bad' | 'awful';

interface JournalEntry {
  id: string;
  date: Date;
  mood: MoodType;
  note: string;
}

export default function Journal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newNote, setNewNote] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const moodEmojis: Record<MoodType, string> = {
    great: '😊',
    good: '🙂',
    okay: '😐',
    bad: '😕',
    awful: '😢'
  };

  const addEntry = () => {
    if (selectedMood && newNote.trim()) {
      const entry: JournalEntry = {
        id: Date.now().toString(),
        date: new Date(),
        mood: selectedMood,
        note: newNote.trim()
      };
      setEntries([entry, ...entries]);
      setNewNote('');
      setSelectedMood(null);
    }
  };

  const headerImage = (
    <View style={styles.header}>
      <Text style={[styles.headerText, { color: '#fff' }]}>Mindfulness Journal</Text>
      <Text style={[styles.subHeaderText, { color: '#fff' }]}>
        Track your mood and thoughts
      </Text>
    </View>
  );

  return (
    <ParallaxScrollView
      headerImage={headerImage}
      headerBackgroundColor={{ dark: '#1a1a1a', light: '#4A90E2' }}
    >
      <View style={styles.content}>
        <View style={styles.moodSelector}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>How are you feeling?</Text>
          <View style={styles.moodButtons}>
            {(Object.keys(moodEmojis) as MoodType[]).map((mood) => (
              <Pressable
                key={mood}
                style={[
                  styles.moodButton,
                  selectedMood === mood && { backgroundColor: tintColor }
                ]}
                onPress={() => setSelectedMood(mood)}
              >
                <Text style={styles.moodEmoji}>{moodEmojis[mood]}</Text>
                <Text style={[styles.moodText, { color: textColor }]}>
                  {mood.charAt(0).toUpperCase() + mood.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.noteSection}>
          <TextInput
            style={[styles.noteInput, { color: textColor, borderColor: tintColor }]}
            placeholder="Write your thoughts..."
            placeholderTextColor={textColor + '80'}
            value={newNote}
            onChangeText={setNewNote}
            multiline
          />
          <Pressable
            style={[styles.addButton, { backgroundColor: tintColor }]}
            onPress={addEntry}
            disabled={!selectedMood || !newNote.trim()}
          >
            <Text style={styles.addButtonText}>Add Entry</Text>
          </Pressable>
        </View>

        <View style={styles.entriesList}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Previous Entries</Text>
          {entries.map((entry) => (
            <View key={entry.id} style={[styles.entryCard, { borderColor: tintColor }]}>
              <View style={styles.entryHeader}>
                <Text style={[styles.entryDate, { color: textColor }]}>
                  {entry.date.toLocaleDateString()}
                </Text>
                <Text style={styles.entryMood}>{moodEmojis[entry.mood]}</Text>
              </View>
              <Text style={[styles.entryNote, { color: textColor }]}>{entry.note}</Text>
            </View>
          ))}
        </View>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 16,
    opacity: 0.8,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  moodSelector: {
    marginBottom: 20,
  },
  moodButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    width: '18%',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodText: {
    fontSize: 12,
  },
  noteSection: {
    marginBottom: 20,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  addButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  entriesList: {
    marginTop: 20,
  },
  entryCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 14,
    opacity: 0.8,
  },
  entryMood: {
    fontSize: 20,
  },
  entryNote: {
    fontSize: 16,
  },
});
