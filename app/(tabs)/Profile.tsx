import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from '@/hooks/theme-provider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

interface StatisticProps {
  label: string;
  value: string | number;
  icon: keyof typeof FontAwesome.glyphMap;
}

const Statistic = ({ label, value, icon }: StatisticProps) => {
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <View style={styles.statisticCard}>
      <FontAwesome name={icon} size={24} color={tintColor} style={styles.statisticIcon} />
      <Text style={[styles.statisticValue, { color: textColor }]}>{value}</Text>
      <Text style={[styles.statisticLabel, { color: textColor }]}>{label}</Text>
    </View>
  );
};

export default function Profile() {
  const [notifications, setNotifications] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const colorScheme = useColorScheme();
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const { theme, toggleDark, setTheme } = useTheme();

  const statistics: StatisticProps[] = [
    { label: 'Minutes Meditated', value: '320', icon: 'clock-o' },
    { label: 'Sessions', value: '24', icon: 'calendar-o' },
    { label: 'Streak', value: '7', icon: 'fire' },
    { label: 'book', value: '12', icon: 'book' },
  ];

  const renderSettingItem = (
    label: string,
    value: boolean,
    onToggle: (value: boolean) => void
  ) => (
    <View style={styles.settingItem}>
      <Text style={[styles.settingLabel, { color: textColor }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#767577', true: tintColor }}
        thumbColor="#f4f3f4"
      />
    </View>
  );

  const renderThemeToggle = () => (
    <View style={styles.settingItem}>
      <Text style={[styles.settingLabel, { color: textColor }]}>Dark Mode</Text>
      <Switch
        value={theme === 'dark'}
        onValueChange={() => toggleDark()}
        trackColor={{ false: '#767577', true: tintColor }}
        thumbColor="#f4f3f4"
      />
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <View style={[styles.avatarContainer, { backgroundColor: tintColor }]}>
          <FontAwesome name="user" size={40} color="#fff" />
        </View>
        <Text style={[styles.username, { color: textColor }]}>Mindful User</Text>
        <Text style={[styles.email, { color: textColor }]}>user@example.com</Text>
      </View>

      <View style={styles.statisticsContainer}>
        {statistics.map((stat, index) => (
          <Statistic key={index} {...stat} />
        ))}
      </View>

      <View style={styles.settingsSection}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Settings</Text>
        
        {renderSettingItem('Notifications', notifications, setNotifications)}
        {renderSettingItem('Haptic Feedback', hapticFeedback, setHapticFeedback)}
        {renderThemeToggle()}
        
        <Pressable style={styles.button}>
          <Text style={[styles.buttonText, { color: tintColor }]}>Export Data</Text>
        </Pressable>
        
        <Pressable style={styles.button}>
          <Text style={[styles.buttonText, { color: tintColor }]}>Privacy Policy</Text>
        </Pressable>
        
        <Pressable style={styles.button}>
          <Text style={[styles.buttonText, { color: tintColor }]}>Terms of Service</Text>
        </Pressable>
        
        <Pressable style={[styles.button, styles.logoutButton]}>
          <Text style={[styles.buttonText, styles.logoutText]}>Log Out</Text>
        </Pressable>
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    opacity: 0.7,
  },
  statisticsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    justifyContent: 'space-between',
  },
  statisticCard: {
    width: '48%',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  statisticIcon: {
    marginBottom: 8,
  },
  statisticValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statisticLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  settingsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  settingLabel: {
    fontSize: 16,
  },
  button: {
    paddingVertical: 15,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 30,
  },
  logoutText: {
    color: '#FF3B30',
  },
  version: {
    textAlign: 'center',
    padding: 20,
    opacity: 0.5,
  },
});
