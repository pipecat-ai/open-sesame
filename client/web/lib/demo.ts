"use server";

import { DEMO_COOKIE_KEY } from "@/lib/authHeaders";
import { cookies } from "next/headers";

export async function createDemoUser() {
  try {
    const response = await fetch(`${process.env.SESAME_BASE_URL}/demo`, {
      method: "POST",
    });
    if (response.ok) {
      const json = await response.json();

      const date = new Date();
      // Expire after 365 days
      date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
      cookies().set(DEMO_COOKIE_KEY, json.token, {
        expires: date,
        secure: true,
      });

      return {
        token: json.token,
        workspace_id: json.workspace_id,
      };
    }
    throw new Error(await response.text());
  } catch (e: unknown) {
    return {
      error: "Failed to create demo user",
      detail: (e as Error).toString(),
    };
  }
}
