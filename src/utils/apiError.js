export function getApiErrorData(error) {
  return error?.response?.data ?? error?.details ?? null;
}

export function getApiErrorStatus(error) {
  return error?.response?.status ?? error?.status ?? getApiErrorData(error)?.status;
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

export function getApiErrorMessage(error, fallback) {
  const data = getApiErrorData(error);
  const status = getApiErrorStatus(error);

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

  if (!status && typeof error?.message === "string" && error.message.trim()) {
    return error.message.trim();
  }

  return fallback;
}
