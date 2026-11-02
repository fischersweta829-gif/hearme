import type { Role } from "./auth";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include", // session cookie
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? res.statusText);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

const get = <T,>(p: string) => request<T>(p);
const post = <T,>(p: string, body?: unknown) =>
  request<T>(p, { method: "POST", body: JSON.stringify(body ?? {}) });

/* ---------- Types ---------- */
export interface Me { id: string; pseudonym: string; role: Role }
export interface SentimentResult {
  lang: "en" | "sw" | "sheng" | "mixed";
  sentiment: "positive" | "neutral" | "negative";
  emotion_probs: Record<string, number>;
  distress_flag: boolean;
}
export interface JournalEntry {
  id: string; text: string; created_at: string; analysis?: SentimentResult;
}

/* ---------- Auth ---------- */
export const api = {
  login: (pseudonym: string, password: string) => post<Me>("/auth/login", { pseudonym, password }),
  register: (data: {
    pseudonym: string; password: string; age_band: string;
    consent: boolean; guardian_consent?: boolean;
  }) => post<Me>("/auth/register", data),
  logout: () => post<void>("/auth/logout"),
  forgotPassword: (email: string) => post<void>("/auth/forgot", { email }),
  resetPassword: (token: string, password: string) => post<void>("/auth/reset", { token, password }),
  me: () => get<Me>("/auth/me"),

  /* ---------- Youth ---------- */
  submitCheckin: (mood: number, text?: string) =>
    post<{ analysis?: SentimentResult; support_message: string }>("/checkins", { mood, text }),
  listJournal: () => get<JournalEntry[]>("/journal"),
  getJournal: (id: string) => get<JournalEntry>(`/journal/${id}`),
  createJournal: (text: string) => post<JournalEntry>("/journal", { text }),

  /* ---------- Dashboard (stubs, wired up later) ---------- */
  sentimentSummary: () => get<unknown>("/dashboard/sentiment"),
  clusterSummary: () => get<unknown>("/dashboard/clusters"),
  modelComparison: () => get<unknown>("/dashboard/models"),
};