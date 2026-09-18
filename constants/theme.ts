/**
 * HanGul Tracker — Theme
 *
 * Defines semantic color tokens for light and dark mode.
 * Components always consume theme tokens — never raw palette values.
 *
 * Usage:
 *   import { useAppTheme } from '@/hooks/useAppTheme';
 *   const theme = useAppTheme();
 *   <View style={{ backgroundColor: theme.colors.background }} />
 */

import { Palette } from './colors';
import { BorderRadius, Shadow, Spacing } from './spacing';
import { FontFamily, FontSize, FontWeight, LetterSpacing, LineHeight } from './typography';

// ---------------------------------------------------------------------------
// Semantic color tokens — light
// ---------------------------------------------------------------------------

const lightColors = {
  // Backgrounds
  background: Palette.gray50,
  backgroundSecondary: Palette.white,
  surface: Palette.white,
  surfaceSecondary: Palette.gray100,

  // Brand
  primary: Palette.primary,
  primaryDark: Palette.primaryDark,
  secondary: Palette.secondary,
  accent: Palette.accent,

  // Cards
  card: Palette.card,
  cardSurface: Palette.surface,
  cardLight: Palette.lightSurface,
  cardMuted: Palette.muted,

  // Text
  text: Palette.text,
  textSecondary: Palette.textSecondary,
  textInverse: Palette.white,
  textMuted: Palette.gray400,
  textOnPrimary: Palette.white,

  // Borders & dividers
  border: Palette.gray200,
  borderFocus: Palette.primary,
  divider: Palette.gray100,

  // Semantic states
  success: Palette.success,
  warning: Palette.warning,
  error: Palette.error,

  // Interactive
  tabActive: Palette.primary,
  tabInactive: Palette.gray400,

  // Overlays
  overlay: 'rgba(15, 23, 42, 0.5)',
  transparent: Palette.transparent,
} as const;

// ---------------------------------------------------------------------------
// Semantic color tokens — dark
// ---------------------------------------------------------------------------

const darkColors = {
  // Backgrounds
  background: Palette.gray900,
  backgroundSecondary: Palette.gray800,
  surface: Palette.gray800,
  surfaceSecondary: Palette.gray700,

  // Brand (slightly brighter for dark backgrounds)
  primary: Palette.primary,
  primaryDark: Palette.secondary,
  secondary: Palette.secondary,
  accent: Palette.accent,

  // Cards (tinted dark)
  card: '#1A3A4A',
  cardSurface: '#163340',
  cardLight: '#122C38',
  cardMuted: '#0E2530',

  // Text
  text: Palette.gray50,
  textSecondary: Palette.gray300,
  textInverse: Palette.text,
  textMuted: Palette.gray400,
  textOnPrimary: Palette.white,

  // Borders & dividers
  border: Palette.gray700,
  borderFocus: Palette.primary,
  divider: Palette.gray800,

  // Semantic states
  success: Palette.success,
  warning: Palette.warning,
  error: Palette.error,

  // Interactive
  tabActive: Palette.primary,
  tabInactive: Palette.gray400,

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  transparent: Palette.transparent,
} as const;

// ---------------------------------------------------------------------------
// Theme shape
// ---------------------------------------------------------------------------

/**
 * Structural color token interface — uses `string` so both lightColors and
 * darkColors (which carry different hex literals) can satisfy it.
 */
export interface ThemeColors {
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceSecondary: string;
  primary: string;
  primaryDark: string;
  secondary: string;
  accent: string;
  card: string;
  cardSurface: string;
  cardLight: string;
  cardMuted: string;
  text: string;
  textSecondary: string;
  textInverse: string;
  textMuted: string;
  textOnPrimary: string;
  border: string;
  borderFocus: string;
  divider: string;
  success: string;
  warning: string;
  error: string;
  tabActive: string;
  tabInactive: string;
  overlay: string;
  transparent: string;
}

export interface AppTheme {
  dark: boolean;
  colors: ThemeColors;
  spacing: typeof Spacing;
  borderRadius: typeof BorderRadius;
  shadow: typeof Shadow;
  typography: {
    fontFamily: typeof FontFamily;
    fontSize: typeof FontSize;
    lineHeight: typeof LineHeight;
    fontWeight: typeof FontWeight;
    letterSpacing: typeof LetterSpacing;
  };
}

// ---------------------------------------------------------------------------
// Exported theme objects
// ---------------------------------------------------------------------------

export const LightTheme: AppTheme = {
  dark: false,
  colors: lightColors,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadow: Shadow,
  typography: {
    fontFamily: FontFamily,
    fontSize: FontSize,
    lineHeight: LineHeight,
    fontWeight: FontWeight,
    letterSpacing: LetterSpacing,
  },
};

export const DarkTheme: AppTheme = {
  dark: true,
  colors: darkColors,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadow: Shadow,
  typography: {
    fontFamily: FontFamily,
    fontSize: FontSize,
    lineHeight: LineHeight,
    fontWeight: FontWeight,
    letterSpacing: LetterSpacing,
  },
};
