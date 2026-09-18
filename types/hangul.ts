/**
 * Core domain types for Hangul characters and lessons.
 */

/** A single Hangul character unit (consonant or vowel). */
export interface HangulCharacter {
  /** The actual Hangul glyph, e.g. "ㄱ" */
  glyph: string;
  /** Romanisation, e.g. "g/k" */
  romanisation: string;
  /** IPA pronunciation, e.g. "/k/" */
  ipa: string;
  /** Whether this is a consonant or vowel */
  type: 'consonant' | 'vowel';
  /** Initial (초성), medial (중성), or final (종성) position */
  position: 'initial' | 'medial' | 'final' | 'all';
  /** Stroke order image path (relative to assets) */
  strokeOrderAsset?: string;
  /** Audio pronunciation asset path */
  audioAsset?: string;
}

/** A composed Hangul syllable block. */
export interface HangulSyllable {
  /** The composed syllable glyph, e.g. "가" */
  glyph: string;
  /** Initial consonant */
  initial: HangulCharacter;
  /** Medial vowel */
  medial: HangulCharacter;
  /** Optional final consonant */
  final?: HangulCharacter;
  /** Romanised form */
  romanisation: string;
}

/** A lesson grouping related characters together. */
export interface HangulLesson {
  id: string;
  title: string;
  description: string;
  characters: HangulCharacter[];
  order: number;
  isUnlocked: boolean;
}
