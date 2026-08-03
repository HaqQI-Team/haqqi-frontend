import { useTranslation } from "react-i18next";
import { trustItems } from "../data/landingData";

function TrustStrip() {
  const { t } = useTranslation();

  return (
    <section aria-label={t("trustStrip.label")} className="border-y border-neutral-100 bg-white px-4 py-6 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 text-center sm:grid-cols-2 lg:grid-cols-4">
        {trustItems.map((itemKey) => (
          <p key={itemKey} className="text-sm font-semibold text-red-900 dark:text-red-200">
            {t(itemKey)}
          </p>
        ))}
      </div>
    </section>
  );
}

export default TrustStrip;
