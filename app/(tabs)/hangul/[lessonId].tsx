/**
 * Lesson Detail Screen
 * Route: /(tabs)/hangul/[lessonId]
 *
 * Displays:
 *   - Large Hangul character
 *   - Romanisation & IPA pronunciation
 *   - Example word with Korean, romanisation, and English meaning
 *   - Stroke order placeholder
 *   - Mark as Mastered / Mastered button (persisted via AsyncStorage)
 */

import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useAppTheme } from '@/hooks/useAppTheme';
import { getLessonById, LESSON_CATEGORIES } from '@/data/hangulCharacters';
import {
  isLessonMastered,
  markLessonMastered,
  unmarkLessonMastered,
} from '@/services/hangul';

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function LessonDetailScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();

  const lesson = getLessonById(lessonId);
  const category = lesson
    ? LESSON_CATEGORIES.find((c) => c.id === lesson.categoryId)
    : undefined;

  const [mastered, setMastered] = useState(false);
  const [loading, setLoading] = useState(true);

  // Animation values
  const glyphScale = useSharedValue(0.7);
  const glyphOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  const glyphStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glyphScale.value }],
    opacity: glyphOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Load mastered state
  useEffect(() => {
    if (!lessonId) return;
    isLessonMastered(lessonId).then((val) => {
      setMastered(val);
      setLoading(false);
    });
    // Entrance animation
    glyphScale.value = withSpring(1, { damping: 12, stiffness: 120 });
    glyphOpacity.value = withTiming(1, { duration: 400 });
  }, [lessonId]);

  const handleMastered = useCallback(async () => {
    if (!lessonId) return;

    // Bounce animation
    buttonScale.value = withSequence(
      withSpring(0.93, { damping: 10 }),
      withSpring(1, { damping: 10 }),
    );

    if (mastered) {
      await unmarkLessonMastered(lessonId);
      setMastered(false);
    } else {
      await markLessonMastered(lessonId);
      setMastered(true);
    }
  }, [lessonId, mastered]);

  // Guard: lesson not found
  if (!lesson || !category) {
    return (
      <SafeAreaView
        style={[styles.root, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: theme.colors.textSecondary }]}>
            Lesson not found.
          </Text>
          <Pressable onPress={() => router.back()}>
            <Text style={[styles.backLink, { color: theme.colors.primary }]}>
              ← Go back
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const accentColor = category.color;

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Gradient header ── */}
        <LinearGradient
          colors={[accentColor, accentColor + 'AA']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.header}
        >
          {/* Back button */}
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backArrow}>‹</Text>
            <Text style={styles.backLabel}>Hangul</Text>
          </Pressable>

          {/* Category pill */}
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{category.title}</Text>
          </View>

          {/* Large glyph */}
          <Animated.Text style={[styles.largeGlyph, glyphStyle]}>
            {lesson.glyph}
          </Animated.Text>

          {/* Mastered badge overlay */}
          {mastered && (
            <View style={styles.masteredOverlay}>
              <Text style={styles.masteredOverlayText}>✓ Mastered</Text>
            </View>
          )}
        </LinearGradient>

        {/* ── Body ── */}
        <View
          style={[
            styles.body,
            { backgroundColor: theme.colors.background },
          ]}
        >
          {/* Pronunciation card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                ...theme.shadow.sm,
              },
            ]}
          >
            <Text
              style={[
                styles.cardLabel,
                { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.xxs },
              ]}
            >
              PRONUNCIATION
            </Text>
            <View style={styles.pronRow}>
              <View style={styles.pronBlock}>
                <Text
                  style={[
                    styles.pronValue,
                    { color: accentColor, fontSize: theme.typography.fontSize['2xl'] },
                  ]}
                >
                  {lesson.romanisation}
                </Text>
                <Text
                  style={[
                    styles.pronSub,
                    { color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.sm },
                  ]}
                >
                  Romanisation
                </Text>
              </View>
              <View style={styles.pronDivider} />
              <View style={styles.pronBlock}>
                <Text
                  style={[
                    styles.pronValue,
                    { color: theme.colors.text, fontSize: theme.typography.fontSize['2xl'] },
                  ]}
                >
                  {lesson.ipa}
                </Text>
                <Text
                  style={[
                    styles.pronSub,
                    { color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.sm },
                  ]}
                >
                  IPA
                </Text>
              </View>
            </View>
          </View>

          {/* Example word card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                ...theme.shadow.sm,
              },
            ]}
          >
            <Text
              style={[
                styles.cardLabel,
                { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.xxs },
              ]}
            >
              EXAMPLE WORD
            </Text>
            <Text
              style={[
                styles.exampleKorean,
                { color: accentColor, fontSize: theme.typography.fontSize['3xl'] },
              ]}
            >
              {lesson.exampleWord.korean}
            </Text>
            <Text
              style={[
                styles.exampleRoman,
                { color: theme.colors.textSecondary, fontSize: theme.typography.fontSize.md },
              ]}
            >
              {lesson.exampleWord.romanisation}
            </Text>
            <View
              style={[
                styles.meaningBadge,
                { backgroundColor: accentColor + '15' },
              ]}
            >
              <Text
                style={[
                  styles.meaningText,
                  { color: accentColor, fontSize: theme.typography.fontSize.sm },
                ]}
              >
                {lesson.exampleWord.meaning}
              </Text>
            </View>
          </View>

          {/* Stroke order placeholder */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                ...theme.shadow.sm,
              },
            ]}
          >
            <Text
              style={[
                styles.cardLabel,
                { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.xxs },
              ]}
            >
              STROKE ORDER
            </Text>
            <View
              style={[
                styles.strokePlaceholder,
                { backgroundColor: accentColor + '0D', borderColor: accentColor + '30' },
              ]}
            >
              <Text style={styles.strokeEmoji}>✏️</Text>
              <Text
                style={[
                  styles.strokePlaceholderText,
                  { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.sm },
                ]}
              >
                Stroke order animation
              </Text>
              <Text
                style={[
                  styles.strokePlaceholderSub,
                  { color: theme.colors.textMuted, fontSize: theme.typography.fontSize.xs },
                ]}
              >
                Coming soon
              </Text>
            </View>
          </View>

          {/* Mark as Mastered button */}
          <Animated.View style={[styles.buttonWrapper, buttonStyle]}>
            <Pressable
              onPress={handleMastered}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel={mastered ? 'Unmark as mastered' : 'Mark as mastered'}
              style={({ pressed }) => [pressed && { opacity: 0.88 }]}
            >
              {mastered ? (
                /* Already mastered — outlined style */
                <View
                  style={[
                    styles.button,
                    styles.buttonOutlined,
                    {
                      borderColor: accentColor,
                      backgroundColor: accentColor + '10',
                    },
                  ]}
                >
                  <Text style={[styles.buttonIcon]}>✓</Text>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: accentColor, fontSize: theme.typography.fontSize.md },
                    ]}
                  >
                    Mastered!
                  </Text>
                  <Text
                    style={[
                      styles.buttonSubText,
                      { color: accentColor + 'AA', fontSize: theme.typography.fontSize.xs },
                    ]}
                  >
                    Tap to unmark
                  </Text>
                </View>
              ) : (
                /* Not yet mastered — filled gradient */
                <LinearGradient
                  colors={[accentColor, accentColor + 'CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.button, theme.shadow.md]}
                >
                  <Text style={styles.buttonIcon}>🎯</Text>
                  <Text
                    style={[
                      styles.buttonText,
                      { color: '#FFFFFF', fontSize: theme.typography.fontSize.md },
                    ]}
                  >
                    Mark as Mastered
                  </Text>
                </LinearGradient>
              )}
            </Pressable>
          </Animated.View>
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

  // Not found
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontSize: 16 },
  backLink: { fontSize: 15, fontWeight: '600' },

  // Header
  header: {
    paddingTop: Platform.OS === 'android' ? 16 : 12,
    paddingBottom: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 12,
    position: 'relative',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 4,
  },
  backArrow: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: 32,
    marginTop: -2,
  },
  backLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  categoryPill: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 14,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  largeGlyph: {
    fontSize: 120,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 140,
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  masteredOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  masteredOverlayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Body
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 48,
    gap: 14,
  },

  // Cards
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 10,
  },
  cardLabel: {
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '600',
  },

  // Pronunciation
  pronRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  pronBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  pronValue: {
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  pronSub: {
    letterSpacing: 0.1,
  },
  pronDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },

  // Example word
  exampleKorean: {
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  exampleRoman: {
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  meaningBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 2,
  },
  meaningText: {
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  // Stroke order
  strokePlaceholder: {
    height: 140,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  strokeEmoji: { fontSize: 28 },
  strokePlaceholderText: {
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  strokePlaceholderSub: {
    letterSpacing: 0.2,
  },

  // Mastered button
  buttonWrapper: {
    marginTop: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 10,
  },
  buttonOutlined: {
    borderWidth: 2,
  },
  buttonIcon: {
    fontSize: 20,
  },
  buttonText: {
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  buttonSubText: {
    position: 'absolute',
    bottom: 8,
    letterSpacing: 0.2,
  },
});
