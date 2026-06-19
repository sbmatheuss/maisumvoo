import { randomBytes } from "crypto";
import { getCache, setCache, delCache } from "./redis";
import { cookies } from "next/headers";

const COOKIE_NAME = "sid";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 days

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

export async function createSession(user: SessionUser): Promise<string> {
  const sessionId = randomBytes(32).toString("hex");
  await setCache(`session:${sessionId}`, user, SESSION_TTL);
  return sessionId;
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionId) return null;
  return getCache<SessionUser>(`session:${sessionId}`);
}

export async function destroySession(): Promise<void> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (sessionId) {
    await delCache(`session:${sessionId}`);
  }
}

export function getSessionCookieOptions(sessionId: string) {
  return {
    name: COOKIE_NAME,
    value: sessionId,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_TTL,
    path: "/",
  };
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
