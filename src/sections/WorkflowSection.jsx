import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SectionHeading from "../components/common/SectionHeading";
import { workflowSteps } from "../data/landingData";

function WorkflowSection() {
  const { t } = useTranslation();

  return (
    <section id="workflow" className="bg-neutral-100 px-4 py-16 dark:bg-neutral-900 sm:px-6 lg:px-8">
      <SectionHeading title={t("workflow.title")} />
      <ol className="mx-auto mt-10 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {workflowSteps.map((step) => (
          <li key={step.titleKey} className="rounded-md bg-white p-5 text-center dark:bg-neutral-950">
            <FontAwesomeIcon icon={step.icon} className="text-red-800 dark:text-red-300" />
            <p className="mt-4 text-sm font-bold text-neutral-950 dark:text-white">{t(step.titleKey)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default WorkflowSection;
