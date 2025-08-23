import type { ApiError } from '../types';

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export async function api(path: string, { method = 'GET', body, headers, signal }: ApiOptions = {}) {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    // Response might be empty (e.g., 204 No Content)
  }

  if (!response.ok) {
    const error = data as ApiError;
    throw {
      status: response.status,
      ...(error || { message: response.statusText }),
    };
  }

  return data;
}

// Helper to generate idempotency key for write operations
export function generateIdempotencyKey(): string {
  return crypto.randomUUID();
}

// Helper to add auth header
export function withAuth(token: string, headers: Record<string, string> = {}) {
  return {
    ...headers,
    Authorization: `Bearer ${token}`,
  };
}
