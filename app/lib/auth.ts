export type Role = "youth" | "counsellor" | "researcher" | "admin";

export interface Session {
  sub: string;
  pseudonym: string;
  role: Role;
  exp: number;
}

// Route prefix First match wins (order matters).
export const ROUTE_ROLES: [string, Role[]][] = [
  ["/admin", ["admin"]],
  ["/dashboard/alerts", ["counsellor", "admin"]],
  ["/dashboard", ["counsellor", "researcher", "admin"]],
  ["/home", ["youth", "admin"]],
  ["/checkin", ["youth", "admin"]],
  ["/journal", ["youth", "admin"]],
  ["/support", ["youth", "admin"]],
  ["/settings", ["youth", "counsellor", "researcher", "admin"]],
];

export const PUBLIC_PREFIXES = ["/auth", "/crisis", "/resources", "/_next", "/favicon", "/manifest", "/sw.js"];

// Decode (NOT verify) a JWT payload. The backend verifies the signature;
// this only drives UI routing. Works on the Edge runtime and in the browser.
export function decodeJwt(token: string | undefined): Session | null {
  if (!token) return null;
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(part).split("").map(c => "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join("")
    );
    const s = JSON.parse(json) as Session;
    if (s.exp && s.exp * 1000 < Date.now()) return null;
    return s;
  } catch {
    return null;
  }
}

export function canAccess(path: string, role: Role): boolean {
  const rule = ROUTE_ROLES.find(([prefix]) => path.startsWith(prefix));
  return rule ? rule[1].includes(role) : true;
}

export function homeFor(role: Role): string {
  return role === "youth" ? "/home" : "/dashboard";
}