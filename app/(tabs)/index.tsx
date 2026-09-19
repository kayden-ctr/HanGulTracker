/**
 * Home Dashboard
 * Route: / (index tab)
 *
 * Layout (top → bottom):
 *   ┌─────────────────────────────────┐
 *   │  Gradient header                │
 *   │  Date · Welcome · Streak · XP   │
 *   ├─────────────────────────────────┤
 *   │  ScrollView body (white bg)     │
 *   │  ─ ContinueLearningButton       │
 *   │  ─ Stats grid (2×2)             │
 *   │  ─ Progress section             │
 *   │    ProgressCard × 3             │
 *   └─────────────────────────────────┘
 *
 * All data is mock — replace with AsyncStorage / context reads later.
 */

import { ScrollView, View, Text, Image, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { useAppTheme } from '@/hooks/useAppTheme';
import { StatCard } from '@/components/StatCard';
import { ProgressCard } from '@/components/ProgressCard';
import { ContinueLearningButton } from '@/components/ContinueLearningButton';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_USER_NAME = 'Dimas';

const MOCK_STATS = {
  currentStreakDays: 7,
  totalXP: 1_340,
  totalCharactersLearned: 24,
  totalCharacters: 40,          // full Hangul alphabet (basic)
  totalVocabularyLearned: 58,
  totalVocabulary: 200,
  totalQuizzesCompleted: 12,
  overallProgress: 58,          // overall % out of 100
  totalProgress: 100,
  lastStudiedAt: new Date().toISOString(),
  xpToday: 120,
};

const MOCK_NEXT_LESSON = {
  title: 'Double Consonants',
  description: 'ㄲ  ㄸ  ㅃ  ㅆ  ㅉ — tense sounds',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Gradient header — date, greeting, streak pill, XP pill */
function DashboardHeader() {
  const today = formatDate(new Date());
  const greeting = getGreeting();

  return (
    <LinearGradient
      colors={['#099FFC', '#B4F2FC']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={styles.header}
    >
      {/* Mascot — decorative, anchored bottom-right */}
      <Image
        source={require('../../assets/images/Mascot.png')}
        style={styles.mascot}
        resizeMode="contain"
      />

      {/* Date */}
      <Text style={styles.headerDate}>{today}</Text>

      {/* Greeting + name */}
      <Text style={styles.headerGreeting}>
        {greeting},{'\n'}
        <Text style={styles.headerName}>{MOCK_USER_NAME}</Text>
      </Text>

      <Text style={styles.headerSub}>
        Keep up the great work on your Korean journey!
      </Text>

      {/* Pill row */}
      <View style={styles.pillRow}>
        <View style={styles.pill}>
          <Text style={styles.pillEmoji}>🔥</Text>
          <Text style={styles.pillText}>
            {MOCK_STATS.currentStreakDays} day streak
          </Text>
        </View>

        <View style={styles.pill}>
          <Text style={styles.pillEmoji}>⚡</Text>
          <Text style={styles.pillText}>
            {MOCK_STATS.totalXP.toLocaleString()} XP
          </Text>
        </View>

        <View style={styles.pill}>
          <Text style={styles.pillEmoji}>📅</Text>
          <Text style={styles.pillText}>
            +{MOCK_STATS.xpToday} today
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

/** Section heading */
function SectionTitle({ title }: { title: string }) {
  const theme = useAppTheme();
  return (
    <Text
      style={[
        styles.sectionTitle,
        {
          color: theme.colors.text,
          fontSize: theme.typography.fontSize.md,
          fontWeight: theme.typography.fontWeight.bold,
        },
      ]}
    >
      {title}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function HomeScreen() {
  const theme = useAppTheme();
  const router = useRouter();

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
        {/* ── Sticky gradient header ── */}
        <DashboardHeader />

        {/* ── Body ── */}
        <View
          style={[
            styles.body,
            { backgroundColor: theme.colors.background },
          ]}
        >

          {/* Continue Learning */}
          <ContinueLearningButton
            lessonTitle={MOCK_NEXT_LESSON.title}
            description={MOCK_NEXT_LESSON.description}
            onPress={() => {
              // Navigate to Hangul tab when lessons are implemented
              router.push('/(tabs)/hangul');
            }}
          />

          {/* Stats grid */}
          <SectionTitle title="Your Stats" />
          <View style={styles.statsGrid}>
            <StatCard
              icon="🔥"
              value={MOCK_STATS.currentStreakDays}
              unit="days"
              label="Daily Streak"
              accentColor="#F97316"
              trend={2}
            />
            <StatCard
              icon="⚡"
              value={MOCK_STATS.totalXP.toLocaleString()}
              unit="XP"
              label="Total XP"
              accentColor="#099FFC"
              trend={MOCK_STATS.xpToday}
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              icon="🧩"
              value={MOCK_STATS.totalQuizzesCompleted}
              label="Quizzes Done"
              accentColor="#8B5CF6"
            />
            <StatCard
              icon="📅"
              value={MOCK_STATS.xpToday}
              unit="XP"
              label="Earned Today"
              accentColor="#22C55E"
              trend={MOCK_STATS.xpToday - 80}
            />
          </View>

          {/* Progress section */}
          <SectionTitle title="Your Progress" />

          <ProgressCard
            icon="📊"
            label="Overall Progress"
            current={MOCK_STATS.overallProgress}
            total={MOCK_STATS.totalProgress}
            unit="%"
            accentColor="#099FFC"
          />

          <ProgressCard
            icon="한"
            label="Hangul Mastered"
            current={MOCK_STATS.totalCharactersLearned}
            total={MOCK_STATS.totalCharacters}
            unit="characters"
            accentColor="#2FADFC"
          />

          <ProgressCard
            icon="📚"
            label="Vocabulary Mastered"
            current={MOCK_STATS.totalVocabularyLearned}
            total={MOCK_STATS.totalVocabulary}
            unit="words"
            accentColor="#8B5CF6"
          />

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },

  // ── Header ──
  header: {
    paddingTop: Platform.OS === 'android' ? 16 : 12,
    paddingBottom: 28,
    paddingHorizontal: 20,
    gap: 4,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  },
  mascot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 110,
    height: 110,
  },
  headerDate: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.80)',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  headerGreeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  headerName: {
    fontWeight: '800',
  },
  headerSub: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.80)',
    marginTop: 2,
    marginBottom: 14,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 11,
  },
  pillEmoji: {
    fontSize: 13,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.1,
  },

  // ── Body ──
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 12,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
});
