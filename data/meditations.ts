export type MeditationCategory = 'sleep' | 'focus' | 'stress' | 'selfCare';

export type MeditationTrack = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: MeditationCategory;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number;
  image: string;
  audio: string;
};

export const CATEGORIES: Record<MeditationCategory, { name: string; icon: string }> = {
  sleep: { name: 'Sleep', icon: '🌙' },
  focus: { name: 'Focus', icon: '🎯' },
  stress: { name: 'Stress Relief', icon: '🧘' },
  selfCare: { name: 'Self Care', icon: '💖' },
};

export const MEDITATIONS: MeditationTrack[] = [
  {
    id: 'sleep-1',
    title: 'Drift Into Sleep',
    subtitle: 'Calm night breathing',
    description: 'A gentle sleep meditation to relax your body and quiet your mind before bedtime.',
    category: 'sleep',
    level: 'Beginner',
    duration: 600,
    image: 'https://images.pexels.com/photos/532676/pexels-photo-532676.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'focus-1',
    title: 'Focus Flow',
    subtitle: 'Stay present and productive',
    description: 'A focused meditation to help you stay grounded and productive during your day.',
    category: 'focus',
    level: 'Intermediate',
    duration: 420,
    image: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'stress-1',
    title: 'Stress Release',
    subtitle: 'Breathe away tension',
    description: 'A soothing meditation designed to ease tension and calm racing thoughts.',
    category: 'stress',
    level: 'Beginner',
    duration: 480,
    image: 'https://images.pexels.com/photos/317157/pexels-photo-317157.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 'selfcare-1',
    title: 'Self Care Pause',
    subtitle: 'Reconnect with yourself',
    description: 'A restorative meditation that helps you reconnect with your inner calm and compassion.',
    category: 'selfCare',
    level: 'Beginner',
    duration: 300,
    image: 'https://images.pexels.com/photos/375965/pexels-photo-375965.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
];
