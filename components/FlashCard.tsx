/**
 * FlashCard
 *
 * A reusable card with a 3-D Y-axis flip animation powered by
 * React Native Reanimated.
 *
 * Animation mechanics:
 *   - A single shared value `rotation` drives both faces.
 *   - Front face:  rotateY  0° → 90°  (disappears at mid-point)
 *   - Back face:  rotateY -90° → 0°  (appears at mid-point)
 *   - The mid-point cross-fade is achieved with `backfaceVisibility: hidden`
 *     and perspective(1000) on each face's transform.
 *
 * Props:
 *   item          — VocabularyItem to display
 *   familiarity   — current score 0-5 (drives the indicator dots)
 *   accentColor   — tint for Korean text and indicator
 *   onFlip        — optional callback fired when card flips
 *   isFlipped     — controlled flip state (parent drives flip)
 */

import { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useAppTheme } from '@/hooks/useAppTheme';
import type { VocabularyItem } from '@/types/vocabulary';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;
const CARD_HEIGHT = 320;
const FLIP_DURATION = 380;

// Familiarity dot indicator — 5 dots
function FamiliarityDots({
  score,
  color,
}: {
  score: number;
  color: string;
}) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: 5 }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            {
              backgroundColor: i < score ? color : color + '28',
            },
          ]}
        />
      ))}
    </View>
  );
}

// Difficulty badge
const DIFF_COLOR: Record<VocabularyItem['difficulty'], string> = {
  beginner: '#22C55E',
  intermediate: '#F97316',
  advanced: '#8B5CF6',
};

export interface FlashCardProps {
  item: VocabularyItem;
  familiarity: number;
  accentColor?: string;
  isFlipped: boolean;
  onFlip: () => void;
}

export function FlashCard({
  item,
  familiarity,
  accentColor = '#099FFC',
  isFlipped,
  onFlip,
}: FlashCardProps) {
  const theme = useAppTheme();
  const rotation = useSharedValue(0);

  // Animate whenever isFlipped changes
  useEffect(() => {
    rotation.value = withTiming(isFlipped ? 1 : 0, {
      duration: FLIP_DURATION,
    });
  }, [isFlipped]);

  // Front face — rotates 0 → 90 then is hidden
  const frontStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      rotation.value,
      [0, 0.5, 1],
      [0, 90, 90],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      rotation.value,
      [0, 0.45, 0.5],
      [1, 1, 0],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ perspective: 1200 }, { rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  // Back face — starts at -90, rotates in to 0
  const backStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      rotation.value,
      [0, 0.5, 1],
      [-90, -90, 0],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      rotation.value,
      [0.5, 0.55, 1],
      [0, 1, 1],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ perspective: 1200 }, { rotateY: `${rotateY}deg` }],
      opacity,
    };
  });

  const diffColor = DIFF_COLOR[item.difficulty];

  return (
    <Pressable
      onPress={onFlip}
      accessibilityRole="button"
      accessibilityLabel={
        isFlipped
          ? `Card back: ${item.english}`
          : `Card front: ${item.korean}, tap to flip`
      }
      style={styles.container}
    >
      {/* ── FRONT ── */}
      <Animated.View
        style={[
          styles.card,
          styles.cardAbsolute,
          {
            backgroundColor: theme.colors.surface,
            borderColor: accentColor + '40',
            ...theme.shadow.lg,
          },
          frontStyle,
        ]}
      >
        {/* Top row: difficulty + familiarity */}
        <View style={styles.cardTopRow}>
          <View style={[styles.diffBadge, { backgroundColor: diffColor + '18' }]}>
            <Text style={[styles.diffText, { color: diffColor }]}>
              {item.difficulty}
            </Text>
          </View>
          <FamiliarityDots score={familiarity} color={accentColor} />
        </View>

        {/* Korean word — centred, large */}
        <View style={styles.cardCenter}>
          <Text style={[styles.korean, { color: accentColor }]}>
            {item.korean}
          </Text>
          <Text style={[styles.tapHint, { color: theme.colors.textMuted }]}>
            Tap to reveal
          </Text>
        </View>

        {/* Tags row */}
        <View style={styles.tagsRow}>
          {item.tags.slice(0, 3).map((tag) => (
            <View
              key={tag}
              style={[styles.tag, { backgroundColor: theme.colors.surfaceSecondary }]}
            >
              <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* ── BACK ── */}
      <Animated.View
        style={[
          styles.card,
          styles.cardAbsolute,
          {
            backgroundColor: theme.colors.surface,
            borderColor: accentColor + '60',
            ...theme.shadow.lg,
          },
          backStyle,
        ]}
      >
        {/* Top row */}
        <View style={styles.cardTopRow}>
          <Text style={[styles.koreanSmall, { color: accentColor }]}>
            {item.korean}
          </Text>
          <FamiliarityDots score={familiarity} color={accentColor} />
        </View>

        {/* Main content */}
        <View style={styles.cardCenter}>
          {/* English meaning */}
          <Text
            style={[
              styles.english,
              {
                color: theme.colors.text,
                fontWeight: theme.typography.fontWeight.bold,
                fontSize: theme.typography.fontSize.xl,
              },
            ]}
          >
            {item.english}
          </Text>

          {/* Romanisation */}
          <View style={[styles.romanBadge, { backgroundColor: accentColor + '15' }]}>
            <Text style={[styles.romanText, { color: accentColor }]}>
              {item.romanisation}
            </Text>
          </View>
        </View>

        {/* Example sentence */}
        {item.exampleSentence ? (
          <View
            style={[
              styles.exampleBox,
              {
                backgroundColor: theme.colors.surfaceSecondary,
                borderLeftColor: accentColor,
              },
            ]}
          >
            <Text
              style={[
                styles.exampleKorean,
                { color: theme.colors.text, fontSize: theme.typography.fontSize.sm },
              ]}
            >
              {item.exampleSentence}
            </Text>
            {item.exampleTranslation ? (
              <Text
                style={[
                  styles.exampleEnglish,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.fontSize.xs,
                  },
                ]}
              >
                {item.exampleTranslation}
              </Text>
            ) : null}
          </View>
        ) : null}
      </Animated.View>

      {/* Invisible spacer so the Pressable has the right height */}
      <View style={styles.spacer} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 22,
    justifyContent: 'space-between',
    backfaceVisibility: 'hidden',
  },
  cardAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  spacer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },

  // Top row
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  diffBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  diffText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },

  // Familiarity dots
  dotsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Card centre
  cardCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },

  // Front
  korean: {
    fontSize: 72,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 86,
  },
  tapHint: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.3,
  },

  // Back — small Korean echo at top
  koreanSmall: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  english: {
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  romanBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  romanText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Example sentence
  exampleBox: {
    borderRadius: 10,
    borderLeftWidth: 3,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 3,
  },
  exampleKorean: {
    fontWeight: '500',
    lineHeight: 20,
  },
  exampleEnglish: {
    lineHeight: 18,
  },

  // Tags
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});
