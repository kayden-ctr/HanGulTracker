/**
 * Navigation types for Expo Router typed routes.
 *
 * As screens are added under app/, extend these types to keep
 * route params type-safe throughout the app.
 */

export type RootTabParamList = {
  index: undefined;
  hangul: undefined;
  vocabulary: undefined;
  quiz: undefined;
  progress: undefined;
};

export type HangulStackParamList = {
  index: undefined;
  lesson: { lessonId: string };
  character: { glyph: string };
};

export type VocabularyStackParamList = {
  index: undefined;
  set: { setId: string };
  word: { wordId: string };
};

export type QuizStackParamList = {
  index: undefined;
  session: { mode: string; itemType: string };
  result: { sessionId: string };
};
