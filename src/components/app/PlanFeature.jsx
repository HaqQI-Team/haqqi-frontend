function PlanFeature({ label, value, description }) {
  return (
    <article className="rounded-md border border-red-900/10 bg-white p-5 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900">
      <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-extrabold text-neutral-950 dark:text-white">
        {value}
      </p>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          {description}
        </p>
      ) : null}
    </article>
  );
}

export default PlanFeature;
