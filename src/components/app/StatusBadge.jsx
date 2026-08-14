import { useTranslation } from "react-i18next";

function normalizeStatus(status) {
  return String(status || "unknown")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
}

function StatusBadge({ status }) {
  const { t } = useTranslation();
  const normalizedStatus = normalizeStatus(status);

  return (
    <span className="inline-flex w-fit items-center rounded-md bg-red-900/[0.08] px-3 py-1.5 text-xs font-extrabold text-red-900 ring-1 ring-red-900/10 dark:bg-red-300/10 dark:text-red-100 dark:ring-red-300/15">
      {t(`app.status.${normalizedStatus}`, {
        defaultValue: t("app.status.unknown"),
      })}
    </span>
  );
}

export default StatusBadge;
