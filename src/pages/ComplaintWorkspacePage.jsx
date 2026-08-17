import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faBookOpen,
  faPaperPlane,
  faPaperclip,
  faScaleBalanced,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  deleteComplaint,
  getComplaint,
  getComplaintMessages,
  sendComplaintMessage,
} from "../api/complaintApi";
import { exportComplaintDraft, getComplaintDraft } from "../api/draftApi";
import {
  createEvidence,
  deleteEvidence,
  getComplaintEvidence,
  uploadEvidenceFile,
} from "../api/evidenceApi";
import ConfirmDialog from "../components/app/ConfirmDialog";
import EmptyState from "../components/app/EmptyState";
import EvidenceCard from "../components/app/EvidenceCard";
import InlineAlert from "../components/app/InlineAlert";
import StatusBadge from "../components/app/StatusBadge";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "../router/useRouter";
import {
  getCitations,
  getComplaintAuthority,
  getComplaintDomain,
  getComplaintStatus,
  getComplaintTitle,
  getDraftContent,
  getDraftObject,
  getDraftPdfUrl,
  getDraftUpdatedAt,
  getEvidenceId,
  getMessageContent,
  getMessageTime,
  getMissingInformation,
  isDraftFinal,
  isUserMessage,
} from "../utils/complaintData";
import {
  EVIDENCE_UPLOAD_MESSAGE_TYPE,
  buildEvidenceDisplayTimeline,
} from "../utils/evidenceMessages";
import {
  getApiErrorDetails,
  getApiErrorMessage,
  getApiErrorStatus,
} from "../utils/apiError";
import { formatDate } from "../utils/formatters";
import {
  getEvidenceFileUrl,
  unwrapApiArray,
  unwrapApiData,
} from "../utils/responseData";

function mergeComplaintUpdate(currentComplaint, response) {
  if (!response || typeof response !== "object") {
    return currentComplaint;
  }

  return {
    ...currentComplaint,
    complaintID: response.complaintID ?? currentComplaint?.complaintID,
    title: response.title ?? currentComplaint?.title,
    status: response.status ?? currentComplaint?.status,
    domain: response.domain ?? currentComplaint?.domain,
    authorityName: response.authority ?? response.authorityName ?? currentComplaint?.authorityName,
    draft: response.draftContent ?? response.draft ?? currentComplaint?.draft,
    missingInformation: response.missingInformation ?? currentComplaint?.missingInformation,
    citations: response.citations ?? currentComplaint?.citations,
  };
}

