"use server";

import { EMAIL_COOKIE_KEY, LOGIN_COOKIE_KEY } from "@/lib/constants";
import { cookies } from "next/headers";

export async function getAuthToken() {
  const cookiez = await cookies();
  const loginToken = cookiez.has(LOGIN_COOKIE_KEY)
    ? cookiez.get(LOGIN_COOKIE_KEY)?.value
    : null;
  return process.env.SESAME_USER_TOKEN ?? loginToken;
}

export async function authHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getEmail() {
  const cookiez = await cookies();
  const email = !process.env.SESAME_USER_TOKEN
    ? cookiez.get(EMAIL_COOKIE_KEY)?.value
    : "";
  return email;
}
