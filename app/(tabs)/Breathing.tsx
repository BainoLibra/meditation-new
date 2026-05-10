import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import { useThemeColor } from '../../hooks/use-theme-color';

const BREATHING_SOUNDS = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
];

export default function Breathing() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('ready');
  const [duration, setDuration] = useState(600); // 10 minutes default
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [sound, setSound] = useState<Audio.Sound>();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);
  const breathCycleRef = useRef<ReturnType<typeof setInterval>>(null);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // Load and play breathing background sound
  async function loadAndPlaySound() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
      });

      const soundUrl = BREATHING_SOUNDS[Math.floor(Math.random() * BREATHING_SOUNDS.length)];
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: soundUrl },
        {
          shouldPlay: true,
          isLooping: true,
          volume: 0.5,
        }
      );
      setSound(newSound);
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  }

  const startBreathing = async () => {
    setIsBreathing(true);
    setTimeRemaining(duration);
    await loadAndPlaySound();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Breathing animation cycle
    scale.value = withRepeat(
      withTiming(1.5, { 
        duration: 4000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    // Start phase cycle
    breathCycleRef.current = setInterval(() => {
      setCurrentPhase((prev) => {
        const phases = ['inhale', 'hold', 'exhale', 'rest'];
        const currentIndex = phases.indexOf(prev);
        const nextIndex = (currentIndex + 1) % phases.length;
        return phases[nextIndex];
      });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }, 4000);

    // Start timer
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          stopBreathing();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setCurrentPhase('inhale');
  };

  const stopBreathing = async () => {
    setIsBreathing(false);
    scale.value = withTiming(1);
    setCurrentPhase('ready');

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (breathCycleRef.current) {
      clearInterval(breathCycleRef.current);
      breathCycleRef.current = null;
    }

    if (sound) {
      try {
        const status = await sound.getStatusAsync();
        if (status?.isLoaded) {
          // stop only if currently playing
          if (status.isPlaying) {
            await sound.stopAsync();
          }
        }
        await sound.unloadAsync();
      } catch (err) {
        console.warn('Error stopping sound:', err);
      } finally {
        setSound(undefined);
      }
    }
  };

  useEffect(() => {
    return () => {
      // call async cleanup without making the effect async
      (async () => {
        try {
          await stopBreathing();
        } catch (err) {
          console.warn('Error during breathing cleanup:', err);
        }
      })();
    };
  }, [/* run only on unmount */]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Image
        source={{
          uri: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        }}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      <View style={[styles.overlay, { backgroundColor: `${backgroundColor}80` }]} />

      <Pressable
        onPress={isBreathing ? stopBreathing : startBreathing}
        style={styles.breathingArea}
      >
        <Animated.View style={[styles.circle, animatedStyle, { backgroundColor: tintColor }]} />
        <Text style={[styles.phaseText, { color: textColor }]}>
          {isBreathing 
            ? currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)
            : 'Tap to Start'}
        </Text>
      </Pressable>
      
      <View style={styles.instructionContainer}>
        <Text style={[styles.instructionText, { color: textColor }]}>
          {isBreathing
            ? getInstructions(currentPhase)
            : 'Take a moment to breathe'}
        </Text>
        {isBreathing && (
          <Text style={[styles.timerText, { color: tintColor }]}>
            {formatTime(timeRemaining)}
          </Text>
        )}
      </View>
    </View>
  );
}

const getInstructions = (phase: string) => {
  switch (phase) {
    case 'inhale':
      return 'Breathe in slowly...';
    case 'hold':
      return 'Hold your breath...';
    case 'exhale':
      return 'Release slowly...';
    case 'rest':
      return 'Rest...';
    default:
      return 'Prepare to begin...';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  breathingArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    zIndex: 1,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.3,
  },
  phaseText: {
    fontSize: 24,
    fontWeight: '600',
    position: 'absolute',
  },
  instructionContainer: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  instructionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  timerText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
