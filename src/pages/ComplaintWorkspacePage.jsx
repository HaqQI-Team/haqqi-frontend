import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
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
  getDraft,
  getEvidenceId,
  getMessageContent,
  getMessageTime,
  getMissingInformation,
  isUserMessage,
} from "../utils/complaintData";
import { filterGeneratedEvidenceMessages } from "../utils/evidenceMessages";
import { getApiErrorDetails, getApiErrorMessage } from "../utils/apiError";
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

function MessageBubble({ message }) {
  const { i18n, t } = useTranslation();
  const isUser = isUserMessage(message);
  const content = getMessageContent(message);
  const time = formatDate(getMessageTime(message), i18n.language);

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

function ComplaintWorkspacePage({ complaintId }) {
  const { i18n, t } = useTranslation();
  const { refreshSubscription, subscription: authSubscription } = useAuth();
  const { navigate } = useRouter();
  const fileInputRef = useRef(null);
  const [complaint, setComplaint] = useState(null);
  const [messages, setMessages] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingEvidence, setDeletingEvidence] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteComplaintOpen, setIsDeleteComplaintOpen] = useState(false);
  const [isDeletingComplaint, setIsDeletingComplaint] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState(null);

  const loadWorkspace = useCallback(async () => {
    const subscriptionRequest = authSubscription
      ? Promise.resolve(authSubscription)
      : refreshSubscription().catch(() => null);
    const [complaintData, messageData, evidenceData, subscriptionData] =
      await Promise.all([
        getComplaint(complaintId),
        getComplaintMessages(complaintId),
        getComplaintEvidence(complaintId),
        subscriptionRequest,
      ]);

    const nextMessages = unwrapApiArray(messageData, [
      "complaintMessages",
      "messages",
    ]);
    const nextEvidence = unwrapApiArray(evidenceData, ["evidence", "files"]);

    setComplaint(unwrapApiData(complaintData, ["complaint"]));
    setMessages(filterGeneratedEvidenceMessages(nextMessages, nextEvidence));
    setEvidence(nextEvidence);
    setSubscription(subscriptionData);
  }, [authSubscription, complaintId, refreshSubscription]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        await loadWorkspace();

        if (isMounted) {
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getApiErrorMessage(loadError, t("app.errors.workspaceLoad")));
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

      const [messageData, evidenceData] = await Promise.all([
        getComplaintMessages(complaintId),
        getComplaintEvidence(complaintId),
      ]);
      const nextMessages = unwrapApiArray(messageData, [
        "complaintMessages",
        "messages",
      ]);
      const nextEvidence = unwrapApiArray(evidenceData, ["evidence", "files"]);

      setEvidence(nextEvidence);
      setMessages(filterGeneratedEvidenceMessages(nextMessages, nextEvidence));
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
      const [messageData, evidenceData] = await Promise.all([
        getComplaintMessages(complaintId),
        getComplaintEvidence(complaintId),
      ]);
      const nextMessages = unwrapApiArray(messageData, [
        "complaintMessages",
        "messages",
      ]);
      const nextEvidence = unwrapApiArray(evidenceData, ["evidence", "files"]);

      setEvidence(nextEvidence);
      setMessages(filterGeneratedEvidenceMessages(nextMessages, nextEvidence));
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
    return <EmptyState title={t("app.errors.workspaceLoad")} description={error} />;
  }

  const title = getComplaintTitle(complaint, t("app.complaints.untitled"));
  const status = getComplaintStatus(complaint);
  const domain = getComplaintDomain(complaint);
  const authority = getComplaintAuthority(complaint);
  const draft = getDraft(complaint);
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
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <MessageBubble
                  key={`${getMessageTime(message)}-${index}`}
                  message={message}
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
              <DetailRow label={t("app.workspace.draft")} value={draft || t("app.workspace.noDraft")} />
            </div>
          </section>

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

          {citations.length > 0 ? (
            <section className="rounded-md border border-red-900/10 bg-white p-5 text-start shadow-sm dark:border-red-300/10 dark:bg-neutral-900">
              <h2 className="text-lg font-extrabold text-neutral-950 dark:text-white">
                {t("app.workspace.citations")}
              </h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-neutral-700 dark:text-neutral-200">
                {citations.map((citation, index) => (
                  <li key={`${citation}-${index}`} className="break-words">
                    {String(citation)}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
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
