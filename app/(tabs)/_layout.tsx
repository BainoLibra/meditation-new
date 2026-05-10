import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/theme-provider';

export default function TabLayout() {
  const { toggleDark, theme } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Pressable
        onPress={() => toggleDark()}
        style={({ pressed }) => [styles.toggle, pressed && { opacity: 0.7 }]}
        accessibilityLabel="Toggle theme"
      >
        <Ionicons name={theme === 'dark' ? 'sunny' : 'moon'} size={20} color="#fff" />
      </Pressable>
      
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="Meditations"
        options={{
          title: 'Meditations',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Breathing"
        options={{
          title: 'Breathing',
          tabBarIcon: ({ color }) => <Ionicons name="paper-plane-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color }) => <Ionicons name="book-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  toggle: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 50,
    backgroundColor: '#00000066',
    padding: 8,
    borderRadius: 20,
  },
});
