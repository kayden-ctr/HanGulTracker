/**
 * HanGul Tracker — Hangul Character Data
 *
 * Four lesson categories:
 *   1. Basic Consonants  (기본 자음)  — 14 characters
 *   2. Basic Vowels      (기본 모음)  — 10 characters
 *   3. Double Consonants (쌍자음)    — 5 characters
 *   4. Compound Vowels   (복합 모음)  — 11 characters
 *
 * Each entry extends HangulCharacter with extra lesson metadata:
 *   difficulty  — 'beginner' | 'intermediate' | 'advanced'
 *   exampleWord — { korean, romanisation, meaning }
 *   categoryId  — links back to LESSON_CATEGORIES
 */

import type { HangulCharacter } from '@/types/hangul';

// ---------------------------------------------------------------------------
// Extended type (local — no need to pollute the global type yet)
// ---------------------------------------------------------------------------

export interface HangulLesson extends HangulCharacter {
  id: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  categoryId: string;
  exampleWord: {
    korean: string;
    romanisation: string;
    meaning: string;
  };
}

// ---------------------------------------------------------------------------
// Lesson categories
// ---------------------------------------------------------------------------

export interface LessonCategory {
  id: string;
  title: string;
  koreanTitle: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;
  color: string;
}

export const LESSON_CATEGORIES: LessonCategory[] = [
  {
    id: 'basic-consonants',
    title: 'Basic Consonants',
    koreanTitle: '기본 자음',
    description: 'The 14 foundational consonants of Hangul.',
    difficulty: 'beginner',
    icon: 'ㄱ',
    color: '#099FFC',
  },
  {
    id: 'basic-vowels',
    title: 'Basic Vowels',
    koreanTitle: '기본 모음',
    description: 'The 10 core vowels used in every syllable.',
    difficulty: 'beginner',
    icon: 'ㅏ',
    color: '#22C55E',
  },
  {
    id: 'double-consonants',
    title: 'Double Consonants',
    koreanTitle: '쌍자음',
    description: '5 tense consonants formed by doubling.',
    difficulty: 'intermediate',
    icon: 'ㄲ',
    color: '#F97316',
  },
  {
    id: 'compound-vowels',
    title: 'Compound Vowels',
    koreanTitle: '복합 모음',
    description: '11 vowels created by combining basic vowels.',
    difficulty: 'advanced',
    icon: 'ㅘ',
    color: '#8B5CF6',
  },
];

// ---------------------------------------------------------------------------
// 1. Basic Consonants — 기본 자음
// ---------------------------------------------------------------------------

