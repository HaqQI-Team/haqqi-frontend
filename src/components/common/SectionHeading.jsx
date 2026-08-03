function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-800 dark:text-red-300">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-bold text-neutral-950 dark:text-white md:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300 md:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default SectionHeading;
