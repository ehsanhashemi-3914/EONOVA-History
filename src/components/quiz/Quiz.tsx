"use client";

/**
 * The quiz, as a small state machine with three phases:
 *
 *   setup ──start──► playing ──last question──► result
 *     ▲                                            │
 *     └────────── change selection ◄───────────────┘
 *
 * The rules (which questions match, what counts as correct, the score) live in
 * src/lib/quiz and are unit-tested; this component only shows them.
 */
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { CircleCheck, CircleX, RotateCcw } from "lucide-react";
import { useI18n } from "@/i18n/LocaleProvider";
import { fill } from "@/i18n";
import { getEntity, getEvent, getPerson, getSources, quizQuestions } from "@/data";
import { quizCategorySchema, quizDifficultySchema, type QuizQuestion } from "@/data/schema";
import { filterQuestions, isCorrect, scoreQuiz, shuffleWithSeed, type QuizSelection } from "@/lib/quiz";
import { createLocalStore } from "@/lib/storage/local-store";
import { formatNumber } from "@/lib/dates";
import { cn } from "@/lib/cn";
import { Badge, Button } from "@/components/ui/primitives";

type Phase = "setup" | "playing" | "result";

/** Best results per selection, e.g. { "all|easy": { score: 6, total: 7 } }. */
type BestScores = Record<string, { score: number; total: number }>;

const NO_SCORES: BestScores = {};

const bestScoreStore = createLocalStore<BestScores>("eonova-quiz-best", NO_SCORES, (value): value is BestScores => {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(
      (entry) => typeof entry === "object" && entry !== null && typeof entry.score === "number" && typeof entry.total === "number",
    )
  );
});

function relatedLink(question: QuizQuestion, locale: "fa" | "en"): { href: string; label: string } | null {
  const { type, id } = question.related;
  if (type === "entity") {
    const entity = getEntity(id);
    return entity ? { href: `/entities/${entity.slug}`, label: entity.name[locale] } : null;
  }
  if (type === "event") {
    const event = getEvent(id);
    return event ? { href: `/events/${event.slug}`, label: event.title[locale] } : null;
  }
  const person = getPerson(id);
  return person ? { href: `/people/${person.slug}`, label: person.name[locale] } : null;
}

