/**
 * Tab Navigator Layout
 *
 * Defines the five bottom tabs of the app:
 *   Home · Hangul · Vocabulary · Quiz · Progress
 *
 * Tab bar colors and icon tints come from the active theme so dark mode
 * is handled automatically.
 */

import { Tabs } from 'expo-router';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Platform } from 'react-native';

export default function TabLayout() {
  const theme = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.tabActive,
        tabBarInactiveTintColor: theme.colors.tabInactive,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 0 : 4,
          height: Platform.OS === 'ios' ? 84 : 64,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium,
          marginBottom: Platform.OS === 'android' ? 4 : 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="hangul"
        options={{
          title: 'Hangul',
          tabBarLabel: 'Hangul',
        }}
      />
      <Tabs.Screen
        name="vocabulary"
        options={{
          title: 'Vocabulary',
          tabBarLabel: 'Vocab',
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Quiz',
          tabBarLabel: 'Quiz',
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarLabel: 'Progress',
        }}
      />
    </Tabs>
  );
}
