/**
 * Quiz Screen (placeholder)
 * Route: /quiz
 */

import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function QuizScreen() {
  const theme = useAppTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>🎯</Text>
        <Text
          style={[
            styles.title,
            { color: theme.colors.text, fontSize: theme.typography.fontSize.xl },
          ]}
        >
          Quiz
        </Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
          Multiple choice and typing quizzes coming soon.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emoji: { fontSize: 64 },
  title: { fontWeight: '700' },
  body: { fontSize: 15, textAlign: 'center', paddingHorizontal: 32 },
});
