import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SectionHeading from "../components/common/SectionHeading";
import { howItWorksSteps } from "../data/landingData";

function HowItWorksSection() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="px-4 py-16 dark:bg-neutral-950 sm:px-6 lg:px-8">
      <SectionHeading title={t("howItWorks.title")} description={t("howItWorks.description")} />
      <div className="mx-auto mt-10 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {howItWorksSteps.map((step) => (
          <article key={step.titleKey} className="rounded-md border border-neutral-200 bg-white p-5 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <FontAwesomeIcon icon={step.icon} className="text-red-800 dark:text-red-300" />
            <h3 className="mt-4 text-sm font-bold text-neutral-950 dark:text-white">{t(step.titleKey)}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HowItWorksSection;
