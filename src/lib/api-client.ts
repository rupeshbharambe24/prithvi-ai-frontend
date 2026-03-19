// API Client for backend communication
// Robust fetch wrapper with env-based base URL, CORS credentials, CSRF, refresh, and X-Request-ID

const base = (import.meta as any).env?.VITE_API_BASE_URL ?? (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_BASE_URL ?? '';
const prefix = (import.meta as any).env?.VITE_API_PREFIX ?? (globalThis as any)?.process?.env?.NEXT_PUBLIC_API_PREFIX ?? '';
const API_BASE_URL = `${base}${prefix}`;

export interface ApiOptions extends RequestInit {
  params?: Record<string, string>;
  skipRefreshRetry?: boolean;
}

function requestId(): string {
  try {
    // @ts-ignore
    return (crypto?.randomUUID?.() as string) ?? String(Date.now());
  } catch {
    return String(Date.now());
  }
}

function readCsrfToken(): string | undefined {
  const m = document.cookie.match(/(?:^|; )csrf_token=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : undefined;
}

async function _doFetch(url: string, options: ApiOptions = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Request-ID': requestId(),
    ...(options.headers as Record<string, string> | undefined),
  };
  // CSRF for mutating methods
  const method = (options.method ?? 'GET').toUpperCase();
  if (method === 'POST' || method === 'PATCH' || method === 'DELETE') {
    const csrf = readCsrfToken();
    if (csrf) headers['X-CSRF-Token'] = csrf;
  }
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });
}

async function apiFetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { params, skipRefreshRetry, ...fetchOptions } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const res = await _doFetch(url, fetchOptions);

  if (res.status === 401 && !skipRefreshRetry) {
    // Try refresh then retry once
    const refreshRes = await _doFetch(`${base}${prefix}/auth/refresh`, { method: 'POST' });
    if (refreshRes.ok) {
      const retry = await _doFetch(url, { ...fetchOptions, skipRefreshRetry: true });
      if (retry.ok) return retry.json();
      return handleApiError<T>(retry);
    }
  }

  if (!res.ok) {
    return handleApiError<T>(res);
  }
  return res.json();
}

async function handleApiError<T>(res: Response): Promise<T> {
  const reqId = res.headers.get('X-Request-ID') ?? 'unknown';
  let detail = res.statusText;
  try {
    const data = await res.json();
    detail = (data?.detail ?? data?.message ?? JSON.stringify(data));
  } catch {}
  // Lazy import toast to avoid circulars
  try {
    const { toast } = await import('sonner');
    toast.error(`Request failed (${res.status})`, { description: `${detail} (req ${reqId})` });
  } catch {}
  throw new Error(`API Error ${res.status}: ${detail} [${reqId}]`);
}

export { apiFetch };

// Backward-compatible api object used by rbac.ts, Status.tsx, Profile.tsx
export const api = {
  getRisk: apiFetch,
};
