/**
 * StatCard
 *
 * A compact metric tile used in a 2-column grid on the Home Dashboard.
 * Shows an icon badge, a numeric value with optional unit, and a label.
 * Supports an optional trend indicator (+/- delta).
 *
 * Props:
 *   icon        — emoji displayed in the tinted badge
 *   value       — primary metric (number or pre-formatted string)
 *   unit        — short suffix rendered smaller next to the value, e.g. "XP"
 *   label       — descriptor below the value, e.g. "Daily Streak"
 *   accentColor — badge tint & value color (defaults to theme primary)
 *   trend       — optional signed number shown as a subtle delta badge
 */

import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';

export interface StatCardProps {
  icon: string;
  value: number | string;
  unit?: string;
  label: string;
  accentColor?: string;
  trend?: number;
}

export function StatCard({
  icon,
  value,
  unit,
  label,
  accentColor,
  trend,
}: StatCardProps) {
  const theme = useAppTheme();
  const fill = accentColor ?? theme.colors.primary;

  const trendPositive = trend !== undefined && trend >= 0;
  const trendLabel =
    trend !== undefined
      ? `${trendPositive ? '+' : ''}${trend}`
      : null;

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
      {/* Icon badge */}
      <View
        style={[
          styles.badge,
          { backgroundColor: fill + '1A' /* ~10% opacity */ },
        ]}
      >
        <Text style={styles.badgeIcon}>{icon}</Text>
      </View>

      {/* Value row */}
      <View style={styles.valueRow}>
        <Text
          style={[
            styles.value,
            {
              color: fill,
              fontSize: theme.typography.fontSize['2xl'],
              fontWeight: theme.typography.fontWeight.bold,
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Text>
        {unit ? (
          <Text
            style={[
              styles.unit,
              {
                color: fill,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.semibold,
              },
            ]}
          >
            {unit}
          </Text>
        ) : null}
      </View>

      {/* Label */}
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.medium,
          },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>

      {/* Optional trend badge */}
      {trendLabel !== null ? (
        <View
          style={[
            styles.trendBadge,
            {
              backgroundColor: trendPositive
                ? theme.colors.success + '1A'
                : theme.colors.error + '1A',
            },
          ]}
        >
          <Text
            style={[
              styles.trendText,
              {
                color: trendPositive
                  ? theme.colors.success
                  : theme.colors.error,
                fontSize: theme.typography.fontSize.xxs,
                fontWeight: theme.typography.fontWeight.semibold,
              },
            ]}
          >
            {trendLabel}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 6,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  badgeIcon: {
    fontSize: 20,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  value: {
    letterSpacing: -0.8,
    lineHeight: 34,
  },
  unit: {
    letterSpacing: 0.2,
    marginBottom: 3,
  },
  label: {
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  trendBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  trendText: {
    letterSpacing: 0.3,
  },
});
