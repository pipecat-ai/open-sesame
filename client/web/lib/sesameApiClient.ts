"use server";

import authHeaders, { DEMO_COOKIE_KEY } from "@/lib/authHeaders";
import { cookies } from "next/headers";
import { Api, RequestParams } from "./sesameApi";

export const getApiClient = async (
  baseApiParams: Omit<RequestParams, "baseUrl" | "signal" | "cancelToken"> = {}
) => {
  const headers = authHeaders();

  const demoToken = cookies().get(DEMO_COOKIE_KEY);

  if (demoToken) {
    headers.Authorization = `Bearer ${demoToken.value}`;
  }

  return new Api({
    baseUrl: process.env.SESAME_BASE_URL,
    baseApiParams: {
      headers,
      ...baseApiParams,
    },
  });
};
