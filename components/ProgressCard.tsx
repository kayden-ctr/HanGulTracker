/**
 * ProgressCard
 *
 * Displays a labelled progress bar with a current/total fraction.
 * Used on the Home Dashboard for "Overall Progress", "Hangul Mastered",
 * and "Vocabulary Mastered" sections.
 *
 * Props:
 *   label        — card heading
 *   current      — value achieved
 *   total        — maximum value
 *   unit         — e.g. "characters", "words" (shown next to fraction)
 *   accentColor  — fill color of the progress bar (defaults to theme primary)
 *   icon         — emoji or short string shown in the icon badge
 */

import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface ProgressCardProps {
  label: string;
  current: number;
  total: number;
  unit?: string;
  accentColor?: string;
  icon?: string;
}

export function ProgressCard({
  label,
  current,
  total,
  unit,
  accentColor,
  icon,
}: ProgressCardProps) {
  const theme = useAppTheme();
  const fill = accentColor ?? theme.colors.primary;
  const ratio = total > 0 ? Math.min(current / total, 1) : 0;
  const pct = Math.round(ratio * 100);

  // Animate the bar width on mount
  const animatedWidth = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: ratio,
      duration: 900,
      delay: 200,
      useNativeDriver: false,
    }).start();
  }, [ratio]);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          ...theme.shadow.md,
        },
      ]}
    >
      {/* Header row */}
      <View style={styles.header}>
        {icon ? (
          <View
            style={[
              styles.iconBadge,
              { backgroundColor: fill + '20' /* 12% opacity tint */ },
            ]}
          >
            <Text style={styles.iconText}>{icon}</Text>
          </View>
        ) : null}

        <View style={styles.labelBlock}>
          <Text
            style={[
              styles.label,
              {
                color: theme.colors.text,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.semibold,
              },
            ]}
          >
            {label}
          </Text>
          <Text
            style={[
              styles.fraction,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.fontSize.xs,
              },
            ]}
          >
            {current.toLocaleString()} / {total.toLocaleString()}
            {unit ? ` ${unit}` : ''}
          </Text>
        </View>

        <Text
          style={[
            styles.pct,
            {
              color: fill,
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.bold,
            },
          ]}
        >
          {pct}%
        </Text>
      </View>

      {/* Progress track */}
      <View
        style={[
          styles.track,
          { backgroundColor: theme.colors.surfaceSecondary },
        ]}
      >
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: fill,
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  labelBlock: {
    flex: 1,
    gap: 2,
  },
  label: {
    letterSpacing: 0.1,
  },
  fraction: {
    letterSpacing: 0.1,
  },
  pct: {
    letterSpacing: -0.5,
  },
  track: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
