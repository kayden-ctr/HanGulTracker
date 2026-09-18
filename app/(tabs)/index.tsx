/**
 * Home Screen (placeholder)
 * Route: / (index tab)
 */

import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function HomeScreen() {
  const theme = useAppTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.emoji]}>🇰🇷</Text>
        <Text
          style={[
            styles.title,
            {
              color: theme.colors.text,
              fontSize: theme.typography.fontSize['2xl'],
              fontWeight: theme.typography.fontWeight.bold,
            },
          ]}
        >
          HanGul Tracker
        </Text>
        <Text
          style={[
            styles.subtitle,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.fontSize.md,
            },
          ]}
        >
          Your offline Hangul learning companion
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  emoji: { fontSize: 64 },
  title: { textAlign: 'center' },
  subtitle: { textAlign: 'center' },
});
