import {
  getAuthToken,
  clearAuthToken,
  clearRefreshToken,
  refreshToken,
} from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT;

export function getBaseUrl(): string {
  const base = API_BASE_URL ?? "";
  if (!base) {
    // Default to same-origin; adjust as needed
    return "";
  }
  return base.replace(/\/$/, "");
}

// Generic GraphQL request using current Bearer token
export async function graphql<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const url = API_BASE_URL + `api/graphql`;
  const token = getAuthToken();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
    credentials: "include",
  });

  // Handle 401 Unauthorized - try to refresh token and retry
  if (res.status === 401) {
    try {
      await refreshToken();
      // Retry the request with new token
      const newToken = getAuthToken();
      const retryRes = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
        },
        body: JSON.stringify({ query, variables }),
        credentials: "include",
      });
      const retryData = await retryRes.json();
      if (!retryRes.ok || retryData?.errors) {
        const message =
          retryData?.errors?.[0]?.message ||
          "GraphQL request failed after token refresh";
        throw new Error(message);
      }
      return retryData.data as T;
    } catch (refreshError) {
      // If refresh fails, clear tokens and throw original error
      clearAuthToken();
      clearRefreshToken();
      throw new Error("Authentication failed. Please log in again.");
    }
  }

  const data = await res.json();
  if (!res.ok || data?.errors) {
    const message = data?.errors?.[0]?.message || "GraphQL request failed";
    throw new Error(message);
  }
  return data.data as T;
}

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${getBaseUrl()}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    credentials: "include",
    ...options,
  });

  // Handle 401 Unauthorized - try to refresh token and retry
  if (res.status === 401) {
    try {
      await refreshToken();
      // Retry the request with new token
      const newToken = getAuthToken();
      const retryRes = await fetch(`${getBaseUrl()}${path}`, {
        headers: {
          "Content-Type": "application/json",
          ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
          ...(options.headers || {}),
        },
        credentials: "include",
        ...options,
      });
      const isJson = retryRes.headers
        .get("content-type")
        ?.includes("application/json");
      const retryData = isJson ? await retryRes.json() : await retryRes.text();
      if (!retryRes.ok) {
        const message =
          typeof retryData === "string"
            ? retryData
            : retryData?.message || "Request failed after token refresh";
        throw new Error(message);
      }
      return retryData as T;
    } catch (refreshError) {
      // If refresh fails, clear tokens and throw original error
      clearAuthToken();
      clearRefreshToken();
      throw new Error("Authentication failed. Please log in again.");
    }
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message =
      typeof data === "string" ? data : data?.message || "Request failed";
    throw new Error(message);
  }
  return data as T;
}

export { request };
