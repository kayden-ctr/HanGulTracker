/**
 * Hangul feature stack layout.
 * Manages the nested stack: list → detail.
 * Header is hidden — each screen draws its own.
 */
import { Stack } from 'expo-router';

export default function HangulLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
