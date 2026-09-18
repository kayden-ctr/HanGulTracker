/**
 * 404 / Not Found screen
 * Rendered by Expo Router when no route matches.
 */

import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useAppTheme } from '@/hooks/useAppTheme';

export default function NotFoundScreen() {
  const theme = useAppTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text style={[styles.emoji]}>🔍</Text>
        <Text
          style={[
            styles.title,
            { color: theme.colors.text, fontSize: theme.typography.fontSize.xl },
          ]}
        >
          Page not found
        </Text>
        <Link href="/(tabs)" asChild>
          <Pressable
            style={[
              styles.button,
              { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.sm },
            ]}
          >
            <Text style={[styles.buttonText, { color: theme.colors.textOnPrimary }]}>
              Go Home
            </Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
  emoji: { fontSize: 56 },
  title: { fontWeight: '700', textAlign: 'center' },
  button: { paddingVertical: 12, paddingHorizontal: 32, marginTop: 8 },
  buttonText: { fontSize: 16, fontWeight: '600' },
});
