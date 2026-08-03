import { useTranslation } from "react-i18next";
import SectionHeading from "../components/common/SectionHeading";
import { faqs } from "../data/landingData";

function FAQSection() {
  const { t } = useTranslation();

  return (
    <section id="faq" className="bg-red-50 px-4 py-16 dark:bg-neutral-900 sm:px-6 lg:px-8">
      <SectionHeading title={t("faq.title")} />
      <div className="mx-auto mt-10 max-w-3xl space-y-3">
        {faqs.map((item) => (
          <details key={item.questionKey} className="rounded-md border border-red-100 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-950">
            <summary className="cursor-pointer text-sm font-bold text-neutral-950 dark:text-white">
              {t(item.questionKey)}
            </summary>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {t(item.answerKey)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default FAQSection;
