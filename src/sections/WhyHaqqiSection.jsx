import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SectionHeading from "../components/common/SectionHeading";
import { whyHaqqiItems } from "../data/landingData";

function WhyHaqqiSection() {
  const { t } = useTranslation();

  return (
    <section id="why-haqqi" className="px-4 py-16 dark:bg-neutral-950 sm:px-6 lg:px-8">
      <SectionHeading title={t("whyHaqqi.title")} />
      <div className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
        {whyHaqqiItems.map((item) => (
          <article key={item.titleKey} className="rounded-md border border-neutral-200 p-5 dark:border-neutral-800">
            <FontAwesomeIcon icon={item.icon} className="text-red-800 dark:text-red-300" />
            <h3 className="mt-4 text-sm font-bold text-neutral-950 dark:text-white">{t(item.titleKey)}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

export default WhyHaqqiSection;
