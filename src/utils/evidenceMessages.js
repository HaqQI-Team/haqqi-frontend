import {
  getEvidenceId,
  getEvidenceProcessedText,
  getEvidenceUploadedAt,
  getMessageContent,
  getMessageTime,
} from "./complaintData";

export const EVIDENCE_UPLOAD_MESSAGE_TYPE = "evidence";

const EVIDENCE_MESSAGE_PREFIX = "Evidence: ";

export function normalizeEvidenceText(text) {
  if (typeof text !== "string") {
    return "";
  }

  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

function normalizeEvidenceGeneratedMessage(text) {
  const normalized = normalizeEvidenceText(text);

  if (normalized.startsWith(EVIDENCE_MESSAGE_PREFIX)) {
    return normalized.slice(EVIDENCE_MESSAGE_PREFIX.length);
  }

  return normalized;
}

function isExactUserRole(message) {
  const role = String(message?.senderRole ?? message?.role ?? "").trim();

  return role.toLowerCase() === "user";
}

export function isGeneratedEvidenceMessage(message, evidenceItems) {
  if (!isExactUserRole(message)) {
    return false;
  }

  const messageContent = normalizeEvidenceGeneratedMessage(getMessageContent(message));

  if (!messageContent) {
    return false;
  }

  return evidenceItems.some((evidence) => {
    const processedText = normalizeEvidenceText(getEvidenceProcessedText(evidence));

    return Boolean(processedText) && processedText === messageContent;
  });
}

function getTimestampValue(value) {
  const timestamp = Date.parse(value);

  return Number.isFinite(timestamp) ? timestamp : null;
}

function createMessageItems(messages, evidenceItems) {
  return messages
    .filter((message) => !isGeneratedEvidenceMessage(message, evidenceItems))
    .map((message, index) => ({
      type: "message",
      id: message?.id ?? message?.messageId ?? `message-${index}`,
      sentTime: getMessageTime(message),
      message,
      sourceOrder: index,
    }));
}

function createEvidenceItems(evidenceItems, sourceOrderOffset) {
  const seenEvidenceIds = new Set();

  return evidenceItems.reduce((items, evidence, index) => {
    const evidenceId = getEvidenceId(evidence);
    const dedupeKey = evidenceId ? String(evidenceId) : `evidence-index-${index}`;

    if (seenEvidenceIds.has(dedupeKey)) {
      return items;
    }

    seenEvidenceIds.add(dedupeKey);
    items.push({
      type: EVIDENCE_UPLOAD_MESSAGE_TYPE,
      id: dedupeKey,
      evidenceId,
      sentTime: getEvidenceUploadedAt(evidence),
      sourceOrder: sourceOrderOffset + index,
    });

    return items;
  }, []);
}

export function buildEvidenceDisplayTimeline(messages, evidenceItems) {
  if (!Array.isArray(messages) || !Array.isArray(evidenceItems)) {
    return [];
  }

  const messageItems = createMessageItems(messages, evidenceItems);
  const evidenceDisplayItems = createEvidenceItems(evidenceItems, messages.length);

  return [...messageItems, ...evidenceDisplayItems].sort((a, b) => {
    const aTime = getTimestampValue(a.sentTime);
    const bTime = getTimestampValue(b.sentTime);

    if (aTime !== null && bTime !== null && aTime !== bTime) {
      return aTime - bTime;
    }

    return a.sourceOrder - b.sourceOrder;
  });
}
