/**
 * Core domain types for the quiz / flashcard engine.
 */

export type QuizMode = 'multiple-choice' | 'type-answer' | 'flashcard' | 'listening';
export type QuizItemType = 'character' | 'vocabulary';

export interface QuizQuestion {
  id: string;
  mode: QuizMode;
  itemType: QuizItemType;
  /** The prompt shown to the user (Hangul text or romanisation) */
  prompt: string;
  /** Correct answer string */
  answer: string;
  /** Distractor options for multiple-choice (includes correct answer) */
  options?: string[];
  /** Optional audio cue */
  audioAsset?: string;
}

export interface QuizSession {
  id: string;
  startedAt: string;
  completedAt?: string;
  mode: QuizMode;
  questions: QuizQuestion[];
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  givenAnswer: string;
  isCorrect: boolean;
  responseTimeMs: number;
}

export interface QuizResult {
  sessionId: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercent: number;
  xpEarned: number;
  durationMs: number;
}
