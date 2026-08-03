import { useTranslation } from "react-i18next";
import { motion, useReducedMotion } from "motion/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SectionHeading from "../components/common/SectionHeading";
import { workflowSteps } from "../data/landingData";

const springTransition = {
  type: "spring",
  stiffness: 220,
  damping: 22,
  mass: 0.8,
};

function WorkflowSection() {
  const { i18n, t } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const isRtl = i18n.dir() === "rtl";

  const lineTransition = {
    duration: shouldReduceMotion ? 0 : 0.85,
    ease: [0.22, 1, 0.36, 1],
  };

  const stepsVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: shouldReduceMotion ? 0 : 0.2,
        staggerChildren: shouldReduceMotion ? 0 : 0.13,
      },
    },
  };

  const stepVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 1, scale: 1 }
      : { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: shouldReduceMotion ? { duration: 0 } : springTransition,
    },
  };

  const desktopLineVariants = {
    hidden: shouldReduceMotion ? { scaleX: 1 } : { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: lineTransition,
    },
  };

  const mobileLineVariants = {
    hidden: shouldReduceMotion ? { scaleY: 1 } : { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: lineTransition,
    },
  };

  return (
    <section
      id="workflow"
      className="bg-[#fbf7f5] px-4 py-16 dark:bg-neutral-950 sm:px-6 lg:px-8 lg:py-20"
    >
      <SectionHeading title={t("workflow.title")} />

      <motion.div
        dir={isRtl ? "rtl" : "ltr"}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="mx-auto mt-12 max-w-7xl"
      >
        <div className="relative lg:px-4">
          <div
            aria-hidden="true"
            className={`absolute bottom-8 top-8 w-px bg-red-900/12 dark:bg-red-300/14 lg:hidden ${
              isRtl ? "right-8" : "left-8"
            }`}
          />
          <div
            aria-hidden="true"
            className="absolute left-12 right-12 top-8 hidden h-px bg-red-900/12 dark:bg-red-300/14 lg:block"
          />

          <motion.div
            aria-hidden="true"
            variants={mobileLineVariants}
            className={`absolute bottom-8 top-8 w-px origin-top bg-red-900 dark:bg-red-300 lg:hidden ${
              isRtl ? "right-8" : "left-8"
            }`}
          />
          <motion.div
            aria-hidden="true"
            variants={desktopLineVariants}
            className={`absolute left-12 right-12 top-8 hidden h-px bg-red-900 dark:bg-red-300 lg:block ${
              isRtl ? "lg:origin-right" : "lg:origin-left"
            }`}
          />

          <motion.ol
            variants={stepsVariants}
            className={`relative grid gap-8 lg:grid-cols-5 lg:gap-4 ${
              isRtl ? "pr-8 lg:pr-0" : "pl-8 lg:pl-0"
            }`}
          >
            {workflowSteps.map((step) => (
              <motion.li
                key={step.titleKey}
                variants={stepVariants}
                className="relative flex items-center gap-4 lg:flex-col lg:text-center"
              >
                <motion.span
                  whileHover={shouldReduceMotion ? undefined : { y: -3 }}
                  transition={{ duration: 0.18 }}
                  className={`grid h-16 w-16 shrink-0 place-items-center rounded-full border text-lg shadow-sm ${
                    step.isActive
                      ? "border-red-900 bg-red-900 text-white shadow-[0_12px_28px_rgba(127,29,29,0.20)] dark:border-red-600 dark:bg-red-700"
                      : "border-red-900/15 bg-white text-red-900 dark:border-red-300/15 dark:bg-neutral-900 dark:text-red-200"
                  }`}
                >
                  <FontAwesomeIcon icon={step.icon} />
                </motion.span>

                <p className="text-sm font-extrabold leading-5 text-neutral-950 dark:text-white">
                  {t(step.titleKey)}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </motion.div>
    </section>
  );
}

export default WorkflowSection;
