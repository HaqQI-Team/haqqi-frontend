import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

function InlineAlert({ title, description, action }) {
  return (
    <section
      role="alert"
      className="rounded-md border border-red-700/20 bg-red-50 p-4 text-start text-red-900 dark:border-red-300/20 dark:bg-red-950/25 dark:text-red-100"
    >
      <div className="flex min-w-0 gap-3">
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className="mt-0.5 shrink-0 text-red-800 dark:text-red-200"
        />
        <div className="min-w-0">
          <h2 className="break-words text-sm font-extrabold leading-6">{title}</h2>
          {description ? (
            <p className="mt-1 break-words text-sm leading-6 text-red-800/85 dark:text-red-100/80">
              {description}
            </p>
          ) : null}
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </section>
  );
}

export default InlineAlert;
