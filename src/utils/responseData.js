export function unwrapApiData(data, keys = []) {
  if (!data || typeof data !== "object") {
    return data;
  }

  for (const key of keys) {
    if (data[key] !== undefined) {
      return data[key];
    }
  }

  return data.data ?? data.result ?? data.value ?? data;
}

export function unwrapApiArray(data, keys = []) {
  const unwrapped = unwrapApiData(data, keys);

  if (Array.isArray(unwrapped)) {
    return unwrapped;
  }

  if (unwrapped && typeof unwrapped === "object") {
    for (const value of Object.values(unwrapped)) {
      if (Array.isArray(value)) {
        return value;
      }
    }
  }

  return [];
}

export function extractComplaintId(response) {
  if (!response || typeof response !== "object") {
    return null;
  }

  return (
    response.complaint_id?.complaintID ??
    response.complaint_id?.complaintId ??
    response.complaintID ??
    response.complaintId ??
    response.id ??
    null
  );
}

export function getEvidenceFileUrl(uploadResponse) {
  return (
    uploadResponse?.url ??
    uploadResponse?.fileUrl ??
    uploadResponse?.fileURL ??
    uploadResponse?.data?.url ??
    null
  );
}