export const BASIC_CONSONANTS: HangulLesson[] = [
  {
    id: 'g-k',
    glyph: 'ㄱ',
    romanisation: 'g / k',
    ipa: '/k/',
    type: 'consonant',
    position: 'initial',
    categoryId: 'basic-consonants',
    difficulty: 'beginner',
    exampleWord: { korean: '가방', romanisation: 'gabang', meaning: 'bag' },
  },
  {
    id: 'n',
    glyph: 'ㄴ',
    romanisation: 'n',
    ipa: '/n/',
    type: 'consonant',
    position: 'initial',
    categoryId: 'basic-consonants',
    difficulty: 'beginner',
    exampleWord: { korean: '나무', romanisation: 'namu', meaning: 'tree' },
  },
  {
    id: 'd-t',
    glyph: 'ㄷ',
    romanisation: 'd / t',
    ipa: '/t/',
    type: 'consonant',
    position: 'initial',
    categoryId: 'basic-consonants',
    difficulty: 'beginner',
    exampleWord: { korean: '다리', romanisation: 'dari', meaning: 'leg / bridge' },
  },
  {
    id: 'r-l',
    glyph: 'ㄹ',
    romanisation: 'r / l',
    ipa: '/ɾ/',
    type: 'consonant',
    position: 'initial',
    categoryId: 'basic-consonants',
    difficulty: 'beginner',
    exampleWord: { korean: '라면', romanisation: 'ramyeon', meaning: 'ramen' },
  },
  {
    id: 'm',
    glyph: 'ㅁ',
    romanisation: 'm',
    ipa: '/m/',
    type: 'consonant',
    position: 'initial',
    categoryId: 'basic-consonants',
    difficulty: 'beginner',
    exampleWord: { korean: '마음', romanisation: 'maeum', meaning: 'heart / mind' },
  },
  {
    id: 'b-p',
    glyph: 'ㅂ',
    romanisation: 'b / p',
    ipa: '/p/',
    type: 'consonant',
    position: 'initial',
    categoryId: 'basic-consonants',
    difficulty: 'beginner',
    exampleWord: { korean: '바나나', romanisation: 'banana', meaning: 'banana' },
  },
  {
    id: 's',
    glyph: 'ㅅ',
    romanisation: 's',
    ipa: '/s/',
    type: 'consonant',
    position: 'initial',
    categoryId: 'basic-consonants',
    difficulty: 'beginner',
    exampleWord: { korean: '사랑', romanisation: 'sarang', meaning: 'love' },
  },
  {
    id: 'ng',
    glyph: 'ㅇ',
    romanisation: 'ng / silent',
    ipa: '/ŋ/',
    type: 'consonant',
    position: 'all',
    categoryId: 'basic-consonants',
    difficulty: 'beginner',
    exampleWord: { korean: '아이', romanisation: 'ai', meaning: 'child' },
  },
  {
    id: 'j',
    glyph: 'ㅈ',
    romanisation: 'j',
    ipa: '/tɕ/',
    type: 'consonant',
    position: 'initial',
    categoryId: 'basic-consonants',
    difficulty: 'beginner',
    exampleWord: { korean: '자동차', romanisation: 'jadongcha', meaning: 'car' },
  },
  {
    id: 'ch',
    glyph: 'ㅊ',
    romanisation: 'ch',
    ipa: '/tɕʰ/',
    type: 'consonant',
    position: 'initial',
    categoryId: 'basic-consonants',
    difficulty: 'beginner',
    exampleWord: { korean: '차', romanisation: 'cha', meaning: 'tea / car' },
  },
  {
    id: 'k',
    glyph: 'ㅋ',
    romanisation: 'k',
    ipa: '/kʰ/',
    type: 'consonant',
    position: 'initial',
    categoryId: 'basic-consonants',
    difficulty: 'beginner',
    exampleWord: { korean: '코', romanisation: 'ko', meaning: 'nose' },
  },
  {
    id: 't',
    glyph: 'ㅌ',
    romanisation: 't',
    ipa: '/tʰ/',
    type: 'consonant',
    position: 'initial',
    categoryId: 'basic-consonants',
    difficulty: 'beginner',
    exampleWord: { korean: '타다', romanisation: 'tada', meaning: 'to ride' },
  },
  {
    id: 'p',
    glyph: 'ㅍ',
    romanisation: 'p',
    ipa: '/pʰ/',
    type: 'consonant',
    position: 'initial',
    categoryId: 'basic-consonants',
    difficulty: 'beginner',
    exampleWord: { korean: '파', romanisation: 'pa', meaning: 'green onion' },
  },
  {
    id: 'h',
    glyph: 'ㅎ',
    romanisation: 'h',
    ipa: '/h/',
    type: 'consonant',
    position: 'initial',
    categoryId: 'basic-consonants',
    difficulty: 'beginner',
    exampleWord: { korean: '하늘', romanisation: 'haneul', meaning: 'sky' },
  },
];

// ---------------------------------------------------------------------------
// 2. Basic Vowels — 기본 모음
// ---------------------------------------------------------------------------

