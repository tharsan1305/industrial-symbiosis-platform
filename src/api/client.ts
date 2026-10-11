export class ApiError extends Error {
  public status: number;
  public code?: string;
  public details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const isMockMode = (): boolean => {
  const envVal = import.meta.env.VITE_USE_MOCKS;
  return envVal === 'true' || envVal === true || !import.meta.env.VITE_API_URL;
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('reloop_auth_token');
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('reloop_auth_token', token);
  } else {
    localStorage.removeItem('reloop_auth_token');
  }
};

const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.reloop.eco/v1';

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      // Clear token and emit auth error
      setAuthToken(null);
      throw new ApiError('Session expired. Please sign in again.', 401, 'UNAUTHORIZED');
    }

    if (res.status === 403) {
      throw new ApiError('Access forbidden. Additional permissions or approved verification required.', 403, 'FORBIDDEN');
    }

    if (res.status === 429) {
      const retryAfter = res.headers.get('Retry-After') || '60';
      throw new ApiError(`Too many requests. Please retry in ${retryAfter} seconds.`, 429, 'RATE_LIMITED');
    }

    if (!res.ok) {
      let errorBody: any = {};
      try {
        errorBody = await res.json();
      } catch {
        errorBody = { message: res.statusText };
      }
      throw new ApiError(errorBody.message || 'API request failed', res.status, errorBody.code, errorBody);
    }

    return (await res.json()) as T;
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err?.message || 'Network error occurred', 500, 'NETWORK_ERROR');
  }
}
