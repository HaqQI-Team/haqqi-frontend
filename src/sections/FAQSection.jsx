import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import SectionHeading from "../components/common/SectionHeading";
import { faqs } from "../data/landingData";

function FAQSection() {
  const { t } = useTranslation();
  const accordionId = useId();
  const [openIndex, setOpenIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  function toggleItem(index) {
    setOpenIndex((currentIndex) => (currentIndex === index ? null : index));
  }

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#fbf7f5] px-4 py-16 dark:bg-[#100d0d] sm:px-6 lg:px-8 lg:py-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/images/FAQ-background.png')] bg-cover bg-center opacity-25 dark:opacity-20"
      />

      <div className="relative">
        <SectionHeading title={t("faq.title")} />

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            const buttonId = `${accordionId}-question-${index}`;
            const panelId = `${accordionId}-answer-${index}`;

            return (
              <article
                key={item.questionKey}
                className="rounded-md border border-red-900/10 bg-white/92 shadow-sm backdrop-blur-sm dark:border-red-300/10 dark:bg-neutral-950/90"
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-sm font-extrabold text-neutral-950 transition-colors duration-200 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:text-white dark:hover:text-red-200 dark:focus-visible:outline-red-300"
                  >
                    <span>{t(item.questionKey)}</span>

                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`shrink-0 text-red-900 transition-transform duration-200 dark:text-red-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key={panelId}
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.24,
                        ease: "easeOut",
                      }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                        {t(item.answerKey)}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
