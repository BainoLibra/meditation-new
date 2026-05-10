import { Stack } from 'expo-router';
import { useThemeColor } from '../../../hooks/use-theme-color';

export default function MeditationsLayout() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor,
        },
        headerTintColor: textColor,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Meditations',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          presentation: 'card',
        }}
      />
    </Stack>
  );
}