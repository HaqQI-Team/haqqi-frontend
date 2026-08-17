import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function CTASection({ onProtectedAction }) {
  const { t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();

  const reducedItemVariants = {
    hidden: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 0 } },
  };

  const activeItemVariants = shouldReduceMotion
    ? reducedItemVariants
    : itemVariants;

  return (
    <section
      id="cta"
      className="relative overflow-hidden bg-[url('/images/CTA-background.png')] bg-cover bg-center px-4 py-20 text-center text-white sm:px-6 lg:px-8 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-red-950/65 dark:bg-red-950/72"
      />

      <motion.div
        aria-hidden="true"
        initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-300/18 blur-3xl"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.35 }}
        className="relative mx-auto max-w-3xl"
      >
        <motion.h2
          variants={activeItemVariants}
          className="text-3xl font-extrabold leading-tight md:text-4xl"
        >
          {t("cta.title")}
        </motion.h2>

        <motion.p
          variants={activeItemVariants}
          className="mx-auto mt-4 max-w-2xl text-base leading-7 text-red-50 md:text-lg"
        >
          {t("cta.description")}
        </motion.p>

        <motion.div
          variants={activeItemVariants}
          className="mt-8 flex justify-center"
        >
          <button
            type="button"
            onClick={() => onProtectedAction("/complaints/new")}
            className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-extrabold text-red-950 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t("cta.actions.start")}
          </button>
        </motion.div>

        <motion.p
          variants={activeItemVariants}
          className="mt-5 text-xs font-semibold text-red-50/90"
        >
          {t("cta.note")}
        </motion.p>
      </motion.div>
    </section>
  );
}

export default CTASection;
