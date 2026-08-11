import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AuthInput({
  label,
  name,
  type,
  value,
  placeholder,
  icon,
  error,
  onChange,
  rightButton,
  autoComplete,
  registration,
}) {
  const errorId = error ? `${name}-error` : undefined;
  const controlledProps = value === undefined ? {} : { value };
  const changeProps = onChange ? { onChange } : {};

  return (
    <div>
      {label ? (
        <label
          htmlFor={name}
          className="block text-start text-sm font-semibold text-neutral-900 dark:text-neutral-100"
        >
          {label}
        </label>
      ) : null}

      <div
        className={`flex h-12 min-w-0 items-center rounded-[10px] border bg-white px-4 transition duration-200 focus-within:border-red-900 focus-within:ring-2 focus-within:ring-red-900/12 dark:bg-neutral-950 ${
          label ? "mt-1.5" : ""
        } ${
          error
            ? "border-red-700 dark:border-red-400"
            : "border-red-900/20 dark:border-red-300/15"
        }`}
      >
        <FontAwesomeIcon
          icon={icon}
          className="text-red-900/80 dark:text-red-200/85"
        />

        <input
          id={name}
          name={name}
          type={type}
          {...registration}
          {...controlledProps}
          {...changeProps}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={errorId}
          className="min-w-0 flex-1 bg-transparent px-4 text-start text-sm text-neutral-950 outline-none placeholder:text-neutral-500 dark:text-white dark:placeholder:text-neutral-500"
        />

        {rightButton ? (
          <div className="shrink-0 text-neutral-500 dark:text-neutral-300">
            {rightButton}
          </div>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} className="mt-1 text-start text-xs font-semibold text-red-700 dark:text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default AuthInput;
