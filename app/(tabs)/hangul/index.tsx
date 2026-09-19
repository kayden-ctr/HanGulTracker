/**
 * Learn Hangul — Category List Screen
 * Route: /(tabs)/hangul
 *
 * Shows 4 lesson category sections. Each section has a header with
 * the category name, colour, difficulty, and completion count, followed
 * by a horizontal scroll of LessonCards.
 *
 * Mastery state is loaded from AsyncStorage on focus so it stays in sync
 * after the user returns from a detail screen.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';

import { useAppTheme } from '@/hooks/useAppTheme';
import { LessonCard } from '@/components/LessonCard';
import {
  LESSON_CATEGORIES,
  getLessonsByCategory,
  type LessonCategory,
  type HangulLesson,
} from '@/data/hangulCharacters';
import { getMasteredLessons } from '@/services/hangul';

// ---------------------------------------------------------------------------
// Category section component
// ---------------------------------------------------------------------------

interface CategorySectionProps {
  category: LessonCategory;
  lessons: HangulLesson[];
  masteredIds: Set<string>;
}

function CategorySection({ category, lessons, masteredIds }: CategorySectionProps) {
  const theme = useAppTheme();
  const router = useRouter();
  const masteredCount = lessons.filter((l) => masteredIds.has(l.id)).length;
  const pct = lessons.length > 0 ? Math.round((masteredCount / lessons.length) * 100) : 0;

  const DIFF_COLOR: Record<LessonCategory['difficulty'], string> = {
    beginner: theme.colors.success,
    intermediate: '#F97316',
    advanced: '#8B5CF6',
  };

  return (
    <View style={styles.section}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          {/* Icon badge */}
          <View
            style={[
              styles.catIcon,
              { backgroundColor: category.color + '18' },
            ]}
          >
            <Text style={[styles.catIconText, { color: category.color }]}>
              {category.icon}
            </Text>
          </View>

          <View style={styles.sectionTitleBlock}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: theme.colors.text,
                  fontWeight: theme.typography.fontWeight.bold,
                  fontSize: theme.typography.fontSize.md,
                },
              ]}
            >
              {category.title}
            </Text>
            <Text
              style={[
                styles.sectionSub,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.fontSize.xs,
                },
              ]}
            >
              {category.koreanTitle} · {lessons.length} characters
            </Text>
          </View>
        </View>

        {/* Right side: diff badge + completion */}
        <View style={styles.sectionMeta}>
          <View
            style={[
              styles.diffBadge,
              { backgroundColor: DIFF_COLOR[category.difficulty] + '18' },
            ]}
          >
            <Text
              style={[
                styles.diffText,
                {
                  color: DIFF_COLOR[category.difficulty],
                  fontSize: theme.typography.fontSize.xxs,
                  fontWeight: theme.typography.fontWeight.semibold,
                },
              ]}
            >
              {category.difficulty.charAt(0).toUpperCase() +
                category.difficulty.slice(1)}
            </Text>
          </View>
          <Text
            style={[
              styles.pctText,
              {
                color: category.color,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.bold,
              },
            ]}
          >
            {pct}%
          </Text>
        </View>
      </View>

      {/* Mini progress bar */}
      <View
        style={[
          styles.catProgressTrack,
          { backgroundColor: theme.colors.surfaceSecondary },
        ]}
      >
        <View
          style={[
            styles.catProgressFill,
            {
              backgroundColor: category.color,
              width: `${pct}%` as any,
            },
          ]}
        />
      </View>

      {/* Horizontal lesson cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardRow}
      >
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            isMastered={masteredIds.has(lesson.id)}
            accentColor={category.color}
            onPress={() =>
              router.push({
                pathname: '/(tabs)/hangul/[lessonId]',
                params: { lessonId: lesson.id },
              })
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function HangulScreen() {
  const theme = useAppTheme();
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  // Reload mastery state every time this screen comes into focus
  useFocusEffect(
    useCallback(() => {
      getMasteredLessons().then(setMasteredIds);
    }, []),
  );

  // Total mastered count across all categories
  const totalLessons = LESSON_CATEGORIES.reduce(
    (acc, cat) => acc + getLessonsByCategory(cat.id).length,
    0,
  );
  const totalMastered = masteredIds.size;

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        stickyHeaderIndices={[0]}
      >
        {/* Gradient header */}
        <LinearGradient
          colors={['#099FFC', '#B4F2FC']}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.9, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Learn Hangul</Text>
          <Text style={styles.headerSub}>한글 배우기</Text>
          <View style={styles.headerPillRow}>
            <View style={styles.headerPill}>
              <Text style={styles.headerPillText}>
                {totalMastered} / {totalLessons} mastered
              </Text>
            </View>
            <View style={styles.headerPill}>
              <Text style={styles.headerPillText}>
                {totalLessons - totalMastered} remaining
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Category sections */}
        <View
          style={[
            styles.body,
            { backgroundColor: theme.colors.background },
          ]}
        >
          {LESSON_CATEGORIES.map((cat) => (
            <CategorySection
              key={cat.id}
              category={cat}
              lessons={getLessonsByCategory(cat.id)}
              masteredIds={masteredIds}
            />
          ))}
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
    paddingBottom: 28,
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
    fontSize: 15,
    color: 'rgba(255,255,255,0.82)',
    fontWeight: '400',
    marginBottom: 10,
  },
  headerPillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  headerPill: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  headerPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },

  // Body
  body: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 32,
    gap: 4,
  },

  // Section
  section: {
    paddingTop: 20,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  catIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catIconText: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionTitleBlock: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    letterSpacing: -0.2,
  },
  sectionSub: {
    letterSpacing: 0.1,
  },
  sectionMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  diffBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  diffText: {
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  pctText: {
    letterSpacing: -0.3,
  },

  // Category progress bar
  catProgressTrack: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  catProgressFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Card row
  cardRow: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: 10,
  },
});
