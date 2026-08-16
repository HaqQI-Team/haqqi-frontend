import { getApiErrorMessage } from "../utils/apiError";
import {
  clearStoredAuthTokens,
  getStoredAuthTokens,
  storeAuthTokens,
} from "../utils/authTokens";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

const REFRESH_EXCLUDED_PATHS = new Set([
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/User/register",
  "/api/User/verify-email",
  "/api/User/resend-otp",
]);

let authHandlers = {};
let refreshPromise = null;

export class ApiError extends Error {
  constructor(message, { status, details, isNetworkError = false } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
    this.isNetworkError = isNetworkError;
  }
}

export function setApiAuthHandlers(handlers) {
  authHandlers = handlers ?? {};
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (response.status === 204) {
    return null;
  }

  if (contentType.includes("application/json")) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  return response.text();
}

function createApiError(status, details) {
  return new ApiError(getApiErrorMessage({ status, details }, ""), {
    status,
    details,
  });
}

function shouldAttemptRefresh(path, { skipAuth, retryOnUnauthorized }) {
  return (
    retryOnUnauthorized !== false &&
    !skipAuth &&
    !REFRESH_EXCLUDED_PATHS.has(path)
  );
}

function getRequestToken(explicitToken, skipAuth) {
  if (skipAuth) {
    return null;
  }

  const storedAccessToken = getStoredAuthTokens().accessToken;

  return storedAccessToken || explicitToken || null;
}

async function sendRequest(path, { method, body, skipAuth }, activeToken) {
  const headers = {};
  const isFormData = body instanceof FormData;

  if (body !== undefined && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (activeToken && !skipAuth) {
    headers.Authorization = `Bearer ${activeToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined || isFormData ? body : JSON.stringify(body),
    });
    const data = await parseResponse(response);

    return { response, data };
  } catch {
    throw new ApiError("Network error", { isNetworkError: true });
  }
}

async function refreshAuthTokens() {
  const { accessToken, refreshToken } = getStoredAuthTokens();

  if (!accessToken || !refreshToken) {
    throw new ApiError("Missing refresh token", { status: 401 });
  }

  const { response, data } = await sendRequest(
    "/api/auth/refresh",
    {
      method: "POST",
      body: {
        accessToken,
        refreshToken,
      },
      skipAuth: true,
    },
    null,
  );

  if (!response.ok) {
    throw createApiError(response.status, data);
  }

  const nextTokens = storeAuthTokens({
    accessToken: data?.accessToken,
    refreshToken: data?.refreshToken,
  });

  if (!nextTokens) {
    throw new ApiError("Refresh succeeded, but tokens were not returned.", {
      status: 401,
      details: data,
    });
  }

  authHandlers.onTokensUpdated?.(nextTokens);

  return nextTokens.accessToken;
}

async function getRefreshedAccessToken() {
  if (!refreshPromise) {
    refreshPromise = refreshAuthTokens().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

function clearAuthAfterRefreshFailure() {
  clearStoredAuthTokens();
  authHandlers.onAuthCleared?.();
}

export async function apiRequest(
  path,
  {
    method = "GET",
    body,
    token,
    skipAuth = false,
    retryOnUnauthorized = true,
  } = {},
) {
  const requestOptions = {
    method,
    body,
    skipAuth,
  };
  const activeToken = getRequestToken(token, skipAuth);
  const { response, data } = await sendRequest(path, requestOptions, activeToken);

  if (response.ok) {
    return data;
  }

  const error = createApiError(response.status, data);

  if (
    response.status !== 401 ||
    !shouldAttemptRefresh(path, { skipAuth, retryOnUnauthorized })
  ) {
    throw error;
  }

  try {
    const refreshedAccessToken = await getRefreshedAccessToken();
    const retryResult = await sendRequest(
      path,
      requestOptions,
      refreshedAccessToken,
    );

    if (!retryResult.response.ok) {
      throw createApiError(retryResult.response.status, retryResult.data);
    }

    return retryResult.data;
  } catch (refreshError) {
    clearAuthAfterRefreshFailure();
    throw refreshError;
  }
}
