/**
 * useAppTheme
 *
 * Returns the correct AppTheme (LightTheme or DarkTheme) based on the
 * device's current color scheme. Components use this hook to access all
 * design tokens — colors, spacing, typography, shadows — in one place.
 *
 * Usage:
 *   const theme = useAppTheme();
 *   <View style={{ backgroundColor: theme.colors.background }} />
 */

import { useColorScheme } from 'react-native';
import { DarkTheme, LightTheme, type AppTheme } from '@/constants/theme';

export function useAppTheme(): AppTheme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? DarkTheme : LightTheme;
}
