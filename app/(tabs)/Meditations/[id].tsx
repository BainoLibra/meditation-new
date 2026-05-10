import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MEDITATIONS } from '../../../data/meditations';
import { useThemeColor } from '../../../hooks/use-theme-color';

export default function MeditationScreen() {
  const { id } = useLocalSearchParams();
  const meditation = MEDITATIONS.find(m => m.id === id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sound, setSound] = useState<Audio.Sound>();
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  useEffect(() => {
    if (meditation) {
      setTimeRemaining(meditation.duration);
    }
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [meditation]);

  useEffect(() => {
    return () => {
      if (sound) {
        console.log('Cleaning up sound...'); // Debug log
        sound.stopAsync().then(() => {
          sound.unloadAsync();
        }).catch(error => {
          console.error('Error cleaning up sound:', error);
        });
      }
    };
  }, [sound]);

  const [error, setError] = useState<string | null>(null);

  async function loadAndPlaySound() {
    if (meditation) {
      try {
        setError(null);
        console.log('Loading audio from:', meditation.audio); // Debug log

        // First check if the audio file is accessible
        try {
          const response = await fetch(meditation.audio, { method: 'HEAD' });
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (error) {
          const fetchError = error instanceof Error ? error.message : 'Unknown error';
          console.error('Audio file not accessible:', fetchError);
          setError(`Audio file not accessible: ${fetchError}`);
          return;
        }
        
        // Ensure audio mode is set up correctly
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: meditation.audio },
          { 
            shouldPlay: true,
            isLooping: true, // Keep audio looping
            volume: 1.0,
            progressUpdateIntervalMillis: 1000,
          },
          (status) => {
            console.log('Audio status:', status); // Debug log
            if ('error' in status) {
              // This is an error status
              setError(`Unable to load audio: ${status.error}`);
              console.error('Audio loading error:', status.error);
            } else if (status.isLoaded) {
              // Clear any previous error once loaded successfully
              setError(null);
            }
          }
        );

        setSound(newSound);
        const result = await newSound.playAsync();
        console.log('Play result:', result); // Debug log
      } catch (error) {
        console.error('Audio error:', error); // Debug log
        const message = error instanceof Error ? error.message : 'Unknown error';
        setError(`Unable to play meditation audio. Please try again later. (${message})`);
        setIsPlaying(false);
        if (timerRef.current !== null) {
          clearInterval(timerRef.current);
        }
      }
    }
  }

  async function handlePlayPause() {
    if (!isPlaying) {
      setIsPlaying(true);
      await loadAndPlaySound();
      const timerId = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            if (timerRef.current !== null) {
              clearInterval(timerRef.current);
            }
            setIsPlaying(false);
            if (sound) {
              sound.stopAsync().then(() => {
                sound.unloadAsync();
              });
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
      timerRef.current = timerId;
    } else {
      setIsPlaying(false);
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
      await sound?.pauseAsync();
    }
  }

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  if (!meditation) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.errorText, { color: textColor }]}>Meditation not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Stack.Screen 
        options={{
          title: meditation.title,
          headerStyle: { backgroundColor },
          headerTintColor: textColor,
        }} 
      />
      
      <Image
        source={typeof meditation.image === 'string' ? { uri: meditation.image } : meditation.image}
        style={styles.coverImage}
        contentFit="cover"
        transition={200}
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>{meditation.title}</Text>
        <Text style={[styles.subtitle, { color: textColor + '99' }]}>{meditation.subtitle}</Text>
        
        <Text style={[styles.description, { color: textColor + 'CC' }]}>
          {meditation.description}
        </Text>

        {error && (
          <Text style={[styles.errorMessage, { color: '#ff6b6b' }]}>
            {error}
          </Text>
        )}

        <Pressable
          style={[styles.playButton, { backgroundColor: tintColor }]}
          onPress={handlePlayPause}
        >
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={24} 
            color="white" 
          />
          <Text style={styles.playButtonText}>
            {isPlaying ? 'Pause' : 'Start Meditation'}
          </Text>
        </Pressable>

        <Text style={[styles.timer, { color: textColor }]}>
          {formatTime(timeRemaining)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverImage: {
    width: '100%',
    height: 300,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 32,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  playButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  timer: {
    fontSize: 48,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
    fontVariant: ['tabular-nums'],
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
});