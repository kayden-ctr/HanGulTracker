/**
 * Core domain types for vocabulary items.
 */

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/** A single vocabulary word. */
export interface VocabularyItem {
  id: string;
  /** Korean word in Hangul */
  korean: string;
  /** English translation */
  english: string;
  /** Romanised pronunciation */
  romanisation: string;
  /** Example sentence in Korean */
  exampleSentence?: string;
  /** English translation of the example */
  exampleTranslation?: string;
  /** Audio asset path */
  audioAsset?: string;
  /** Illustration / image asset path */
  imageAsset?: string;
  difficulty: DifficultyLevel;
  tags: string[];
}

/** A themed vocabulary set (e.g. "Numbers", "Colors", "Food"). */
export interface VocabularySet {
  id: string;
  title: string;
  description: string;
  coverEmoji: string;
  items: VocabularyItem[];
  difficulty: DifficultyLevel;
  isUnlocked: boolean;
}
