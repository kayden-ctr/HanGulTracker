/**
 * Core domain types for tracking user learning progress.
 */

/** Spaced-repetition review state for a single item. */
export interface ReviewState {
  itemId: string;
  /** ISO 8601 date string of next scheduled review */
  nextReviewAt: string;
  /** SM-2 interval in days */
  intervalDays: number;
  /** SM-2 easiness factor */
  easinessFactor: number;
  /** Total number of reviews performed */
  reviewCount: number;
  /** Consecutive correct answers */
  streak: number;
}

/** A record of a single review session event. */
export interface ReviewEvent {
  itemId: string;
  /** ISO 8601 timestamp */
  reviewedAt: string;
  /** 0 = again, 1 = hard, 2 = good, 3 = easy */
  rating: 0 | 1 | 2 | 3;
  responseTimeMs: number;
}

/** Aggregate progress statistics for the app overview. */
export interface ProgressStats {
  totalCharactersLearned: number;
  totalVocabularyLearned: number;
  totalQuizzesCompleted: number;
  currentStreakDays: number;
  longestStreakDays: number;
  /** ISO 8601 date of last study session */
  lastStudiedAt: string | null;
  /** XP points earned (for gamification) */
  totalXP: number;
}
