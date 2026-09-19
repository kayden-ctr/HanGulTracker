/**
 * Onboarding Screen
 *
 * Three horizontally-swipeable pages:
 *   1. Learn Hangul
 *   2. Build Vocabulary
 *   3. Track Your Progress  ← "Get Started" button
 *
 * Design:
 *   - Full-screen blue gradient (#099FFC → #B4F2FC)
 *   - Glassmorphism card per page (frosted white overlay)
 *   - Illustration placeholder per page
 *   - Dot page indicator
 *   - Smooth horizontal slide transition via Reanimated + ScrollView
 *   - On "Get Started": writes ONBOARDING_COMPLETE to AsyncStorage,
 *     then replaces to /(tabs)
 */

import { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolation,
  useAnimatedScrollHandler,
  type SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { setItem, STORAGE_KEYS } from '@/services/storage/storageService';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// Page data
// ---------------------------------------------------------------------------

const PAGES = [
  {
    key: 'learn',
    title: 'Learn Hangul',
    description:
      'Master the Korean alphabet step by step. From basic vowels and consonants to full syllable blocks.',
    emoji: '🔤',
    accentEmoji: '가',
    illustrationLabel: 'Hangul Characters',
  },
  {
    key: 'vocabulary',
    title: 'Build Vocabulary',
    description:
      'Expand your Korean word bank with curated vocabulary sets. Flashcards make it fast and fun.',
    emoji: '📚',
    accentEmoji: '단어',
    illustrationLabel: 'Vocabulary Cards',
  },
  {
    key: 'progress',
    title: 'Track Your Progress',
    description:
      "See how far you've come with visual streaks, accuracy charts, and daily learning goals.",
    emoji: '📈',
    accentEmoji: '진도',
    illustrationLabel: 'Progress Chart',
  },
] as const;

// ---------------------------------------------------------------------------
// Illustration placeholder
// ---------------------------------------------------------------------------

function IllustrationPlaceholder({
  emoji,
  accentEmoji,
  label,
}: {
  emoji: string;
  accentEmoji: string;
  label: string;
}) {
  return (
    <View style={styles.illustration}>
      {/* Outer glow ring */}
      <View style={styles.illustrationRing}>
        <View style={styles.illustrationInner}>
          <Text style={styles.illustrationEmoji}>{emoji}</Text>
          <Text style={styles.illustrationAccent}>{accentEmoji}</Text>
        </View>
      </View>
      <Text style={styles.illustrationLabel}>{label}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Dot indicator
// ---------------------------------------------------------------------------

function DotIndicator({
  count,
  scrollX,
}: {
  count: number;
  scrollX: SharedValue<number>;
}) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: count }).map((_, i) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const dotStyle = useAnimatedStyle(() => {
          const inputRange = [
            (i - 1) * SCREEN_WIDTH,
            i * SCREEN_WIDTH,
            (i + 1) * SCREEN_WIDTH,
          ];
          const width = interpolate(
            scrollX.value,
            inputRange,
            [8, 24, 8],
            Extrapolation.CLAMP,
          );
          const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.4, 1, 0.4],
            Extrapolation.CLAMP,
          );
          return { width, opacity };
        });

        return (
          <Animated.View key={i} style={[styles.dot, dotStyle]} />
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function OnboardingScreen() {
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [finishing, setFinishing] = useState(false);

  // Track scroll position for dot indicator
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  // Keep currentPage in sync for the button label
  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      setCurrentPage(page);
    },
    [],
  );

  const handleGetStarted = useCallback(async () => {
    if (finishing) return;
    setFinishing(true);
    await setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
    router.replace('/(tabs)');
  }, [finishing]);

  const handleNext = useCallback(() => {
    const next = currentPage + 1;
    scrollRef.current?.scrollTo({ x: next * SCREEN_WIDTH, animated: true });
    setCurrentPage(next);
  }, [currentPage]);

  const isLast = currentPage === PAGES.length - 1;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Background gradient */}
      <LinearGradient
        colors={['#099FFC', '#B4F2FC']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative blurred circles */}
      <View style={[styles.blob, styles.blobTop]} />
      <View style={[styles.blob, styles.blobBottom]} />

      {/* Scrollable pages */}
      <AnimatedScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        onMomentumScrollEnd={onMomentumScrollEnd}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {PAGES.map((page) => (
          <View key={page.key} style={styles.page}>
            {/* Glassmorphism card */}
            <View style={styles.card}>
              <IllustrationPlaceholder
                emoji={page.emoji}
                accentEmoji={page.accentEmoji}
                label={page.illustrationLabel}
              />

              <Text style={styles.pageTitle}>{page.title}</Text>
              <Text style={styles.pageDescription}>{page.description}</Text>
            </View>
          </View>
        ))}
      </AnimatedScrollView>

      {/* Footer: dots + button */}
      <View style={styles.footer}>
        <DotIndicator count={PAGES.length} scrollX={scrollX} />

        <Pressable
          style={({ pressed }) => [
            styles.button,
            isLast && styles.buttonPrimary,
            pressed && styles.buttonPressed,
          ]}
          onPress={isLast ? handleGetStarted : handleNext}
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'Get Started' : 'Next'}
        >
          <Text style={[styles.buttonText, isLast && styles.buttonTextPrimary]}>
            {isLast ? 'Get Started' : 'Next'}
          </Text>
        </Pressable>

        {/* Skip — only on pages 1 & 2 */}
        {!isLast && (
          <Pressable
            style={styles.skipButton}
            onPress={handleGetStarted}
            accessibilityRole="button"
            accessibilityLabel="Skip onboarding"
          >
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const CARD_PADDING = 28;
const CARD_WIDTH = SCREEN_WIDTH - 48;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#099FFC',
  },

  // Decorative background blobs
  blob: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  blobTop: {
    width: 280,
    height: 280,
    top: -80,
    right: -60,
  },
  blobBottom: {
    width: 240,
    height: 240,
    bottom: 60,
    left: -80,
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },

  // Page
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },

  // Glassmorphism card
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 28,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    padding: CARD_PADDING,
    alignItems: 'center',
    gap: 16,
    // iOS shadow
    shadowColor: '#0484FC',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    // Android elevation
    elevation: 8,
  },

  // Illustration placeholder
  illustration: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  illustrationRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  illustrationInner: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  illustrationEmoji: {
    fontSize: 36,
    lineHeight: 42,
  },
  illustrationAccent: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  illustrationLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '500',
  },

  // Page text
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  pageDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 48 : 32,
    paddingTop: 16,
    alignItems: 'center',
    gap: 12,
  },

  // Dot indicator
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },

  // Button
  button: {
    width: SCREEN_WIDTH - 48,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  buttonPrimary: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  buttonTextPrimary: {
    color: '#099FFC',
  },

  // Skip
  skipButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
});
