export function getComplaintTitle(complaint, fallback) {
  return complaint?.title?.trim?.() || fallback;
}

export function getComplaintStatus(complaint) {
  return complaint?.status || complaint?.complaintStatus || "";
}

export function getComplaintDomain(complaint) {
  return complaint?.domain || "";
}

export function getComplaintAuthority(complaint) {
  return complaint?.authorityName || complaint?.authority || "";
}

export function getUpdatedAt(complaint) {
  return complaint?.updatedAt || complaint?.createdAt || "";
}

export function getDraft(complaint) {
  return complaint?.draft ?? complaint?.draftContent ?? "";
}

export function getCitations(complaint) {
  const citations = complaint?.complaintCitations ?? complaint?.citations ?? [];

  return Array.isArray(citations) ? citations : [];
}

export function getMissingInformation(source) {
  const missing = source?.missingInformation ?? source?.missingInfo ?? [];

  if (Array.isArray(missing)) {
    return missing.filter(Boolean);
  }

  if (typeof missing === "string" && missing.trim()) {
    return [missing.trim()];
  }

  return [];
}

export function getMessageContent(message) {
  return message?.messageContent ?? message?.content ?? message?.text ?? "";
}

export function getMessageRole(message) {
  return String(message?.senderRole ?? message?.role ?? "").toLowerCase();
}

export function isUserMessage(message) {
  const role = getMessageRole(message);
  return role.includes("user");
}

export function getMessageTime(message) {
  return message?.sentTime ?? message?.createdAt ?? "";
}

export function getEvidenceName(evidence) {
  return (
    evidence?.fileName ??
    evidence?.name ??
    evidence?.originalFileName ??
    ""
  );
}

export function getEvidenceId(evidence) {
  return evidence?.id ?? evidence?.evidenceId ?? evidence?.evidenceID;
}

function normalizeDocumentUrl(value) {
  if (typeof value !== "string") {
    return "";
  }

  const trimmedValue = value.trim();
  const markdownLinkMatch = trimmedValue.match(/\]\(([^)]+)\)/);

  return markdownLinkMatch?.[1]?.trim() || trimmedValue;
}

export function getEvidenceUrl(evidence) {
  return normalizeDocumentUrl(
    evidence?.storagePath ?? evidence?.url ?? evidence?.fileUrl ?? evidence?.fileURL,
  );
}

export function getEvidenceUploadedAt(evidence) {
  return evidence?.uploadtedAt ?? evidence?.uploadedAt ?? evidence?.createdAt ?? "";
}

export function getEvidenceProcessedText(evidence) {
  return typeof evidence?.processedText === "string"
    ? evidence.processedText
    : "";
}

export function isEvidencePdf(evidence) {
  const url = getEvidenceUrl(evidence).split(/[?#]/)[0].toLowerCase();

  return url.endsWith(".pdf");
}
