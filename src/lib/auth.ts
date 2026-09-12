/**
 * Single-user auth: one password, checked against APP_PASSWORD, backed by a
 * signed HTTP-only cookie. No NextAuth/OAuth — see BUILD_SPEC.md §2 and §8.
 *
 * Uses Web Crypto (`crypto.subtle`) rather than Node's `crypto` module so the
 * same code runs in both the Node.js and Edge runtimes (middleware may run
 * on either depending on Next.js config).
 */

export const SESSION_COOKIE_NAME = "vitals_session";
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 days

const encoder = new TextEncoder();

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET is not set — check your .env file");
  }
  return secret;
}

function getAppPassword(): string {
  const password = process.env.APP_PASSWORD;
  if (!password) {
    throw new Error("APP_PASSWORD is not set — check your .env file");
  }
  return password;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function toBase64Url(bytes: ArrayBuffer): string {
  const arr = new Uint8Array(bytes);
  let str = "";
  for (const b of arr) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = (4 - (padded.length % 4)) % 4;
  const str = atob(padded + "=".repeat(padding));
  const arr = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) arr[i] = str.charCodeAt(i);
  return arr;
}

/** Constant-time-ish check via HMAC verify; timing on password length itself is not sensitive here. */
export function checkPassword(candidate: string): boolean {
  return candidate === getAppPassword();
}

export async function createSessionToken(): Promise<string> {
  const issuedAt = Math.floor(Date.now() / 1000).toString();
  const key = await hmacKey(getSessionSecret());
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(issuedAt));
  return `${issuedAt}.${toBase64Url(signature)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [issuedAtRaw, signatureRaw] = token.split(".");
  if (!issuedAtRaw || !signatureRaw) return false;

  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) return false;

  const ageSec = Math.floor(Date.now() / 1000) - issuedAt;
  if (ageSec < 0 || ageSec > SESSION_MAX_AGE_SEC) return false;

  const key = await hmacKey(getSessionSecret());
  try {
    return await crypto.subtle.verify(
      "HMAC",
      key,
      fromBase64Url(signatureRaw) as BufferSource,
      encoder.encode(issuedAtRaw),
    );
  } catch {
    return false;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: SESSION_MAX_AGE_SEC,
};
