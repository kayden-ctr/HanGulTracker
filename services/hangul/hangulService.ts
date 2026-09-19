/**
 * Hangul Lesson Storage Service
 *
 * Manages which lesson characters the user has marked as mastered,
 * persisted to AsyncStorage as a string array of lesson ids.
 *
 * All functions are async-safe and return sensible defaults on error.
 */

import { getItem, setItem, STORAGE_KEYS } from '@/services/storage';

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

/** Returns the full set of mastered lesson ids. */
export async function getMasteredLessons(): Promise<Set<string>> {
  const raw = await getItem<string[]>(STORAGE_KEYS.MASTERED_LESSONS);
  return new Set(raw ?? []);
}

/** Returns true if the given lesson id has been mastered. */
export async function isLessonMastered(lessonId: string): Promise<boolean> {
  const mastered = await getMasteredLessons();
  return mastered.has(lessonId);
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

/** Marks a lesson as mastered. Idempotent — safe to call multiple times. */
export async function markLessonMastered(lessonId: string): Promise<void> {
  const mastered = await getMasteredLessons();
  if (mastered.has(lessonId)) return;
  mastered.add(lessonId);
  await setItem(STORAGE_KEYS.MASTERED_LESSONS, Array.from(mastered));
}

/** Unmarks a lesson (useful for reset / debug flows). */
export async function unmarkLessonMastered(lessonId: string): Promise<void> {
  const mastered = await getMasteredLessons();
  mastered.delete(lessonId);
  await setItem(STORAGE_KEYS.MASTERED_LESSONS, Array.from(mastered));
}

// ---------------------------------------------------------------------------
// Aggregates
// ---------------------------------------------------------------------------

/**
 * Returns the number of mastered lessons within a category.
 * Pass the full array of lesson ids for that category.
 */
export async function getMasteredCountForCategory(
  categoryLessonIds: string[],
): Promise<number> {
  const mastered = await getMasteredLessons();
  return categoryLessonIds.filter((id) => mastered.has(id)).length;
}
