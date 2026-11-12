import { describe, expect, it } from "vitest";
import { events, getEntity, quizQuestions } from "@/data";
import type { QuizQuestion } from "@/data/schema";
import { compareEntities, durationOf, overlapOf } from "@/lib/compare";
import { filterQuestions, isCorrect, scoreQuiz, shuffleWithSeed } from "@/lib/quiz";

const entity = (id: string) => getEntity(id)!;

describe("comparison logic", () => {
  it("flags different kinds of entity", () => {
    expect(compareEntities(entity("ancient-egypt"), entity("achaemenid-empire"), events).sameKind).toBe(false);
    expect(compareEntities(entity("han-dynasty"), entity("roman-empire"), events).sameKind).toBe(false);
    expect(compareEntities(entity("achaemenid-empire"), entity("sasanian-empire"), events).sameKind).toBe(true);
  });

  it("computes durations across the BCE/CE boundary", () => {
    expect(durationOf(entity("han-dynasty"))).toBe(425); // 206 BCE – 220 CE
    expect(durationOf(entity("achaemenid-empire"))).toBe(220); // 550 – 330 BCE
    expect(durationOf(entity("sasanian-empire"))).toBe(427); // 224 – 651 CE
  });

  it("finds the years two entities coexisted", () => {
    const overlap = overlapOf(entity("han-dynasty"), entity("roman-empire"));
    expect(overlap).toEqual({ start: -26, end: 220, years: 246 }); // 27 BCE – 220 CE
    const comparison = compareEntities(entity("roman-empire"), entity("sasanian-empire"), events);
    expect(comparison.overlap?.years).toBe(427);
    expect(comparison.gapYears).toBeNull();
  });

  it("reports the gap when they never coexisted", () => {
    const comparison = compareEntities(entity("achaemenid-empire"), entity("sasanian-empire"), events);
    expect(comparison.overlap).toBeNull();
    expect(comparison.gapYears).toBe(553); // 330 BCE → 224 CE
    // the same either way round
    expect(compareEntities(entity("sasanian-empire"), entity("achaemenid-empire"), events).gapYears).toBe(553);
  });

  it("counts a shared boundary year as coexistence", () => {
    // Macedon/Hellenistic begins 336 BCE; the Achaemenids end 330 BCE
    expect(overlapOf(entity("achaemenid-empire"), entity("macedon-hellenistic"))?.years).toBe(6);
  });

  it("collects shared events and recorded relations in both directions", () => {
    const comparison = compareEntities(entity("roman-empire"), entity("sasanian-empire"), events);
    expect(comparison.sharedEvents.map((e) => e.id)).toEqual(["battle-of-edessa"]);
    expect(comparison.relationAtoB?.type).toBe("rival");
    expect(comparison.relationBtoA?.type).toBe("rival");

    const unrelated = compareEntities(entity("maurya-empire"), entity("han-dynasty"), events);
    expect(unrelated.sharedEvents).toEqual([]);
    expect(unrelated.relationAtoB).toBeNull();
    expect(unrelated.relationBtoA).toBeNull();
  });
});

describe("quiz logic", () => {
  const sample = (id: string, correctIndex: number, extra: Partial<QuizQuestion> = {}): QuizQuestion => ({
    ...quizQuestions[0],
    id,
    correctIndex,
    ...extra,
  });

  it("recognises correct and incorrect answers", () => {
    const question = sample("q", 2);
    expect(isCorrect(question, 2)).toBe(true);
    expect(isCorrect(question, 0)).toBe(false);
    expect(isCorrect(question, null)).toBe(false);
    expect(isCorrect(question, undefined)).toBe(false);
  });

  it("scores a full round", () => {
    const questions = [sample("a", 0), sample("b", 1), sample("c", 2), sample("d", 3)];
    const result = scoreQuiz(questions, { a: 0, b: 1, c: 0, d: 3 });
    expect(result.score).toBe(3);
    expect(result.total).toBe(4);
    expect(result.ratio).toBe(0.75);
    expect(result.perQuestion.map((entry) => entry.correct)).toEqual([true, true, false, true]);
  });

  it("counts unanswered questions as wrong and ignores stray answers", () => {
    const questions = [sample("a", 0), sample("b", 1)];
    const result = scoreQuiz(questions, { a: 0, zzz: 1 });
    expect(result.score).toBe(1);
    expect(result.perQuestion[1]).toEqual({ questionId: "b", answerIndex: null, correct: false });
  });

  it("handles perfect, zero and empty rounds", () => {
    const questions = [sample("a", 0), sample("b", 1)];
    expect(scoreQuiz(questions, { a: 0, b: 1 }).ratio).toBe(1);
    expect(scoreQuiz(questions, { a: 3, b: 3 }).score).toBe(0);
    expect(scoreQuiz([], {})).toEqual({ score: 0, total: 0, ratio: 0, perQuestion: [] });
  });

  it("scores the real question set when every answer is right", () => {
    const answers = Object.fromEntries(quizQuestions.map((q) => [q.id, q.correctIndex]));
    expect(scoreQuiz(quizQuestions, answers).score).toBe(quizQuestions.length);
  });

  it("filters by category and difficulty", () => {
    expect(filterQuestions(quizQuestions, { category: "all", difficulty: "all" })).toHaveLength(quizQuestions.length);
    const easyPeople = filterQuestions(quizQuestions, { category: "people", difficulty: "easy" });
    expect(easyPeople.length).toBeGreaterThan(0);
    expect(easyPeople.every((q) => q.category === "people" && q.difficulty === "easy")).toBe(true);
    const byCategory = ["chronology", "people", "geography", "concepts"] as const;
    const total = byCategory.reduce((sum, category) => sum + filterQuestions(quizQuestions, { category, difficulty: "all" }).length, 0);
    expect(total).toBe(quizQuestions.length);
  });

  it("shuffles deterministically without losing or duplicating questions", () => {
    const first = shuffleWithSeed(quizQuestions, 42).map((q) => q.id);
    const again = shuffleWithSeed(quizQuestions, 42).map((q) => q.id);
    const other = shuffleWithSeed(quizQuestions, 43).map((q) => q.id);
    expect(first).toEqual(again);
    expect(first).not.toEqual(other);
    expect([...first].sort()).toEqual(quizQuestions.map((q) => q.id).sort());
    // the input array is left untouched
    expect(quizQuestions.map((q) => q.id)).not.toEqual(first);
  });
});