function MessageBubble({ item }) {
  const { i18n, t } = useTranslation();
  const isEvidenceUpload = item?.type === EVIDENCE_UPLOAD_MESSAGE_TYPE;
  const message = item?.message ?? item;
  const isUser = isUserMessage(message);
  const content = getMessageContent(message);
  const time = formatDate(item?.sentTime ?? getMessageTime(message), i18n.language);

  if (isEvidenceUpload) {
    return (
      <article className="flex min-w-0 justify-start">
        <div className="min-w-0 max-w-[92%] rounded-md border border-red-900/10 bg-white px-4 py-3 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900 sm:max-w-[78%]">
          <div className="flex min-w-0 items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-red-900/[0.08] text-red-900 dark:bg-red-300/10 dark:text-red-200">
              <FontAwesomeIcon icon={faPaperclip} />
            </span>
            <div className="min-w-0">
              <p className="break-words text-sm font-extrabold text-neutral-950 dark:text-white">
                {t("app.evidence.uploadMessage")}
              </p>
              <a
                href="#supporting-evidence"
                className="mt-1 inline-flex text-xs font-bold text-red-900 transition hover:text-red-700 dark:text-red-200 dark:hover:text-red-100"
              >
                {t("app.evidence.viewInSupportingEvidence")}
              </a>
              {time ? (
                <p className="mt-2 text-[0.7rem] font-semibold text-neutral-400">
                  {time}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <article className={`flex min-w-0 ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`min-w-0 max-w-[92%] rounded-md px-4 py-3 text-start shadow-sm sm:max-w-[78%] ${
          isUser
            ? "bg-red-900 text-white dark:bg-red-700"
            : "border border-red-900/10 bg-white text-neutral-800 dark:border-red-300/10 dark:bg-neutral-900 dark:text-neutral-100"
        }`}
      >
        <p className={`text-xs font-extrabold ${isUser ? "text-red-50/80" : "text-red-900 dark:text-red-200"}`}>
          {isUser ? t("app.workspace.you") : t("brand.name")}
        </p>
        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">
          {content}
        </p>
        {time ? (
          <p className={`mt-2 text-[0.7rem] font-semibold ${isUser ? "text-red-50/70" : "text-neutral-400"}`}>
            {time}
          </p>
        ) : null}
      </div>
    </article>
  );
}

function DetailRow({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div className="border-b border-red-900/10 py-3 last:border-b-0 dark:border-red-300/10">
      <p className="text-xs font-bold uppercase text-neutral-400">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-neutral-800 dark:text-neutral-100">
        {value}
      </p>
    </div>
  );
}

function getCitationDocumentName(citation, fallback) {
  if (!citation || typeof citation !== "object") {
    return fallback;
  }

  return typeof citation.documentName === "string" && citation.documentName.trim()
    ? citation.documentName.trim()
    : fallback;
}

function getCitationArticleName(citation) {
  if (!citation || typeof citation !== "object") {
    return "";
  }

  return typeof citation.articleName === "string" && citation.articleName.trim()
    ? citation.articleName.trim()
    : "";
}

function CitationItem({ citation }) {
  const { t } = useTranslation();
  const documentName = getCitationDocumentName(
    citation,
    t("app.citations.legalSource"),
  );
  const articleName = getCitationArticleName(citation);

  return (
    <li className="flex min-w-0 gap-3 rounded-md border border-red-900/10 bg-[#fff8f4] p-3 dark:border-red-300/10 dark:bg-neutral-950">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-red-900/[0.08] text-red-900 dark:bg-red-300/10 dark:text-red-200">
        <FontAwesomeIcon icon={faBookOpen} />
      </span>
      <div className="min-w-0">
        <p className="break-words text-sm font-extrabold text-neutral-950 dark:text-white">
          {documentName}
        </p>
        {articleName ? (
          <p className="mt-1 break-words text-xs font-bold text-neutral-500 dark:text-neutral-400">
            {articleName}
          </p>
        ) : null}
      </div>
    </li>
  );
}

function DraftPanel({
  canExportPdf,
  draft,
  draftError,
  exportError,
  isExporting,
  onExport,
  readyState,
  status,
}) {
  const { i18n, t } = useTranslation();
  const content = getDraftContent(draft);
  const pdfUrl = getDraftPdfUrl(draft);
  const hasPdfUrl = isHttpUrl(pdfUrl);
  const updatedAt = formatDate(getDraftUpdatedAt(draft), i18n.language);
  const isReady = readyState === "ready";
  const hasDraft = Boolean(content || hasPdfUrl);
  const canExport = canExportPdf && isReady && hasDraft;
  const exportDisabledReason = (() => {
    if (!canExportPdf) {
      return t("app.draft.exportNotIncluded");
    }

    if (!hasDraft) {
      return t("app.draft.exportNoDraft");
    }

    if (readyState === "needsInfo") {
      return t("app.draft.exportNeedsInfo");
    }

    if (readyState === "processing" || readyState === "pending") {
      return t("app.draft.exportProcessing");
    }

    if (readyState === "failed") {
      return t("app.draft.exportFailed");
    }

    if (!isReady) {
      return t("app.draft.exportNotReady");
    }

    return "";
  })();

  return (
    <section className="rounded-md border border-red-900/10 bg-white p-5 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-extrabold text-neutral-950 dark:text-white">
            {t("app.draft.title")}
          </h2>
          {updatedAt ? (
            <p className="mt-1 text-xs font-bold text-neutral-500 dark:text-neutral-400">
              {t("app.draft.updated", { date: updatedAt })}
            </p>
          ) : null}
        </div>
        {draft ? (
          <span className="inline-flex w-fit rounded-md bg-red-900/[0.08] px-2 py-1 text-xs font-extrabold text-red-900 dark:bg-red-300/10 dark:text-red-200">
            {isDraftFinal(draft)
              ? t("app.draft.final")
              : t("app.draft.notFinal")}
          </span>
        ) : null}
      </div>

      {draftError ? (
        <p className="mt-3 rounded-md border border-red-700/20 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:border-red-300/20 dark:bg-red-950/25 dark:text-red-300">
          {draftError}
        </p>
      ) : null}

      {content ? (
        <div className="mt-4 max-h-96 overflow-y-auto rounded-md border border-red-900/10 bg-[#fff8f4] p-4 text-sm leading-7 text-neutral-800 dark:border-red-300/10 dark:bg-neutral-950 dark:text-neutral-100">
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </div>
      ) : (
        <p className="mt-4 rounded-md border border-red-900/10 bg-[#fff8f4] px-4 py-3 text-sm font-semibold leading-6 text-neutral-600 dark:border-red-300/10 dark:bg-neutral-950 dark:text-neutral-300">
          {t("app.draft.empty")}
        </p>
      )}

      {exportError ? (
        <p className="mt-3 rounded-md border border-red-700/20 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 dark:border-red-300/20 dark:bg-red-950/25 dark:text-red-300">
          {exportError}
        </p>
      ) : null}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {hasPdfUrl ? (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-md border border-neutral-200 px-3 text-sm font-extrabold text-neutral-700 transition hover:-translate-y-0.5 hover:border-red-800 hover:text-red-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-red-300 dark:hover:text-red-200"
          >
            {t("app.draft.viewPdf")}
          </a>
        ) : null}

        {!hasPdfUrl ? (
          <button
            type="button"
            onClick={onExport}
            disabled={!canExport || isExporting}
            className="inline-flex h-10 items-center justify-center rounded-md bg-red-900 px-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-red-700 dark:hover:bg-red-600"
          >
            {isExporting ? t("app.draft.preparingPdf") : t("app.draft.exportPdf")}
          </button>
        ) : null}

        {!hasPdfUrl && !canExport && exportDisabledReason ? (
          <p className="basis-full text-xs font-bold leading-5 text-neutral-500 dark:text-neutral-400">
            {exportDisabledReason}
            {!canExportPdf ? (
              <>
                {" "}
                <a
                  href="/plans"
                  className="text-red-900 hover:text-red-700 dark:text-red-200 dark:hover:text-red-100"
                >
                  {t("app.draft.viewPlans")}
                </a>
              </>
            ) : null}
          </p>
        ) : null}
      </div>

      {status ? (
        <p className="mt-3 text-xs font-bold text-neutral-400">
          {t("app.draft.statusHint", {
            status,
          })}
        </p>
      ) : null}
    </section>
  );
}

function getDraftFromResponse(response) {
  return getDraftObject(response?.complainDraft ?? response);
}

function isNotFoundError(error) {
  return getApiErrorStatus(error) === 404;
}

function getReadyState(status) {
  const normalizedStatus = String(status ?? "")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();

  if (status === 3 || normalizedStatus === "3" || normalizedStatus === "ready") {
    return "ready";
  }

  if (status === 0 || normalizedStatus === "0" || normalizedStatus === "pending") {
    return "pending";
  }

  if (
    status === 1 ||
    normalizedStatus === "1" ||
    normalizedStatus === "processing" ||
    normalizedStatus === "in_progress"
  ) {
    return "processing";
  }

  if (
    status === 2 ||
    normalizedStatus === "2" ||
    normalizedStatus === "needs_info" ||
    normalizedStatus === "needsinfo"
  ) {
    return "needsInfo";
  }

  if (status === 4 || normalizedStatus === "4" || normalizedStatus === "failed") {
    return "failed";
  }

  return "unknown";
}

function isHttpUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    return false;
  }

  try {
    const url = new URL(value);

    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function getExportedDraftPdfUrl(response) {
  if (!response || typeof response !== "object") {
    return null;
  }

  const url = response.pdf_url ?? response.pdfUrl;

  if (typeof url !== "string") {
    return null;
  }

  const normalizedUrl = url.trim();

  return isHttpUrl(normalizedUrl) ? normalizedUrl : null;
}

function ComplaintWorkspacePage({ complaintId }) {
  const { i18n, t } = useTranslation();
  const { refreshSubscription, subscription: authSubscription } = useAuth();
  const { navigate } = useRouter();
  const fileInputRef = useRef(null);
  const [complaint, setComplaint] = useState(null);
  const [messages, setMessages] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [draft, setDraft] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [messagesError, setMessagesError] = useState("");
  const [evidenceError, setEvidenceError] = useState("");
  const [draftError, setDraftError] = useState("");
  const [isExportingDraft, setIsExportingDraft] = useState(false);
  const [exportError, setExportError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingEvidence, setDeletingEvidence] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteComplaintOpen, setIsDeleteComplaintOpen] = useState(false);
  const [isDeletingComplaint, setIsDeletingComplaint] = useState(false);
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState("");
  const [actionError, setActionError] = useState(null);
  const displayTimeline = useMemo(
    () => buildEvidenceDisplayTimeline(messages, evidence),
    [messages, evidence],
  );

  const refreshMessagesAndEvidence = useCallback(async () => {
    const [messageResult, evidenceResult] = await Promise.allSettled([
      getComplaintMessages(complaintId),
      getComplaintEvidence(complaintId),
    ]);
    const nextMessages =
      messageResult.status === "fulfilled"
        ? unwrapApiArray(messageResult.value, ["complaintMessages", "messages"])
        : [];
    const nextEvidence =
      evidenceResult.status === "fulfilled"
        ? unwrapApiArray(evidenceResult.value, ["evidence", "files"])
        : [];

    setMessagesError(
      messageResult.status === "rejected"
        ? getApiErrorMessage(messageResult.reason, t("app.errors.messagesLoad"))
        : "",
    );
    setEvidenceError(
      evidenceResult.status === "rejected"
        ? getApiErrorMessage(evidenceResult.reason, t("app.errors.evidenceLoad"))
        : "",
    );
    setEvidence(nextEvidence);
    setMessages(nextMessages);
  }, [complaintId, t]);

  const loadWorkspace = useCallback(async () => {
    const complaintData = await getComplaint(complaintId);
    const nextComplaint = unwrapApiData(complaintData, ["complaint"]);
    const draftFromComplaint = getDraftObject(nextComplaint);
    const subscriptionRequest = authSubscription
      ? Promise.resolve(authSubscription)
      : refreshSubscription().catch(() => null);

    setComplaint(nextComplaint);
    setDraft(draftFromComplaint);
    setMessagesError("");
    setEvidenceError("");
    setDraftError("");

    const [messageResult, evidenceResult, draftResult, subscriptionResult] =
      await Promise.allSettled([
        getComplaintMessages(complaintId),
        getComplaintEvidence(complaintId),
        getComplaintDraft(complaintId),
        subscriptionRequest,
      ]);

    const nextMessages =
      messageResult.status === "fulfilled"
        ? unwrapApiArray(messageResult.value, ["complaintMessages", "messages"])
        : [];
    const nextEvidence =
      evidenceResult.status === "fulfilled"
        ? unwrapApiArray(evidenceResult.value, ["evidence", "files"])
        : [];

    if (messageResult.status === "rejected") {
      setMessagesError(
        getApiErrorMessage(messageResult.reason, t("app.errors.messagesLoad")),
      );
    }

    if (evidenceResult.status === "rejected") {
      setEvidenceError(
        getApiErrorMessage(evidenceResult.reason, t("app.errors.evidenceLoad")),
      );
    }

    if (draftResult.status === "fulfilled") {
      setDraft(getDraftFromResponse(draftResult.value) ?? draftFromComplaint);
    } else if (isNotFoundError(draftResult.reason)) {
      setDraft(draftFromComplaint);
    } else {
      setDraft(draftFromComplaint);
      setDraftError(
        getApiErrorMessage(draftResult.reason, t("app.errors.draftLoad")),
      );
    }

    setMessages(nextMessages);
    setEvidence(nextEvidence);

    if (subscriptionResult.status === "fulfilled") {
      setSubscription(subscriptionResult.value);
    }
  }, [authSubscription, complaintId, refreshSubscription, t]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      try {
        await loadWorkspace();

        if (isMounted) {
          setError("");
          setErrorType("");
        }
      } catch (loadError) {
        if (isMounted) {
          const errorDetails = getApiErrorDetails(loadError);
          const isNotFound = errorDetails.type === "notFound";

          setErrorType(isNotFound ? "notFound" : "generic");
          setError(
            isNotFound
              ? t("app.errors.complaintNotFound")
              : getApiErrorMessage(loadError, t("app.errors.workspaceLoad")),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [loadWorkspace, t]);

  async function handleSend(event) {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      return;
    }

    setIsSending(true);
    setActionError(null);

    try {
      const response = await sendComplaintMessage(complaintId, trimmedPrompt);
      setPrompt("");

      if (response?.assistantMessage) {
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            senderRole: "USER",
            messageContent: trimmedPrompt,
            sentTime: new Date().toISOString(),
          },
          {
            senderRole: "AGENT",
            messageContent: response.assistantMessage,
            sentTime: new Date().toISOString(),
          },
        ]);
        setComplaint((currentComplaint) =>
          mergeComplaintUpdate(currentComplaint, response),
        );

        if (response.draftContent) {
          setDraft((currentDraft) => ({
            ...(currentDraft ?? {}),
            draftContent: response.draftContent,
          }));
        }

        if (getReadyState(response.status) === "ready") {
          await loadWorkspace();
        }
      } else {
        await loadWorkspace();
      }
    } catch (sendError) {
      setActionError(getApiErrorDetails(sendError));
    } finally {
      setIsSending(false);
    }
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    event.target.value = "";
    setIsUploading(true);
    setActionError(null);

    try {
      const uploadResponse = await uploadEvidenceFile(file);
      const fileUrl = getEvidenceFileUrl(uploadResponse);

      if (!fileUrl) {
        throw new Error(t("app.errors.evidenceUrlMissing"));
      }

      await createEvidence({
        complaintId,
        fileUrl,
      });

      await refreshMessagesAndEvidence();
    } catch (uploadError) {
      setActionError({
        type: "generic",
        message: getApiErrorMessage(uploadError, t("app.errors.evidenceUpload")),
      });
    } finally {
      setIsUploading(false);
    }
  }

  async function handleDeleteEvidence() {
    const evidenceId = getEvidenceId(deletingEvidence);

    if (!evidenceId) {
      setDeletingEvidence(null);
      return;
    }

    setIsDeleting(true);
    setActionError(null);

    try {
      await deleteEvidence(evidenceId);
      await refreshMessagesAndEvidence();
      setDeletingEvidence(null);
    } catch (deleteError) {
      setActionError({
        type: "generic",
        message: getApiErrorMessage(deleteError, t("app.errors.evidenceDelete")),
      });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleDeleteComplaint() {
    setIsDeletingComplaint(true);
    setActionError(null);

    try {
      await deleteComplaint(complaintId);
      setIsDeleteComplaintOpen(false);
      navigate("/complaints");
    } catch (deleteError) {
      setActionError({
        type: "generic",
        message: getApiErrorMessage(deleteError, t("app.errors.complaintDelete")),
      });
      setIsDeleteComplaintOpen(false);
    } finally {
      setIsDeletingComplaint(false);
    }
  }

  async function handleExportDraft() {
    setIsExportingDraft(true);
    setExportError("");

    try {
      const response = await exportComplaintDraft(complaintId);
      const pdfUrl = getExportedDraftPdfUrl(response);

      if (!pdfUrl) {
        throw new Error(t("app.errors.draftPdfUrlMissing"));
      }

      setDraft((currentDraft) => ({
        ...(currentDraft ?? {}),
        pdfUrl,
      }));
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    } catch (exportDraftError) {
      const details = getApiErrorDetails(exportDraftError);

      if (details.type === "forbidden") {
        setExportError(t("app.errors.draftExportForbidden"));
      } else if (details.type === "aiUnavailable") {
        setExportError(t("app.errors.aiUnavailableDescription"));
      } else if (details.type === "server") {
        setExportError(t("app.errors.draftExport"));
      } else {
        setExportError(
          getApiErrorMessage(exportDraftError, t("app.errors.draftExport")),
        );
      }
    } finally {
      setIsExportingDraft(false);
    }
  }

  function renderActionError() {
    if (!actionError) {
      return null;
    }

    if (actionError.type === "aiUnavailable") {
      return (
        <InlineAlert
          title={t("app.errors.aiUnavailableTitle")}
          description={t("app.errors.aiUnavailableDescription")}
          action={
            <button
              type="submit"
              disabled={isSending || !prompt.trim()}
              className="rounded-md bg-red-900 px-4 py-2 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-red-700 dark:hover:bg-red-600"
            >
              {t("app.common.retry")}
            </button>
          }
        />
      );
    }

    return (
      <InlineAlert
        title={actionError.message || t("app.errors.messageSend")}
      />
    );
  }

  if (isLoading) {
    return <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">{t("app.common.loading")}</p>;
  }

  if (error) {
    return (
      <EmptyState
        title={error}
        description={
          errorType === "notFound"
            ? t("app.errors.complaintNotFoundDescription")
            : t("app.errors.workspaceLoad")
        }
        action={
          <button
            type="button"
            onClick={() => navigate("/complaints")}
            className="inline-flex items-center justify-center rounded-md bg-red-900 px-4 py-2 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600"
          >
            {t("app.complaints.viewMyComplaints")}
          </button>
        }
      />
    );
  }

  const title = getComplaintTitle(complaint, t("app.complaints.untitled"));
  const status = getComplaintStatus(complaint);
  const domain = getComplaintDomain(complaint);
  const authority = getComplaintAuthority(complaint);
  const citations = getCitations(complaint);
  const missingInformation = getMissingInformation(complaint);
  const evidenceLimit = subscription?.maxEvidenceFilesPerComplaint;
  const usedEvidence = evidence.length;
  const hasEvidenceLimit = Number.isFinite(Number(evidenceLimit));
  const remainingEvidence = hasEvidenceLimit
    ? Number(evidenceLimit) - usedEvidence
    : null;
  const evidenceLimitReached = hasEvidenceLimit && remainingEvidence <= 0;
  const canUploadPdf = subscription?.canUploadPdf !== false;
  const canExportPdf = subscription?.canExportPdf === true;
  const readyState = getReadyState(status);

  return (
    <div className="space-y-6">
      <header className="rounded-md border border-red-900/10 bg-white p-5 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900 sm:p-6">
        <button
          type="button"
          onClick={() => navigate("/complaints")}
          className="inline-flex items-center gap-2 text-sm font-bold text-red-900 transition hover:-translate-y-0.5 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:text-red-200 dark:hover:text-red-100"
        >
          <FontAwesomeIcon icon={faArrowLeft} className={i18n.dir() === "rtl" ? "rotate-180" : ""} />
          <span>{t("app.workspace.back")}</span>
        </button>

        <div className="mt-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-extrabold text-neutral-950 dark:text-white sm:text-3xl">
              {title}
            </h1>
            {domain ? (
              <p className="mt-2 break-words text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                {domain}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <StatusBadge status={status} />
            <button
              type="button"
              onClick={() => setIsDeleteComplaintOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-red-700/20 px-3 py-2 text-sm font-bold text-red-800 transition hover:-translate-y-0.5 hover:border-red-800 hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 dark:border-red-300/20 dark:text-red-200 dark:hover:border-red-300 dark:hover:bg-red-300/10"
            >
              <FontAwesomeIcon icon={faTrash} />
              <span>{t("app.complaints.delete")}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,340px)]">
        <section className="flex min-h-[560px] min-w-0 flex-col rounded-md border border-red-900/10 bg-[#fffaf7] shadow-sm dark:border-red-300/10 dark:bg-neutral-900">
          <div className="border-b border-red-900/10 px-5 py-4 dark:border-red-300/10">
            <h2 className="text-lg font-extrabold text-neutral-950 dark:text-white">
              {t("app.workspace.conversation")}
            </h2>
          </div>

          <div className="min-w-0 flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messagesError ? (
              <InlineAlert
                title={t("app.errors.messagesLoad")}
                description={messagesError}
              />
            ) : null}
            {displayTimeline.length > 0 ? (
              displayTimeline.map((item, index) => (
                <MessageBubble
                  key={`${item.type}-${item.id}-${index}`}
                  item={item}
                />
              ))
            ) : (
              <div className="rounded-md border border-red-900/10 bg-white p-5 text-center dark:border-red-300/10 dark:bg-neutral-950">
                <FontAwesomeIcon
                  icon={faScaleBalanced}
                  className="text-2xl text-red-900 dark:text-red-200"
                />
                <p className="mt-3 text-sm font-semibold leading-6 text-neutral-600 dark:text-neutral-300">
                  {t("app.workspace.noMessages")}
                </p>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="border-t border-red-900/10 p-4 dark:border-red-300/10"
          >
            {actionError ? <div className="mb-3">{renderActionError()}</div> : null}
            <div className="flex min-w-0 flex-col gap-3 md:flex-row">
              <button
                type="button"
                disabled={isUploading || evidenceLimitReached}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-neutral-200 px-4 py-3 text-sm font-bold text-neutral-700 transition hover:-translate-y-0.5 hover:border-red-800 hover:text-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:text-neutral-200 dark:hover:border-red-300 dark:hover:text-red-200"
              >
                <FontAwesomeIcon icon={faPaperclip} />
                <span>{isUploading ? t("app.evidence.uploading") : t("app.evidence.attach")}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={canUploadPdf ? undefined : "image/*,.jpg,.jpeg,.png,.webp"}
                onChange={handleFileChange}
              />
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={2}
                placeholder={t("app.workspace.messagePlaceholder")}
                className="min-h-12 min-w-0 flex-1 rounded-md border border-red-900/20 bg-white px-4 py-3 text-sm text-neutral-950 outline-none transition focus:border-red-900 focus:ring-2 focus:ring-red-900/12 dark:border-red-300/15 dark:bg-neutral-950 dark:text-white"
              />
              <button
                type="submit"
                disabled={isSending || !prompt.trim()}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-red-900 px-5 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-red-700 dark:hover:bg-red-600"
              >
                <span>{isSending ? t("app.workspace.sending") : t("app.workspace.send")}</span>
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </form>
        </section>

        <aside className="min-w-0 space-y-4">
          <section className="rounded-md border border-red-900/10 bg-white p-5 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900">
            <h2 className="text-lg font-extrabold text-neutral-950 dark:text-white">
              {t("app.workspace.details")}
            </h2>
            <div className="mt-3">
              <DetailRow label={t("app.workspace.status")} value={<StatusBadge status={status} />} />
              <DetailRow label={t("app.workspace.domain")} value={domain || t("app.workspace.notDetermined")} />
              <DetailRow label={t("app.workspace.authority")} value={authority || t("app.workspace.notDetermined")} />
            </div>
          </section>

          <DraftPanel
            canExportPdf={canExportPdf}
            draft={draft}
            draftError={draftError}
            exportError={exportError}
            isExporting={isExportingDraft}
            onExport={handleExportDraft}
            readyState={readyState}
            status={status}
          />

          {missingInformation.length > 0 ? (
            <section className="rounded-md border border-red-900/10 bg-[#fff8f4] p-5 text-start dark:border-red-300/10 dark:bg-neutral-900">
              <h2 className="text-lg font-extrabold text-neutral-950 dark:text-white">
                {t("app.workspace.missingInfo")}
              </h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-700 dark:text-neutral-200">
                {missingInformation.map((item) => (
                  <li key={item} className="flex min-w-0 gap-2">
                    <span className="shrink-0 text-red-900 dark:text-red-200">
                      &bull;
                    </span>
                    <span className="min-w-0 break-words">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="rounded-md border border-red-900/10 bg-white p-5 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900">
            <h2 className="text-lg font-extrabold text-neutral-950 dark:text-white">
              {t("app.evidence.title")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {hasEvidenceLimit
                ? t("app.evidence.limitUsed", {
                    used: usedEvidence,
                    total: evidenceLimit,
                  })
                : t("app.evidence.attachDescription")}
            </p>
            {!canUploadPdf ? (
              <p className="mt-2 text-xs font-bold text-neutral-500 dark:text-neutral-400">
                {t("app.evidence.pdfNotIncluded")}
              </p>
            ) : null}
            {evidenceLimitReached ? (
              <p className="mt-2 text-xs font-bold text-red-700 dark:text-red-300">
                {t("app.evidence.limitReached", { total: evidenceLimit })}
              </p>
            ) : null}
            <div className="mt-4 space-y-3">
              {evidenceError ? (
                <InlineAlert
                  title={t("app.errors.evidenceLoad")}
                  description={evidenceError}
                />
              ) : null}
              {evidence.length > 0 ? (
                evidence.map((item, index) => (
                  <EvidenceCard
                    key={getEvidenceId(item) ?? index}
                    evidence={item}
                    onDelete={() => setDeletingEvidence(item)}
                  />
                ))
              ) : (
                <p className="rounded-md border border-red-900/10 bg-[#fff8f4] px-4 py-3 text-sm font-semibold text-neutral-600 dark:border-red-300/10 dark:bg-neutral-950 dark:text-neutral-300">
                  {t("app.evidence.empty")}
                </p>
              )}
            </div>
          </section>

          <section
            id="supporting-evidence"
            className="rounded-md border border-red-900/10 bg-white p-5 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900"
          >
            <h2 className="text-lg font-extrabold text-neutral-950 dark:text-white">
              {t("app.workspace.citations")}
            </h2>
            {citations.length > 0 ? (
              <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-700 dark:text-neutral-200">
                {citations.map((citation, index) => (
                  <CitationItem
                    key={citation?.id ?? `${citation?.documentName ?? "citation"}-${index}`}
                    citation={citation}
                  />
                ))}
              </ul>
            ) : (
              <p className="mt-3 rounded-md border border-red-900/10 bg-[#fff8f4] px-4 py-3 text-sm font-semibold text-neutral-600 dark:border-red-300/10 dark:bg-neutral-950 dark:text-neutral-300">
                {t("app.citations.empty")}
              </p>
            )}
          </section>
        </aside>
      </div>

      <ConfirmDialog
        isOpen={Boolean(deletingEvidence)}
        title={t("app.evidence.confirmTitle")}
        description={t("app.evidence.confirmDescription")}
        cancelLabel={t("app.common.cancel")}
        confirmLabel={isDeleting ? t("app.evidence.deleting") : t("app.evidence.delete")}
        isLoading={isDeleting}
        onCancel={() => setDeletingEvidence(null)}
        onConfirm={handleDeleteEvidence}
      />

      <ConfirmDialog
        isOpen={isDeleteComplaintOpen}
        title={t("app.complaints.confirmDeleteTitle")}
        description={t("app.complaints.confirmDeleteDescription")}
        cancelLabel={t("app.common.cancel")}
        confirmLabel={
          isDeletingComplaint
            ? t("app.complaints.deleting")
            : t("app.complaints.delete")
        }
        isLoading={isDeletingComplaint}
        onCancel={() => setIsDeleteComplaintOpen(false)}
        onConfirm={handleDeleteComplaint}
      />
    </div>
  );
}

export default ComplaintWorkspacePage;
