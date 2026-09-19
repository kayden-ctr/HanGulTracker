/**
 * Root Layout
 *
 * The single top-level layout that wraps every screen in the app.
 * Responsibilities:
 *  - Boot Reanimated
 *  - Apply safe-area insets
 *  - Provide the app-wide ThemeContext
 *  - Configure the Expo Router Stack with no visible header at root level
 *  - Set StatusBar style based on active theme
 */

import 'react-native-reanimated';

import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/components/ThemeProvider';

export default function RootLayout() {
  const scheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Entry gate — checks onboarding state */}
          <Stack.Screen name="index" options={{ animation: 'none' }} />

          {/* Splash → fades into onboarding */}
          <Stack.Screen name="splash" options={{ animation: 'none' }} />

          {/* Onboarding flow */}
          <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />

          {/* Main app tabs */}
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        </Stack>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
