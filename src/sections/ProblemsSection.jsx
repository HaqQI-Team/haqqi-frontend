import { useTranslation } from "react-i18next";
import SectionHeading from "../components/common/SectionHeading";
import { problems } from "../data/landingData";

function ProblemsSection() {
  const { t } = useTranslation();

  return (
    <section id="problems" className="px-4 py-16 dark:bg-neutral-950 sm:px-6 lg:px-8">
      <SectionHeading title={t("problems.title")} />
      <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
        {problems.map((problemKey) => (
          <article key={problemKey} className="rounded-md border border-neutral-200 bg-white p-5 text-center dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="text-sm font-bold text-red-900 dark:text-red-200">{t(problemKey)}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProblemsSection;
