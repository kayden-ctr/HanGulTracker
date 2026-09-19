/**
 * Flashcard Familiarity Service
 *
 * Stores a familiarity score (0–5) per vocabulary item id.
 *
 *   0 = never seen
 *   1 = Again  (completely wrong)
 *   2 = Hard   (wrong but familiar)
 *   3 = Good   (correct with effort)
 *   4 = Easy   (correct immediately)
 *   5 = Perfect (several Easy in a row)
 *
 * Rating logic:
 *   Again → max(0, current - 2)
 *   Good  → min(5, current + 1)
 *   Easy  → min(5, current + 2)
 */

import { getItem, setItem, STORAGE_KEYS } from '@/services/storage';

export type FamiliarityMap = Record<string, number>;

export type FlashcardRating = 'again' | 'good' | 'easy';

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

export async function getFamiliarityMap(): Promise<FamiliarityMap> {
  return (await getItem<FamiliarityMap>(STORAGE_KEYS.FLASHCARD_FAMILIARITY)) ?? {};
}

export async function getFamiliarity(itemId: string): Promise<number> {
  const map = await getFamiliarityMap();
  return map[itemId] ?? 0;
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

/**
 * Apply a rating to a vocabulary item and persist the updated score.
 * Returns the new familiarity score.
 */
export async function rateCard(
  itemId: string,
  rating: FlashcardRating,
): Promise<number> {
  const map = await getFamiliarityMap();
  const current = map[itemId] ?? 0;

  let next: number;
  switch (rating) {
    case 'again':
      next = Math.max(0, current - 2);
      break;
    case 'good':
      next = Math.min(5, current + 1);
      break;
    case 'easy':
      next = Math.min(5, current + 2);
      break;
  }

  map[itemId] = next;
  await setItem(STORAGE_KEYS.FLASHCARD_FAMILIARITY, map);
  return next;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Weighted random selection — items with lower familiarity appear more often.
 * Weight = 6 - familiarity  (score 0 → weight 6, score 5 → weight 1)
 */
export function weightedRandom<T extends { id: string }>(
  items: T[],
  familiarityMap: FamiliarityMap,
): T {
  const weights = items.map((item) => 6 - (familiarityMap[item.id] ?? 0));
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return items[i];
  }
  return items[items.length - 1];
}

/** Returns the average familiarity across all provided item ids (0–5). */
export function averageFamiliarity(
  itemIds: string[],
  familiarityMap: FamiliarityMap,
): number {
  if (itemIds.length === 0) return 0;
  const total = itemIds.reduce((acc, id) => acc + (familiarityMap[id] ?? 0), 0);
  return total / itemIds.length;
}
