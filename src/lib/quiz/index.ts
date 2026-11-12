/**
 * Quiz logic: choosing questions and scoring answers.
 * No React here — the quiz page owns the screen, this file owns the rules.
 */
import type { QuizCategory, QuizDifficulty, QuizQuestion } from "@/data/schema";

export interface QuizSelection {
  category: QuizCategory | "all";
  difficulty: QuizDifficulty | "all";
}

export function filterQuestions(questions: readonly QuizQuestion[], selection: QuizSelection): QuizQuestion[] {
  return questions.filter(
    (question) =>
      (selection.category === "all" || question.category === selection.category) &&
      (selection.difficulty === "all" || question.difficulty === selection.difficulty),
  );
}

export function isCorrect(question: Pick<QuizQuestion, "correctIndex">, answerIndex: number | null | undefined): boolean {
  return answerIndex === question.correctIndex;
}

export interface QuizResult {
  score: number;
  total: number;
  /** Share of correct answers, 0–1 (0 when there are no questions). */
  ratio: number;
  perQuestion: { questionId: string; answerIndex: number | null; correct: boolean }[];
}

/** `answers` maps question id → chosen option index. Unanswered questions count as wrong. */
export function scoreQuiz(questions: readonly QuizQuestion[], answers: Readonly<Record<string, number>>): QuizResult {
  const perQuestion = questions.map((question) => {
    const answerIndex = answers[question.id] ?? null;
    return { questionId: question.id, answerIndex, correct: isCorrect(question, answerIndex) };
  });
  const score = perQuestion.filter((entry) => entry.correct).length;
  const total = questions.length;
  return { score, total, ratio: total === 0 ? 0 : score / total, perQuestion };
}

/**
 * Deterministic shuffle (Fisher–Yates driven by a small seeded generator).
 * The same seed always gives the same order, which keeps tests reproducible.
 */
export function shuffleWithSeed<T>(items: readonly T[], seed: number): T[] {
  const result = [...items];
  let state = seed >>> 0 || 1;
  const random = () => {
    // "mulberry32": a tiny, well-known pseudo-random generator
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
