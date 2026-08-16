function tryParseJson(value) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue.startsWith("{") && !trimmedValue.startsWith("[")) {
    return value;
  }

  try {
    return JSON.parse(trimmedValue);
  } catch {
    return value;
  }
}

function getParsedMessage(error) {
  return tryParseJson(error?.message);
}

export function getApiErrorData(error) {
  return tryParseJson(error?.response?.data ?? error?.details ?? null);
}

export function getApiErrorStatus(error) {
  const data = getApiErrorData(error);
  const parsedMessage = getParsedMessage(error);

  return (
    error?.response?.status ??
    error?.status ??
    (data && typeof data === "object" ? data.status : undefined) ??
    (parsedMessage && typeof parsedMessage === "object"
      ? parsedMessage.status
      : undefined)
  );
}

export function isNetworkError(error) {
  return Boolean(error?.isNetworkError) || (!getApiErrorStatus(error) && !getApiErrorData(error));
}

function collectValidationMessages(errors) {
  if (!errors || typeof errors !== "object") {
    return [];
  }

  return Object.values(errors)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter((value) => typeof value === "string" && value.trim())
    .map((value) => value.trim());
}

function normalizeFieldErrors(errors) {
  if (!errors || typeof errors !== "object") {
    return {};
  }

  return Object.entries(errors).reduce((fieldErrors, [field, value]) => {
    const messages = (Array.isArray(value) ? value : [value])
      .filter((item) => typeof item === "string" && item.trim())
      .map((item) => item.trim());

    if (messages.length > 0) {
      fieldErrors[field] = messages;
    }

    return fieldErrors;
  }, {});
}

export function getApiFieldErrors(error) {
  const data = getApiErrorData(error);
  const parsedMessage = getParsedMessage(error);
  const sources = [data, parsedMessage].filter(
    (value) => value && typeof value === "object",
  );

  return sources.reduce((fieldErrors, source) => {
    const normalizedErrors = normalizeFieldErrors(source.errors);

    return {
      ...fieldErrors,
      ...normalizedErrors,
    };
  }, {});
}

export function getApiErrorMessage(error, fallback) {
  const data = getApiErrorData(error);
  const status = getApiErrorStatus(error);
  const parsedMessage = getParsedMessage(error);

  if (typeof data === "string" && data.trim()) {
    return data.trim();
  }

  if (data && typeof data === "object") {
    if (typeof data.error === "string" && data.error.trim()) {
      return data.error.trim();
    }

    if (typeof data.message === "string" && data.message.trim()) {
      return data.message.trim();
    }

    const validationMessages = collectValidationMessages(data.errors);

    if (validationMessages.length > 0) {
      return validationMessages.join(" ");
    }
  }

  if (parsedMessage && typeof parsedMessage === "object") {
    if (typeof parsedMessage.error === "string" && parsedMessage.error.trim()) {
      return parsedMessage.error.trim();
    }

    if (typeof parsedMessage.message === "string" && parsedMessage.message.trim()) {
      return parsedMessage.message.trim();
    }

    const validationMessages = collectValidationMessages(parsedMessage.errors);

    if (validationMessages.length > 0) {
      return validationMessages.join(" ");
    }
  }

  if (!status && typeof error?.message === "string" && error.message.trim()) {
    return error.message.trim();
  }

  return fallback;
}

export function getApiErrorDetails(error) {
  const data = getApiErrorData(error);
  const parsedMessage = getParsedMessage(error);
  const status = getApiErrorStatus(error);
  const message = getApiErrorMessage(error, "");
  const titleCandidates = [data, parsedMessage]
    .filter((value) => value && typeof value === "object")
    .map((value) => value.title)
    .filter((value) => typeof value === "string");
  const title = titleCandidates.join(" ");
  const normalizedMessage = `${message} ${title}`.toLowerCase();

  if (isNetworkError(error)) {
    return { type: "network", status, message };
  }

  if (normalizedMessage.includes("active complaints limit")) {
    return { type: "activeComplaintLimit", status, message };
  }

  if (
    status === 502 ||
    normalizedMessage.includes("ai service is currently unavailable")
  ) {
    return { type: "aiUnavailable", status, message };
  }

  if (status === 401) {
    return { type: "unauthorized", status, message };
  }

  if (status === 403) {
    return { type: "forbidden", status, message };
  }

  if (status === 404) {
    return { type: "notFound", status, message };
  }

  if (status === 409) {
    return { type: "conflict", status, message };
  }

  if (status >= 500) {
    return { type: "server", status, message };
  }

  if (data && typeof data === "object" && data.errors) {
    return { type: "validation", status, message };
  }

  return { type: "generic", status, message };
}
