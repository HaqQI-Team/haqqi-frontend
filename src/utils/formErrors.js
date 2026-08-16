import { getApiFieldErrors } from "./apiError";

function findFieldMessages(apiFieldErrors, fieldName) {
  const normalizedFieldName = fieldName.toLowerCase();
  const matchedEntry = Object.entries(apiFieldErrors).find(
    ([apiFieldName]) => apiFieldName.toLowerCase() === normalizedFieldName,
  );

  return matchedEntry?.[1] ?? [];
}

export function applyApiFieldErrors(error, setError, fieldNames) {
  const apiFieldErrors = getApiFieldErrors(error);
  let hasAppliedFieldError = false;

  fieldNames.forEach((fieldName) => {
    const messages = findFieldMessages(apiFieldErrors, fieldName);

    if (messages.length > 0) {
      setError(fieldName, {
        type: "server",
        message: messages.join(" "),
      });
      hasAppliedFieldError = true;
    }
  });

  return hasAppliedFieldError;
}
