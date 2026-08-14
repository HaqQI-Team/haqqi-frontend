import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faCircleCheck,
  faClock,
  faFileLines,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  getEvidenceName,
  getEvidenceProcessedText,
  getEvidenceUploadedAt,
  getEvidenceUrl,
  isEvidencePdf,
} from "../../utils/complaintData";
import { formatDate } from "../../utils/formatters";

function EvidenceCard({ evidence, onDelete }) {
  const { i18n, t } = useTranslation();
  const [isTextVisible, setIsTextVisible] = useState(false);
  const explicitName = getEvidenceName(evidence);
  const url = getEvidenceUrl(evidence);
  const processedText = getEvidenceProcessedText(evidence).trim();
  const hasProcessedText = Boolean(processedText);
  const uploadedAt = formatDate(getEvidenceUploadedAt(evidence), i18n.language);
  const documentName = explicitName || t("app.evidence.documentName");
  const documentType = isEvidencePdf(evidence)
    ? t("app.evidence.pdfDocument")
    : t("app.evidence.genericDocument");

  return (
    <article className="min-w-0 rounded-md border border-red-900/10 bg-[#fff8f4] p-4 text-start dark:border-red-300/10 dark:bg-neutral-950">
      <div className="flex min-w-0 gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-red-900/[0.08] text-red-900 dark:bg-red-300/10 dark:text-red-200">
          <FontAwesomeIcon icon={faFileLines} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="break-words text-sm font-extrabold text-neutral-950 dark:text-white">
                {documentName}
              </h3>
              <p className="mt-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                {documentType}
              </p>
              {uploadedAt ? (
                <p className="mt-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  {t("app.evidence.uploaded", { date: uploadedAt })}
                </p>
              ) : null}
            </div>

            <span
              className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-[0.68rem] font-extrabold ${
                hasProcessedText
                  ? "bg-emerald-700/10 text-emerald-700 dark:bg-emerald-300/10 dark:text-emerald-300"
                  : "bg-neutral-200/70 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
              }`}
            >
              <FontAwesomeIcon icon={hasProcessedText ? faCircleCheck : faClock} />
              <span>
                {hasProcessedText
                  ? t("app.evidence.processed")
                  : t("app.evidence.processing")}
              </span>
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-bold text-neutral-700 transition hover:-translate-y-0.5 hover:border-red-800 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-red-300 dark:hover:text-red-200"
              >
                {t("app.evidence.view")}
              </a>
            ) : null}

            {hasProcessedText ? (
              <button
                type="button"
                aria-expanded={isTextVisible}
                onClick={() => setIsTextVisible((current) => !current)}
                className="inline-flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-bold text-neutral-700 transition hover:-translate-y-0.5 hover:border-red-800 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-red-300 dark:hover:text-red-200"
              >
                <span>
                  {isTextVisible
                    ? t("app.evidence.hideExtractedText")
                    : t("app.evidence.viewExtractedText")}
                </span>
                <FontAwesomeIcon icon={isTextVisible ? faChevronUp : faChevronDown} />
              </button>
            ) : null}

            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-bold text-red-900 transition hover:-translate-y-0.5 hover:bg-red-900/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:text-red-200 dark:hover:bg-red-300/10"
            >
              <FontAwesomeIcon icon={faTrash} />
              <span>{t("app.evidence.delete")}</span>
            </button>
          </div>

          {isTextVisible ? (
            <div className="mt-3 max-h-56 min-w-0 overflow-y-auto rounded-md border border-red-900/10 bg-white p-3 text-xs leading-5 text-neutral-700 dark:border-red-300/10 dark:bg-neutral-900 dark:text-neutral-200">
              <p className="whitespace-pre-wrap break-words">{processedText}</p>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default EvidenceCard;
