/**
 * Vocabulary / Flashcard Screen
 * Route: /(tabs)/vocabulary
 *
 * Layout:
 *   ┌─────────────────────────────────┐
 *   │  Gradient header                │
 *   │  Set selector pills             │
 *   ├─────────────────────────────────┤
 *   │  Session progress bar           │
 *   │  FlashCard (tap to flip)        │
 *   │  Again · Good · Easy buttons    │
 *   │  Familiarity avg indicator      │
 *   └─────────────────────────────────┘
 *
 * Cards are selected via weighted random (low-familiarity items appear more).
 * Ratings are persisted to AsyncStorage via flashcardService.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';

import { useAppTheme } from '@/hooks/useAppTheme';
import { FlashCard } from '@/components/FlashCard';
import {
  VOCABULARY_SETS,
  ALL_VOCABULARY,
  getVocabSetById,
} from '@/data/vocabularySets';
import {
  getFamiliarityMap,
  rateCard,
  weightedRandom,
  averageFamiliarity,
  type FamiliarityMap,
  type FlashcardRating,
} from '@/services/flashcards';
import type { VocabularyItem } from '@/types/vocabulary';

// ---------------------------------------------------------------------------
// Rating button config
// ---------------------------------------------------------------------------

const RATING_BUTTONS: {
  rating: FlashcardRating;
  label: string;
  emoji: string;
  color: string;
  description: string;
}[] = [
  {
    rating: 'again',
    label: 'Again',
    emoji: '↩️',
    color: '#EF4444',
    description: 'Forgot',
  },
  {
    rating: 'good',
    label: 'Good',
    emoji: '👍',
    color: '#099FFC',
    description: 'Correct',
  },
  {
    rating: 'easy',
    label: 'Easy',
    emoji: '⚡',
    color: '#22C55E',
    description: 'Perfect',
  },
];

// Accent color per set id
const SET_COLORS: Record<string, string> = {
  greetings: '#099FFC',
  numbers: '#F97316',
  food: '#22C55E',
  family: '#8B5CF6',
};

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function VocabularyScreen() {
  const theme = useAppTheme();

  // Active set filter — null = all cards
  const [activeSetId, setActiveSetId] = useState<string | null>(null);
  const [familiarityMap, setFamiliarityMap] = useState<FamiliarityMap>({});
  const [currentItem, setCurrentItem] = useState<VocabularyItem | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [lastRating, setLastRating] = useState<FlashcardRating | null>(null);

  // Card swap animation
  const cardOpacity = useSharedValue(1);
  const cardTranslateY = useSharedValue(0);

  // Feedback flash
  const feedbackOpacity = useSharedValue(0);
  const feedbackColor = useRef('#099FFC');

  const feedbackStyle = useAnimatedStyle(() => ({
    opacity: feedbackOpacity.value,
  }));

  // Filtered vocabulary for the active set
  const filteredItems =
    activeSetId ? (getVocabSetById(activeSetId)?.items ?? ALL_VOCABULARY) : ALL_VOCABULARY;

  // Load familiarity from storage on focus
  useFocusEffect(
    useCallback(() => {
      getFamiliarityMap().then((map) => {
        setFamiliarityMap(map);
        pickNext(map, filteredItems);
      });
    }, [activeSetId]),
  );

  function pickNext(map: FamiliarityMap, items: VocabularyItem[]) {
    if (items.length === 0) return;
    const next = weightedRandom(items, map);
    setCurrentItem(next);
    setIsFlipped(false);
  }

  function animateCardOut(callback: () => void) {
    cardOpacity.value = withTiming(0, { duration: 180 });
    cardTranslateY.value = withTiming(-24, { duration: 180 }, () => {
      callback();
    });
  }

  function animateCardIn() {
    cardTranslateY.value = 24;
    cardOpacity.value = 0;
    cardOpacity.value = withTiming(1, { duration: 220 });
    cardTranslateY.value = withSpring(0, { damping: 14, stiffness: 140 });
  }

  const cardAnimStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const handleRate = useCallback(
    async (rating: FlashcardRating) => {
      if (!currentItem || !isFlipped) return;

      // Flash feedback color
      feedbackColor.current =
        rating === 'again' ? '#EF444430' : rating === 'good' ? '#099FFC30' : '#22C55E30';
      feedbackOpacity.value = withSequence(
        withTiming(1, { duration: 120 }),
        withTiming(0, { duration: 400 }),
      );

      // Persist rating
      const newMap = { ...familiarityMap };
      const newScore = await rateCard(currentItem.id, rating);
      newMap[currentItem.id] = newScore;
      setFamiliarityMap(newMap);

      // Update session counters
      setSessionCount((c) => c + 1);
      if (rating !== 'again') setSessionCorrect((c) => c + 1);
      setLastRating(rating);

      // Swap to next card
      animateCardOut(() => {
        pickNext(newMap, filteredItems);
        animateCardIn();
      });
    },
    [currentItem, isFlipped, familiarityMap, filteredItems],
  );

  const accentColor =
    currentItem && activeSetId
      ? SET_COLORS[activeSetId] ?? '#099FFC'
      : '#099FFC';

  const currentFamiliarity = currentItem
    ? (familiarityMap[currentItem.id] ?? 0)
    : 0;

  const avgFamiliarity = averageFamiliarity(
    filteredItems.map((i) => i.id),
    familiarityMap,
  );

  const sessionAccuracy =
    sessionCount > 0 ? Math.round((sessionCorrect / sessionCount) * 100) : 0;

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      {/* Feedback flash overlay */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: feedbackColor.current, zIndex: 10, pointerEvents: 'none' },
          feedbackStyle,
        ]}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        stickyHeaderIndices={[0]}
      >
        {/* ── Gradient header ── */}
        <LinearGradient
          colors={['#099FFC', '#B4F2FC']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Flashcards</Text>
          <Text style={styles.headerSub}>단어 카드</Text>

          {/* Set selector pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pillScroll}
          >
            <Pressable
              onPress={() => setActiveSetId(null)}
              style={[
                styles.setPill,
                !activeSetId && styles.setPillActive,
              ]}
            >
              <Text
                style={[
                  styles.setPillText,
                  !activeSetId && styles.setPillTextActive,
                ]}
              >
                All ({ALL_VOCABULARY.length})
              </Text>
            </Pressable>
            {VOCABULARY_SETS.map((set) => (
              <Pressable
                key={set.id}
                onPress={() => setActiveSetId(set.id)}
                style={[
                  styles.setPill,
                  activeSetId === set.id && styles.setPillActive,
                ]}
              >
                <Text style={styles.setPillEmoji}>{set.coverEmoji}</Text>
                <Text
                  style={[
                    styles.setPillText,
                    activeSetId === set.id && styles.setPillTextActive,
                  ]}
                >
                  {set.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </LinearGradient>

        {/* ── Body ── */}
        <View
          style={[styles.body, { backgroundColor: theme.colors.background }]}
        >
          {/* Session stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statChip}>
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {sessionCount}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                cards
              </Text>
            </View>
            <View style={styles.statChip}>
              <Text style={[styles.statValue, { color: '#22C55E' }]}>
                {sessionAccuracy}%
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                accuracy
              </Text>
            </View>
            <View style={styles.statChip}>
              <Text style={[styles.statValue, { color: '#F97316' }]}>
                {avgFamiliarity.toFixed(1)}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                avg score
              </Text>
            </View>
          </View>

          {/* Flash card */}
          {currentItem ? (
            <Animated.View style={cardAnimStyle}>
              <FlashCard
                item={currentItem}
                familiarity={currentFamiliarity}
                accentColor={accentColor}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped((f) => !f)}
              />
            </Animated.View>
          ) : (
            <View style={[styles.emptyCard, { borderColor: theme.colors.border }]}>
              <Text style={{ fontSize: 40 }}>📭</Text>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No cards in this set
              </Text>
            </View>
          )}

          {/* Flip hint */}
          <Text style={[styles.flipHint, { color: theme.colors.textMuted }]}>
            {isFlipped ? 'Rate your answer below' : 'Tap the card to flip'}
          </Text>

          {/* Rating buttons — visible only after flip */}
          <View
            style={[
              styles.ratingRow,
              { opacity: isFlipped ? 1 : 0.3 },
            ]}
          >
            {RATING_BUTTONS.map(({ rating, label, emoji, color, description }) => (
              <Pressable
                key={rating}
                onPress={() => handleRate(rating)}
                disabled={!isFlipped}
                accessibilityRole="button"
                accessibilityLabel={`Rate ${label}`}
                style={({ pressed }) => [
                  styles.ratingButton,
                  {
                    backgroundColor:
                      lastRating === rating ? color + '20' : theme.colors.surface,
                    borderColor: lastRating === rating ? color : theme.colors.border,
                    ...theme.shadow.sm,
                  },
                  pressed && { transform: [{ scale: 0.95 }] },
                ]}
              >
                <Text style={styles.ratingEmoji}>{emoji}</Text>
                <Text
                  style={[
                    styles.ratingLabel,
                    {
                      color,
                      fontWeight: theme.typography.fontWeight.bold,
                      fontSize: theme.typography.fontSize.sm,
                    },
                  ]}
                >
                  {label}
                </Text>
                <Text
                  style={[
                    styles.ratingDesc,
                    {
                      color: theme.colors.textMuted,
                      fontSize: theme.typography.fontSize.xxs,
                    },
                  ]}
                >
                  {description}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Skip button */}
          <Pressable
            onPress={() => {
              animateCardOut(() => {
                pickNext(familiarityMap, filteredItems);
                animateCardIn();
              });
              setIsFlipped(false);
              setLastRating(null);
            }}
            style={styles.skipButton}
          >
            <Text style={[styles.skipText, { color: theme.colors.textMuted }]}>
              Skip →
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1 },

  // Header
  header: {
    paddingTop: Platform.OS === 'android' ? 16 : 12,
    paddingBottom: 24,
    paddingHorizontal: 20,
    gap: 4,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  headerSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
    marginBottom: 12,
  },
  pillScroll: {
    gap: 8,
    paddingRight: 8,
  },
  setPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  setPillActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  setPillEmoji: { fontSize: 13 },
  setPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.90)',
  },
  setPillTextActive: {
    color: '#099FFC',
  },

  // Body
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
    gap: 16,
    alignItems: 'center',
  },

  // Session stats
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  statChip: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  // Flip hint
  flipHint: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: 0.2,
    marginTop: -4,
  },

  // Rating buttons
  ratingRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  ratingButton: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 3,
  },
  ratingEmoji: { fontSize: 20 },
  ratingLabel: { letterSpacing: 0.1 },
  ratingDesc: { letterSpacing: 0.2 },

  // Empty state
  emptyCard: {
    width: '100%',
    height: 320,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: { fontSize: 15 },

  // Skip
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
