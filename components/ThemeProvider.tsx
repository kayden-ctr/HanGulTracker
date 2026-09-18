/**
 * ThemeProvider
 *
 * Wraps the app in a React context that provides the active AppTheme.
 * Also sets the React Navigation theme so native navigators (headers,
 * tab bars) inherit the correct background and text colours.
 *
 * Usage:
 *   const theme = useThemeContext();  // anywhere in the tree
 */

import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { DarkTheme, LightTheme, type AppTheme } from '@/constants/theme';

const ThemeContext = createContext<AppTheme>(LightTheme);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Consume the active theme anywhere in the component tree. */
export function useThemeContext(): AppTheme {
  return useContext(ThemeContext);
}
