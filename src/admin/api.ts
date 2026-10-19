import type { Media, Message, Profile } from '../lib/types';
import type { AdminProject, ProjectPayload } from './model';

export const API_BASE = (import.meta.env.PUBLIC_API_URL ?? 'https://portfolio-api.builderization.com').replace(/\/$/, '');
const SESSION_SLOT = 'portfolio_admin_token';

export const UNAUTHORIZED_EVENT = 'admin:unauthorized';

export function getToken(): string | null {
  try {
    return sessionStorage.getItem(SESSION_SLOT);
  } catch {
    return null;
  }
}
export function setToken(t: string): void {
  try {
    sessionStorage.setItem(SESSION_SLOT, t);
  } catch {
    /* storage blocked: token stays in memory only */
    memToken = t;
  }
}
export function clearToken(): void {
  memToken = null;
  try {
    sessionStorage.removeItem(SESSION_SLOT);
  } catch {
    /* ignore */
  }
}
let memToken: string | null = null;
const token = () => getToken() ?? memToken;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function detailOf(body: unknown, fallback: string): string {
  const d = (body as { detail?: unknown } | null)?.detail;
  if (typeof d === 'string') return d;
  if (Array.isArray(d)) {
    return d
      .map((x) => {
        const e = x as { loc?: unknown[]; msg?: string };
        const field = Array.isArray(e.loc) ? e.loc.filter((l) => l !== 'body').join('.') : '';
        return field ? `${field}: ${e.msg ?? 'invalid'}` : (e.msg ?? 'invalid');
      })
      .join('; ');
  }
  return fallback;
}

async function request<T>(path: string, init: { method?: string; body?: unknown; auth?: boolean } = {}): Promise<T> {
  const headers: Record<string, string> = { accept: 'application/json' };
  if (init.body !== undefined) headers['content-type'] = 'application/json';
  const t = token();
  if (init.auth !== false && t) headers.authorization = `Bearer ${t}`;
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method: init.method ?? 'GET',
      headers,
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the API. Check your connection.');
  }
  if (res.status === 204) return undefined as T;
  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }
  if (!res.ok) {
    if (res.status === 401 && init.auth !== false) {
      clearToken();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    throw new ApiError(res.status, detailOf(data, `Request failed (${res.status})`));
  }
  return data as T;
}

function asList<T>(data: unknown, keys: string[]): T[] {
  if (Array.isArray(data)) return data as T[];
  for (const k of keys) {
    const v = (data as Record<string, unknown> | null)?.[k];
    if (Array.isArray(v)) return v as T[];
  }
  return [];
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; expires_at?: string }>('/api/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  me: () => request<{ email?: string; sub?: string }>('/api/auth/me'),

  listProjects: async () => asList<AdminProject>(await request<unknown>('/api/admin/projects'), ['projects', 'items']),
  getProject: (id: number) => request<AdminProject>(`/api/admin/projects/${id}`),
  createProject: (body: ProjectPayload) => request<AdminProject>('/api/admin/projects', { method: 'POST', body }),
  updateProject: (id: number, body: ProjectPayload) => request<AdminProject>(`/api/admin/projects/${id}`, { method: 'PUT', body }),
  deleteProject: (id: number) => request<void>(`/api/admin/projects/${id}`, { method: 'DELETE' }),
  reorder: (ids: number[]) => request<unknown>('/api/admin/projects/order', { method: 'PUT', body: { ids } }),
  setCover: (projectId: number, mediaId: number) =>
    request<unknown>(`/api/admin/projects/${projectId}/cover`, { method: 'PUT', body: { media_id: mediaId } }),

  patchMedia: (id: number, body: { alt?: string; sort?: number }) => request<Media>(`/api/admin/media/${id}`, { method: 'PATCH', body }),
  deleteMedia: (id: number) => request<void>(`/api/admin/media/${id}`, { method: 'DELETE' }),

  getProfile: () => request<Profile>('/api/admin/profile'),
  saveProfile: (body: Profile) => request<Profile>('/api/admin/profile', { method: 'PUT', body }),

  listMessages: async () => asList<Message>(await request<unknown>('/api/admin/messages'), ['messages', 'items']),
  markMessage: (id: number, read: boolean) => request<unknown>(`/api/admin/messages/${id}`, { method: 'PATCH', body: { read } }),
  deleteMessage: (id: number) => request<void>(`/api/admin/messages/${id}`, { method: 'DELETE' }),

  rebuild: () => request<{ ok?: boolean; detail?: string; message?: string }>('/api/admin/rebuild', { method: 'POST' }),
};

/** Upload one file with progress (XHR, because fetch has no upload progress). */
export function uploadMedia(projectId: number, file: File, onProgress: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/api/admin/projects/${projectId}/media`);
    const t = token();
    if (t) xhr.setRequestHeader('Authorization', `Bearer ${t}`);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onerror = () => reject(new ApiError(0, 'Network error during upload.'));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
        return;
      }
      if (xhr.status === 401) {
        clearToken();
        window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
      }
      let body: unknown = null;
      try {
        body = JSON.parse(xhr.responseText);
      } catch {
        /* ignore */
      }
      reject(new ApiError(xhr.status, detailOf(body, `Upload failed (${xhr.status})`)));
    };
    const fd = new FormData();
    fd.append('files', file);
    xhr.send(fd);
  });
}
