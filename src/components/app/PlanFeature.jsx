import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function PlanFeature({ label, value, description, icon }) {
  return (
    <article className="rounded-md border border-red-900/10 bg-white p-5 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900">
      <div className="flex justify-between items-center gap-3">
        <div className="min-w-0">
          <p className="text-base font-bold text-neutral-500 dark:text-neutral-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-extrabold text-neutral-950 dark:text-white">
            {value}
          </p>
        </div>
        {icon ? (
          <span className="grid h-10 w-10 place-items-center rounded-md bg-red-900/[0.08] text-red-900 dark:bg-red-300/10 dark:text-red-200 shrink-0">
            <FontAwesomeIcon icon={icon} />
          </span>
        ) : null}
      </div>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          {description}
        </p>
      ) : null}
    </article>
  );
}

export default PlanFeature;