export function Quiz() {
  const { t, locale } = useI18n();
  const [phase, setPhase] = useState<Phase>("setup");
  const [selection, setSelection] = useState<QuizSelection>({ category: "all", difficulty: "all" });
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const bestScores = useSyncExternalStore(bestScoreStore.subscribe, bestScoreStore.getSnapshot, bestScoreStore.getServerSnapshot);
  const available = useMemo(() => filterQuestions(quizQuestions, selection), [selection]);
  const selectionKey = `${selection.category}|${selection.difficulty}`;
  const best = bestScores[selectionKey];
  const n = (value: number) => formatNumber(value, locale);

  const start = () => {
    // Date.now() is read here, inside an event handler — never during rendering —
    // so server and client HTML cannot disagree.
    setQuestions(shuffleWithSeed(available, Date.now()));
    setAnswers({});
    setIndex(0);
    setPhase("playing");
  };

  const finish = (finalAnswers: Record<string, number>) => {
    const result = scoreQuiz(questions, finalAnswers);
    if (!best || result.score > best.score || result.total !== best.total) {
      bestScoreStore.update((current) => ({ ...current, [selectionKey]: { score: result.score, total: result.total } }));
    }
    setPhase("result");
  };

  /* ───────────── setup ───────────── */
  if (phase === "setup") {
    return (
      <section className="panel p-6 md:p-8 max-w-2xl" aria-labelledby="quiz-setup">
        <h2 id="quiz-setup" className="sr-only">
          {t.quiz.title}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block" htmlFor="quiz-category">
            <span className="block text-[12px] text-dust mb-1.5">{t.quiz.category}</span>
            <select
              id="quiz-category"
              value={selection.category}
              onChange={(event) => setSelection((current) => ({ ...current, category: event.target.value as QuizSelection["category"] }))}
              className="h-11 w-full rounded-md border border-line-strong bg-ink px-3 text-[15px] text-parchment"
            >
              <option value="all">{t.quiz.categories.all}</option>
              {quizCategorySchema.options.map((value) => (
                <option key={value} value={value}>
                  {t.quiz.categories[value]}
                </option>
              ))}
            </select>
          </label>
          <label className="block" htmlFor="quiz-difficulty">
            <span className="block text-[12px] text-dust mb-1.5">{t.quiz.difficulty}</span>
            <select
              id="quiz-difficulty"
              value={selection.difficulty}
              onChange={(event) => setSelection((current) => ({ ...current, difficulty: event.target.value as QuizSelection["difficulty"] }))}
              className="h-11 w-full rounded-md border border-line-strong bg-ink px-3 text-[15px] text-parchment"
            >
              <option value="all">{t.quiz.difficulties.all}</option>
              {quizDifficultySchema.options.map((value) => (
                <option key={value} value={value}>
                  {t.quiz.difficulties[value]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-5 text-[13.5px] text-sand" aria-live="polite">
          {available.length > 0 ? fill(t.quiz.available, { count: n(available.length) }) : t.quiz.noQuestions}
        </p>
        {best ? <p className="mt-1 text-[12.5px] text-dust">{fill(t.quiz.bestScore, { score: n(best.score), total: n(best.total) })}</p> : null}

        <Button variant="primary" className="mt-6 h-11 px-6 text-[15px]" onClick={start} disabled={available.length === 0}>
          {t.quiz.start}
        </Button>
      </section>
    );
  }

  /* ───────────── result ───────────── */
  if (phase === "result") {
    const result = scoreQuiz(questions, answers);
    const verdict = result.ratio === 1 ? t.quiz.resultPerfect : result.ratio >= 0.6 ? t.quiz.resultGood : t.quiz.resultKeepGoing;
    return (
      <section className="max-w-3xl" aria-labelledby="quiz-result">
        <div className="panel p-6 md:p-8">
          <p className="eyebrow">{t.quiz.resultTitle}</p>
          <h2 id="quiz-result" className="mt-3 text-[30px] font-semibold text-parchment tabular-nums">
            {fill(t.quiz.resultScore, { score: n(result.score), total: n(result.total) })}
          </h2>
          <div className="mt-4 h-1.5 rounded-full bg-slate overflow-hidden" aria-hidden="true">
            <div className="h-full bg-gold" style={{ width: `${Math.round(result.ratio * 100)}%` }} />
          </div>
          <p className="mt-4 text-sand">{verdict}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button variant="primary" onClick={start}>
              <RotateCcw aria-hidden="true" className="size-4" />
              {t.quiz.playAgain}
            </Button>
            <Button onClick={() => setPhase("setup")}>{t.quiz.changeSettings}</Button>
          </div>
        </div>

        <h3 className="mt-10 mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-gold">{t.quiz.review}</h3>
        <ol className="space-y-3">
          {questions.map((question, position) => {
            const entry = result.perQuestion[position];
            const link = relatedLink(question, locale);
            return (
              <li key={question.id} className="panel p-5">
                <p className="flex items-start gap-2.5 font-medium text-parchment">
                  {entry.correct ? (
                    <CircleCheck aria-label={t.quiz.correct} className="size-5 mt-0.5 shrink-0 text-moss" />
                  ) : (
                    <CircleX aria-label={t.quiz.incorrect} className="size-5 mt-0.5 shrink-0 text-ember" />
                  )}
                  {question.question[locale]}
                </p>
                <div className="mt-2 ps-7 text-[13.5px] space-y-1">
                  {!entry.correct && entry.answerIndex !== null ? (
                    <p className="text-dust">
                      {t.quiz.yourAnswer}: {question.options[entry.answerIndex][locale]}
                    </p>
                  ) : null}
                  <p className="text-sand">{fill(t.quiz.correctAnswer, { answer: question.options[question.correctIndex][locale] })}</p>
                  {link ? (
                    <p>
                      <Link href={link.href} className="text-gold hover:text-gold-bright">
                        {link.label}
                      </Link>
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    );
  }

  /* ───────────── playing ───────────── */
  const question = questions[index];
  const chosen = answers[question.id];
  const answered = chosen !== undefined;
  const correct = isCorrect(question, chosen);
  const isLast = index === questions.length - 1;
  const running = scoreQuiz(questions.slice(0, index + (answered ? 1 : 0)), answers);
  const link = relatedLink(question, locale);
  const cited = getSources(question.sourceIds);

  const choose = (optionIndex: number) => {
    if (answered) return; // one attempt per question
    setAnswers((current) => ({ ...current, [question.id]: optionIndex }));
  };

  return (
    <section className="max-w-3xl" aria-labelledby="quiz-question">
      <div className="flex items-center justify-between gap-4 text-[13px] text-dust mb-3">
        <p>{fill(t.quiz.questionOf, { current: n(index + 1), total: n(questions.length) })}</p>
        <p className="tabular-nums">
          {t.quiz.score}: <span className="text-gold font-semibold">{n(running.score)}</span>
        </p>
      </div>
      <div className="h-1 rounded-full bg-slate overflow-hidden mb-6" aria-hidden="true">
        <div className="h-full bg-gold transition-all" style={{ width: `${((index + (answered ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>

      <div className="panel p-6 md:p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge tone="gold">{t.quiz.categories[question.category]}</Badge>
          <Badge tone="muted">{t.quiz.difficulties[question.difficulty]}</Badge>
        </div>
        <h2 id="quiz-question" className="text-[20px] md:text-[23px] font-semibold text-parchment">
          {question.question[locale]}
        </h2>

        <ul className="mt-6 grid gap-2.5">
          {question.options.map((option, optionIndex) => {
            const isChosen = chosen === optionIndex;
            const isAnswer = optionIndex === question.correctIndex;
            return (
              <li key={option.en}>
                <button
                  type="button"
                  onClick={() => choose(optionIndex)}
                  disabled={answered}
                  aria-pressed={isChosen}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-md border px-4 py-3 text-start text-[15px] transition-colors",
                    !answered && "border-line-strong text-parchment hover:border-gold hover:bg-gold/[0.05]",
                    answered && isAnswer && "border-moss/70 bg-moss/10 text-parchment",
                    answered && isChosen && !isAnswer && "border-ember/70 bg-ember/10 text-parchment",
                    answered && !isChosen && !isAnswer && "border-line text-dust",
                  )}
                >
                  <span
                    className={cn(
                      "size-6 shrink-0 grid place-items-center rounded-full border text-[12px] tabular-nums",
                      answered && isAnswer ? "border-moss text-moss" : answered && isChosen ? "border-ember text-ember" : "border-line-strong text-dust",
                    )}
                  >
                    {n(optionIndex + 1)}
                  </span>
                  <span className="flex-1">{option[locale]}</span>
                  {answered && isAnswer ? <CircleCheck aria-hidden="true" className="size-5 text-moss" /> : null}
                  {answered && isChosen && !isAnswer ? <CircleX aria-hidden="true" className="size-5 text-ember" /> : null}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Feedback appears only after an answer; aria-live announces it to screen readers. */}
        <div aria-live="polite">
          {answered ? (
            <div className={cn("mt-6 rounded-md border p-4", correct ? "border-moss/40 bg-moss/[0.06]" : "border-ember/40 bg-ember/[0.06]")}>
              <p className={cn("font-semibold", correct ? "text-moss" : "text-ember")}>{correct ? t.quiz.correct : t.quiz.incorrect}</p>
              {!correct ? (
                <p className="mt-1 text-[14px] text-parchment">
                  {fill(t.quiz.correctAnswer, { answer: question.options[question.correctIndex][locale] })}
                </p>
              ) : null}
              <p className="mt-2 text-[14px] text-sand">{question.explanation[locale]}</p>
              <div className="mt-3 pt-3 border-t border-line text-[12.5px] space-y-1">
                {link ? (
                  <p className="text-dust">
                    {t.quiz.related}:{" "}
                    <Link href={link.href} className="text-gold hover:text-gold-bright">
                      {link.label}
                    </Link>
                  </p>
                ) : null}
                <p className="text-dust">
                  {t.common.sources}:{" "}
                  <span dir="ltr">
                    {cited.map((source, position) => (
                      <span key={source.id}>
                        {position > 0 ? "; " : ""}
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sand underline decoration-line-strong underline-offset-2 hover:text-gold"
                        >
                          {source.title}
                        </a>
                      </span>
                    ))}
                  </span>
                </p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="primary"
            disabled={!answered}
            onClick={() => {
              if (isLast) finish(answers);
              else setIndex((current) => current + 1);
            }}
          >
            {isLast ? t.quiz.finish : t.quiz.next}
          </Button>
        </div>
      </div>
    </section>
  );
}
