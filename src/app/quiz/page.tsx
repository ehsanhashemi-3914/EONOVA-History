/** /quiz — knowledge test built from the atlas's own dataset. */
import type { Metadata } from "next";
import { getI18n } from "@/i18n/server";
import { Quiz } from "@/components/quiz/Quiz";
import { PageHeader } from "@/components/ui/primitives";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.quiz.title, description: t.quiz.intro };
}

export default async function QuizPage() {
  const { t } = await getI18n();
  return (
    <>
      <PageHeader eyebrow={t.nav.quiz} title={t.quiz.title} intro={t.quiz.intro} />
      <div className="shell py-10">
        <Quiz />
      </div>
    </>
  );
}
