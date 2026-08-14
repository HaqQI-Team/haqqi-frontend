import {
  getEvidenceProcessedText,
  getMessageContent,
  isUserMessage,
} from "./complaintData";

export function normalizeEvidenceText(text) {
  if (typeof text !== "string") {
    return "";
  }

  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

export function isGeneratedEvidenceMessage(message, evidenceItems) {
  if (!isUserMessage(message)) {
    return false;
  }

  const messageContent = normalizeEvidenceText(getMessageContent(message));

  if (!messageContent) {
    return false;
  }

  return evidenceItems.some((evidence) => {
    const processedText = normalizeEvidenceText(getEvidenceProcessedText(evidence));

    return Boolean(processedText) && processedText === messageContent;
  });
}

export function filterGeneratedEvidenceMessages(messages, evidenceItems) {
  if (!Array.isArray(messages) || !Array.isArray(evidenceItems)) {
    return [];
  }

  return messages.filter(
    (message) => !isGeneratedEvidenceMessage(message, evidenceItems),
  );
}
