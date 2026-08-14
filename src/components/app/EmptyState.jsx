function EmptyState({ title, description, action }) {
  return (
    <section className="rounded-md border border-red-900/10 bg-white p-6 text-center shadow-sm dark:border-red-300/10 dark:bg-neutral-900 sm:p-8">
      <h2 className="text-xl font-extrabold text-neutral-950 dark:text-white">
        {title}
      </h2>
      {description ? (
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  );
}

export default EmptyState;
