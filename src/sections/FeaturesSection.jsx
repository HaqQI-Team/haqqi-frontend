import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SectionHeading from "../components/common/SectionHeading";
import { features } from "../data/landingData";

function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section id="features" className="bg-red-50 px-4 py-16 dark:bg-neutral-900 sm:px-6 lg:px-8">
      <SectionHeading title={t("features.title")} />
      <div className="mx-auto mt-10 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <article key={feature.titleKey} className="rounded-md border border-red-100 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <FontAwesomeIcon icon={feature.icon} className="text-red-800 dark:text-red-300" />
            <h3 className="mt-4 text-sm font-bold text-neutral-950 dark:text-white">{t(feature.titleKey)}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;
