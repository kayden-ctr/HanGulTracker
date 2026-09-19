/**
 * LessonCard
 *
 * Displays a single Hangul character lesson in a tappable card.
 * Shows the glyph, romanisation, difficulty badge, and a mini
 * progress bar indicating mastery (0 or 1 for individual chars).
 *
 * Props:
 *   lesson       — HangulLesson data object
 *   isMastered   — whether the user has marked this lesson done
 *   accentColor  — category colour used for badge and bar tint
 *   onPress      — tap handler (navigates to detail)
 */

import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { HangulLesson } from '@/data/hangulCharacters';

const DIFFICULTY_LABEL: Record<HangulLesson['difficulty'], string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export interface LessonCardProps {
  lesson: HangulLesson;
  isMastered: boolean;
  accentColor: string;
  onPress: () => void;
}

export function LessonCard({
  lesson,
  isMastered,
  accentColor,
  onPress,
}: LessonCardProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Lesson: ${lesson.glyph}, ${lesson.romanisation}`}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.colors.surface,
          borderColor: isMastered ? accentColor + '60' : theme.colors.border,
          ...theme.shadow.sm,
        },
        pressed && styles.pressed,
      ]}
    >
      {/* Mastered checkmark badge */}
      {isMastered && (
        <View style={[styles.masteredBadge, { backgroundColor: accentColor }]}>
          <Text style={styles.masteredCheck}>✓</Text>
        </View>
      )}

      {/* Glyph */}
      <View
        style={[
          styles.glyphBox,
          { backgroundColor: accentColor + '15' },
        ]}
      >
        <Text style={[styles.glyph, { color: accentColor }]}>
          {lesson.glyph}
        </Text>
      </View>

      {/* Romanisation */}
      <Text
        style={[
          styles.romanisation,
          {
            color: theme.colors.text,
            fontWeight: theme.typography.fontWeight.semibold,
            fontSize: theme.typography.fontSize.sm,
          },
        ]}
        numberOfLines={1}
      >
        {lesson.romanisation}
      </Text>

      {/* Difficulty badge */}
      <View
        style={[
          styles.diffBadge,
          { backgroundColor: accentColor + '18' },
        ]}
      >
        <Text
          style={[
            styles.diffText,
            {
              color: accentColor,
              fontSize: theme.typography.fontSize.xxs,
              fontWeight: theme.typography.fontWeight.semibold,
            },
          ]}
        >
          {DIFFICULTY_LABEL[lesson.difficulty]}
        </Text>
      </View>

      {/* Mini progress bar — full if mastered, empty if not */}
      <View
        style={[
          styles.progressTrack,
          { backgroundColor: theme.colors.surfaceSecondary },
        ]}
      >
        <View
          style={[
            styles.progressFill,
            {
              backgroundColor: isMastered ? accentColor : 'transparent',
              width: isMastered ? '100%' : '0%',
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 100,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.96 }],
  },

  // Mastered badge
  masteredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  masteredCheck: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
    lineHeight: 13,
  },

  // Glyph circle
  glyphBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyph: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
  },

  // Labels
  romanisation: {
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  // Difficulty badge
  diffBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  diffText: {
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },

  // Progress
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});
