import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const isSuccess = type === "success";

  return (
    <div
      role="status"
      className={`fixed bottom-5 z-[150] flex max-w-sm items-center gap-3 rounded-md border p-4 shadow-lg transition-all duration-300 ltr:right-5 rtl:left-5 ${
        isSuccess
          ? "border-green-500/20 bg-green-50 text-green-900 dark:border-green-300/20 dark:bg-green-950/25 dark:text-green-100"
          : "border-red-700/20 bg-red-50 text-red-900 dark:border-red-300/20 dark:bg-red-950/25 dark:text-red-100"
      }`}
    >
      <FontAwesomeIcon
        icon={isSuccess ? faCircleCheck : faCircleExclamation}
        className={`shrink-0 ${
          isSuccess
            ? "text-green-800 dark:text-green-200"
            : "text-red-800 dark:text-red-200"
        }`}
      />
      <span className="text-sm font-semibold leading-5">{message}</span>
    </div>
  );
}

export default Toast;
