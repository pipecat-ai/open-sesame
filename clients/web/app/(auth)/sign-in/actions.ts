"use server";

import { LOGIN_COOKIE_KEY } from "@/lib/constants";
import { getApiClient } from "@/lib/sesameApiClient";
import { cookies } from "next/headers";

export async function login(email: string, password: string) {
  const apiClient = await getApiClient();

  try {
    const { data, ok } =
      await apiClient.api.loginWithCredentialsApiAuthLoginPost({
        email,
        password,
      });
    if (ok && data.token) {
      const cookiez = await cookies();
      cookiez.set(LOGIN_COOKIE_KEY, data.token, {
        expires: Date.now() + 259200000,
      });
      return true;
    }
    return false;
  } catch (e) {
    console.error("error", e);
    return false;
  }
}
