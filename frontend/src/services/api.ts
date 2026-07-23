export const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api').replace(/\/+$/, '');

export class ApiError<T = unknown> extends Error {
  status: number;
  data?: T;

  constructor(message: string, status: number, data?: T) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;
type ApiRequestInit = RequestInit & {
  query?: QueryParams;
};

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function isJsonBody(body: BodyInit | object | null | undefined): body is Record<string, unknown> {
  return Boolean(body) && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob);
}

function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('token');
}

function clearSession() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('user');
  window.localStorage.removeItem('fullName');
  window.localStorage.removeItem('username');
  window.localStorage.removeItem('role');
}

export function buildQuery(params?: QueryParams) {
  const searchParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    searchParams.set(key, String(value));
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export function resolveApiUrl(path: string, query?: QueryParams) {
  const base = isAbsoluteUrl(path) ? path : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  return `${base}${buildQuery(query)}`;
}

async function parseResponseBody(response: Response) {
  const contentType = response.headers.get('content-type') || '';

  if (response.status === 204) return null;
  if (contentType.includes('application/json')) return response.json();

  const text = await response.text();
  return text || null;
}

export async function apiRequest<T>(path: string, init: ApiRequestInit = {}): Promise<T> {
  const { query, headers, body, ...rest } = init;
  const token = getAccessToken();
  const requestHeaders = new Headers(headers || {});

  if (token && !requestHeaders.has('Authorization')) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  let requestBody: BodyInit | undefined;

  if (isJsonBody(body)) {
    requestHeaders.set('Content-Type', 'application/json');
    requestBody = JSON.stringify(body);
  } else if (body !== undefined && body !== null) {
    requestBody = body as BodyInit;
  }

  const response = await fetch(resolveApiUrl(path, query), {
    ...rest,
    headers: requestHeaders,
    body: requestBody,
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
    }

    const message =
      (typeof data === 'object' && data && 'message' in data && typeof data.message === 'string' && data.message) ||
      response.statusText ||
      'Request failed';

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, init?: Omit<ApiRequestInit, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...init, method: 'GET' }),
  post: <T>(path: string, body?: BodyInit | object | null, init?: Omit<ApiRequestInit, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...init, method: 'POST', body }),
  put: <T>(path: string, body?: BodyInit | object | null, init?: Omit<ApiRequestInit, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...init, method: 'PUT', body }),
  patch: <T>(path: string, body?: BodyInit | object | null, init?: Omit<ApiRequestInit, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...init, method: 'PATCH', body }),
  delete: <T>(path: string, init?: Omit<ApiRequestInit, 'method' | 'body'>) =>
    apiRequest<T>(path, { ...init, method: 'DELETE' }),
};

export default api;