export const BASIC_VOWELS: HangulLesson[] = [
  {
    id: 'a',
    glyph: 'ㅏ',
    romanisation: 'a',
    ipa: '/a/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'basic-vowels',
    difficulty: 'beginner',
    exampleWord: { korean: '아버지', romanisation: 'abeoji', meaning: 'father' },
  },
  {
    id: 'ya',
    glyph: 'ㅑ',
    romanisation: 'ya',
    ipa: '/ja/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'basic-vowels',
    difficulty: 'beginner',
    exampleWord: { korean: '야구', romanisation: 'yagu', meaning: 'baseball' },
  },
  {
    id: 'eo',
    glyph: 'ㅓ',
    romanisation: 'eo',
    ipa: '/ʌ/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'basic-vowels',
    difficulty: 'beginner',
    exampleWord: { korean: '어머니', romanisation: 'eomeoni', meaning: 'mother' },
  },
  {
    id: 'yeo',
    glyph: 'ㅕ',
    romanisation: 'yeo',
    ipa: '/jʌ/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'basic-vowels',
    difficulty: 'beginner',
    exampleWord: { korean: '여자', romanisation: 'yeoja', meaning: 'woman' },
  },
  {
    id: 'o',
    glyph: 'ㅗ',
    romanisation: 'o',
    ipa: '/o/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'basic-vowels',
    difficulty: 'beginner',
    exampleWord: { korean: '오리', romanisation: 'ori', meaning: 'duck' },
  },
  {
    id: 'yo',
    glyph: 'ㅛ',
    romanisation: 'yo',
    ipa: '/jo/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'basic-vowels',
    difficulty: 'beginner',
    exampleWord: { korean: '요리', romanisation: 'yori', meaning: 'cooking' },
  },
  {
    id: 'u',
    glyph: 'ㅜ',
    romanisation: 'u',
    ipa: '/u/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'basic-vowels',
    difficulty: 'beginner',
    exampleWord: { korean: '우유', romanisation: 'uyu', meaning: 'milk' },
  },
  {
    id: 'yu',
    glyph: 'ㅠ',
    romanisation: 'yu',
    ipa: '/ju/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'basic-vowels',
    difficulty: 'beginner',
    exampleWord: { korean: '유리', romanisation: 'yuri', meaning: 'glass' },
  },
  {
    id: 'eu',
    glyph: 'ㅡ',
    romanisation: 'eu',
    ipa: '/ɯ/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'basic-vowels',
    difficulty: 'beginner',
    exampleWord: { korean: '으뜸', romanisation: 'euddeum', meaning: 'the best' },
  },
  {
    id: 'i',
    glyph: 'ㅣ',
    romanisation: 'i',
    ipa: '/i/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'basic-vowels',
    difficulty: 'beginner',
    exampleWord: { korean: '이름', romanisation: 'ireum', meaning: 'name' },
  },
];

// ---------------------------------------------------------------------------
// 3. Double Consonants — 쌍자음
// ---------------------------------------------------------------------------

export const DOUBLE_CONSONANTS: HangulLesson[] = [
  {
    id: 'gg',
    glyph: 'ㄲ',
    romanisation: 'gg / kk',
    ipa: '/k͈/',
    type: 'consonant',
    position: 'initial',
    categoryId: 'double-consonants',
    difficulty: 'intermediate',
    exampleWord: { korean: '꿈', romanisation: 'kkum', meaning: 'dream' },
  },
  {
    id: 'dd',
    glyph: 'ㄸ',
    romanisation: 'dd / tt',
    ipa: '/t͈/',
    type: 'consonant',
    position: 'initial',
    categoryId: 'double-consonants',
    difficulty: 'intermediate',
    exampleWord: { korean: '딸기', romanisation: 'ttalgi', meaning: 'strawberry' },
  },
  {
    id: 'bb',
    glyph: 'ㅃ',
    romanisation: 'bb / pp',
    ipa: '/p͈/',
    type: 'consonant',
    position: 'initial',
    categoryId: 'double-consonants',
    difficulty: 'intermediate',
    exampleWord: { korean: '빵', romanisation: 'ppang', meaning: 'bread' },
  },
  {
    id: 'ss',
    glyph: 'ㅆ',
    romanisation: 'ss',
    ipa: '/s͈/',
    type: 'consonant',
    position: 'initial',
    categoryId: 'double-consonants',
    difficulty: 'intermediate',
    exampleWord: { korean: '씨', romanisation: 'ssi', meaning: 'seed / Mr/Ms' },
  },
  {
    id: 'jj',
    glyph: 'ㅉ',
    romanisation: 'jj',
    ipa: '/tɕ͈/',
    type: 'consonant',
    position: 'initial',
    categoryId: 'double-consonants',
    difficulty: 'intermediate',
    exampleWord: { korean: '짜다', romanisation: 'jjada', meaning: 'salty / to weave' },
  },
];

