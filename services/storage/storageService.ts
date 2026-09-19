/**
 * StorageService
 *
 * A thin, typed wrapper around AsyncStorage.
 * All persistent data access should go through this service so the rest of
 * the app stays decoupled from the storage mechanism.
 *
 * Keys are namespaced with the STORAGE_KEYS constants below to avoid
 * collisions and make key management easy.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ---------------------------------------------------------------------------
// Storage key registry
// ---------------------------------------------------------------------------

export const STORAGE_KEYS = {
  /** User's overall progress stats */
  PROGRESS_STATS: '@hangul_tracker/progress_stats',
  /** Map of itemId → ReviewState for spaced repetition */
  REVIEW_STATES: '@hangul_tracker/review_states',
  /** Array of ReviewEvent objects (audit log) */
  REVIEW_HISTORY: '@hangul_tracker/review_history',
  /** User preferences (theme override, notification settings, etc.) */
  USER_PREFERENCES: '@hangul_tracker/user_preferences',
  /** Which lessons / vocabulary sets have been unlocked */
  UNLOCKED_CONTENT: '@hangul_tracker/unlocked_content',
  /** Whether the user has completed the onboarding flow */
  ONBOARDING_COMPLETE: '@hangul_tracker/onboarding_complete',
  /** Set of lesson ids the user has marked as mastered */
  MASTERED_LESSONS: '@hangul_tracker/mastered_lessons',
  /** Map of vocabularyItem id → familiarity score (0–5) */
  FLASHCARD_FAMILIARITY: '@hangul_tracker/flashcard_familiarity',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

// ---------------------------------------------------------------------------
// Generic helpers
// ---------------------------------------------------------------------------

/**
 * Read and deserialise a JSON value from storage.
 * Returns `null` if the key does not exist or parsing fails.
 */
export async function getItem<T>(key: StorageKey): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Serialise and write a value to storage.
 */
export async function setItem<T>(key: StorageKey, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

/**
 * Remove a key from storage.
 */
export async function removeItem(key: StorageKey): Promise<void> {
  await AsyncStorage.removeItem(key);
}

/**
 * Clear ALL app storage. Use only in development / reset flows.
 */
export async function clearAll(): Promise<void> {
  const keys = Object.values(STORAGE_KEYS) as StorageKey[];
  await AsyncStorage.multiRemove(keys);
}
