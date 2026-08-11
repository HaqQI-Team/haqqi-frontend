import { getApiErrorMessage } from "../utils/apiError";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export class ApiError extends Error {
  constructor(message, { status, details, isNetworkError = false } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.isNetworkError = isNetworkError;
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (response.status === 204) {
    return null;
  }

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const headers = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Network error", { isNetworkError: true });
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    const apiError = new ApiError(
      getApiErrorMessage({ status: response.status, details: data }, ""),
      {
        status: response.status,
        details: data,
      },
    );

    throw apiError;
  }

  return data;
}