// ---------------------------------------------------------------------------
// 4. Compound Vowels — 복합 모음
// ---------------------------------------------------------------------------

export const COMPOUND_VOWELS: HangulLesson[] = [
  {
    id: 'ae',
    glyph: 'ㅐ',
    romanisation: 'ae',
    ipa: '/ɛ/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'compound-vowels',
    difficulty: 'advanced',
    exampleWord: { korean: '개', romanisation: 'gae', meaning: 'dog' },
  },
  {
    id: 'yae',
    glyph: 'ㅒ',
    romanisation: 'yae',
    ipa: '/jɛ/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'compound-vowels',
    difficulty: 'advanced',
    exampleWord: { korean: '얘기', romanisation: 'yaegi', meaning: 'story / chat' },
  },
  {
    id: 'e',
    glyph: 'ㅔ',
    romanisation: 'e',
    ipa: '/e/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'compound-vowels',
    difficulty: 'advanced',
    exampleWord: { korean: '세상', romanisation: 'sesang', meaning: 'world' },
  },
  {
    id: 'ye',
    glyph: 'ㅖ',
    romanisation: 'ye',
    ipa: '/je/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'compound-vowels',
    difficulty: 'advanced',
    exampleWord: { korean: '예쁘다', romanisation: 'yeppeuda', meaning: 'pretty' },
  },
  {
    id: 'wa',
    glyph: 'ㅘ',
    romanisation: 'wa',
    ipa: '/wa/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'compound-vowels',
    difficulty: 'advanced',
    exampleWord: { korean: '과일', romanisation: 'gwail', meaning: 'fruit' },
  },
  {
    id: 'wae',
    glyph: 'ㅙ',
    romanisation: 'wae',
    ipa: '/wɛ/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'compound-vowels',
    difficulty: 'advanced',
    exampleWord: { korean: '왜', romanisation: 'wae', meaning: 'why' },
  },
  {
    id: 'oe',
    glyph: 'ㅚ',
    romanisation: 'oe',
    ipa: '/we/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'compound-vowels',
    difficulty: 'advanced',
    exampleWord: { korean: '최고', romanisation: 'choego', meaning: 'the best' },
  },
  {
    id: 'wo',
    glyph: 'ㅝ',
    romanisation: 'wo',
    ipa: '/wʌ/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'compound-vowels',
    difficulty: 'advanced',
    exampleWord: { korean: '뭐', romanisation: 'mwo', meaning: 'what' },
  },
  {
    id: 'we',
    glyph: 'ㅞ',
    romanisation: 'we',
    ipa: '/we/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'compound-vowels',
    difficulty: 'advanced',
    exampleWord: { korean: '웨이터', romanisation: 'weiteo', meaning: 'waiter' },
  },
  {
    id: 'wi',
    glyph: 'ㅟ',
    romanisation: 'wi',
    ipa: '/wi/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'compound-vowels',
    difficulty: 'advanced',
    exampleWord: { korean: '위', romanisation: 'wi', meaning: 'above / stomach' },
  },
  {
    id: 'ui',
    glyph: 'ㅢ',
    romanisation: 'ui',
    ipa: '/ɯi/',
    type: 'vowel',
    position: 'medial',
    categoryId: 'compound-vowels',
    difficulty: 'advanced',
    exampleWord: { korean: '의사', romanisation: 'uisa', meaning: 'doctor' },
  },
];

// ---------------------------------------------------------------------------
// Combined exports
// ---------------------------------------------------------------------------

/** All lessons in a single flat array — useful for lookups by id */
export const ALL_LESSONS: HangulLesson[] = [
  ...BASIC_CONSONANTS,
  ...BASIC_VOWELS,
  ...DOUBLE_CONSONANTS,
  ...COMPOUND_VOWELS,
];

/** Lookup a lesson by its id */
export function getLessonById(id: string): HangulLesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

/** Get all lessons for a given category */
export function getLessonsByCategory(categoryId: string): HangulLesson[] {
  return ALL_LESSONS.filter((l) => l.categoryId === categoryId);
}

// Keep backward compat with original exports
export const CONSONANTS = BASIC_CONSONANTS;
export const VOWELS = BASIC_VOWELS;
