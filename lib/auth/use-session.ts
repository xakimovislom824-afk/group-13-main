"use client";

import useSWR from "swr";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type AuthSession = {
  user: AppUser;
  session: { id: string; expiresAt: string };
};

const fetchSession = async (url: string): Promise<AuthSession | null> => {
  const response = await fetch(url, { credentials: "same-origin", cache: "no-store" });
  if (!response.ok) throw new Error("Could not load authentication session");
  return response.json();
};

export const AUTH_SESSION_KEY = "/api/auth/get-session";

export function useAuthSession() {
  return useSWR<AuthSession | null>(AUTH_SESSION_KEY, fetchSession, {
    revalidateOnFocus: true,
    shouldRetryOnError: false,
  });
}
