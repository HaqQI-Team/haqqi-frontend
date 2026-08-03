import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SectionHeading from "../components/common/SectionHeading";
import { problems } from "../data/landingData";

function ProblemsSection() {
  const { t } = useTranslation();

  return (
    <section
      id="problems"
      className="bg-white px-4 py-16 dark:bg-neutral-950 sm:px-6 lg:px-8"
    >
      <SectionHeading title={t("problems.title")} />

      <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
        {problems.map((problem) => (
          <article
            key={problem.labelKey}
            className="group flex items-center justify-center gap-3 rounded-md border border-red-900/10 bg-[#fff8f4] px-5 py-4 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-900/25 hover:bg-white hover:shadow-[0_12px_28px_rgba(127,29,29,0.10)] dark:border-red-300/10 dark:bg-neutral-900 dark:hover:border-red-300/30 dark:hover:bg-neutral-950"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-red-900/[0.08] text-red-900 transition-colors duration-200 group-hover:bg-red-900/[0.13] dark:bg-red-300/10 dark:text-red-200 dark:group-hover:bg-red-300/15">
              <FontAwesomeIcon icon={problem.icon} className="text-sm" />
            </span>

            <h3 className="text-sm font-extrabold text-red-950 dark:text-red-100">
              {t(problem.labelKey)}
            </h3>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ProblemsSection;
