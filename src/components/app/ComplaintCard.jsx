import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import StatusBadge from "./StatusBadge";
import {
  getComplaintAuthority,
  getComplaintDomain,
  getComplaintStatus,
  getComplaintTitle,
  getUpdatedAt,
} from "../../utils/complaintData";
import { formatDate } from "../../utils/formatters";

function ComplaintCard({ complaint, onContinue }) {
  const { i18n, t } = useTranslation();
  const isRtl = i18n.dir() === "rtl";
  const title = getComplaintTitle(complaint, t("app.complaints.untitled"));
  const domain = getComplaintDomain(complaint);
  const authority = getComplaintAuthority(complaint);
  const updatedAt = formatDate(getUpdatedAt(complaint), i18n.language);

  return (
    <article className="min-w-0 rounded-md border border-red-900/10 bg-white p-5 text-start shadow-sm transition duration-200 hover:-translate-y-1 hover:border-red-900/25 hover:shadow-[0_14px_34px_rgba(127,29,29,0.10)] dark:border-red-300/10 dark:bg-neutral-900 dark:hover:border-red-300/30">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="break-words text-lg font-extrabold leading-7 text-neutral-950 dark:text-white">
            {title}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
            {domain ? <span className="break-words">{domain}</span> : null}
            {authority ? (
              <>
                <span className="text-neutral-300 dark:text-neutral-600">
                  &bull;
                </span>
                <span className="break-words">{authority}</span>
              </>
            ) : null}
          </div>
        </div>
        <div className="shrink-0">
          <StatusBadge status={getComplaintStatus(complaint)} />
        </div>
      </div>

      {updatedAt ? (
        <p className="mt-5 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
          {t("app.complaints.updated", { date: updatedAt })}
        </p>
      ) : null}

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          onClick={onContinue}
          className="group inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-extrabold text-red-900 transition hover:-translate-y-0.5 hover:bg-red-900/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:text-red-200 dark:hover:bg-red-300/10"
        >
          <span>{t("app.complaints.continue")}</span>
          <FontAwesomeIcon
            icon={faArrowRight}
            className={`transition-transform ${isRtl ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
          />
        </button>
      </div>
    </article>
  );
}

export default ComplaintCard;
