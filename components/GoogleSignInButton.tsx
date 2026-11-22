"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth/client";
import { notify } from "@/lib/notifications";

type GoogleSignInButtonProps = {
  label: string;
};

function getGoogleRedirectUrls(origin: string, search: string) {
  const requestedNext = new URLSearchParams(search).get("next");
  let destination = new URL("/kabnet", origin);

  if (requestedNext?.startsWith("/") && !requestedNext.startsWith("//") && !requestedNext.includes("\\")) {
    const candidate = new URL(requestedNext, origin);
    if (candidate.origin === new URL(origin).origin) destination = candidate;
  }

  destination.searchParams.set("auth", "google-success");

  const errorDestination = new URL("/kirish", origin);
  errorDestination.searchParams.set("auth", "google-error");

  return {
    callbackURL: destination.toString(),
    errorCallbackURL: errorDestination.toString(),
  };
}

export function GoogleSignInButton({ label }: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const redirects = getGoogleRedirectUrls(window.location.origin, window.location.search);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        ...redirects,
      });

      if (error) {
        throw error;
      }
    } catch {
      setIsLoading(false);
      notify.error("Google orqali kirib bo‘lmadi. Iltimos, qayta urinib ko‘ring.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={isLoading}
      aria-busy={isLoading}
      className="group flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow disabled:cursor-wait disabled:opacity-60"
    >
      {isLoading ? (
        <LoaderCircle aria-hidden="true" className="size-5 animate-spin text-gray-500" />
      ) : (
        <FcGoogle aria-hidden="true" className="size-5" />
      )}
      <span>{isLoading ? "Google hisobiga ulanmoqda..." : label}</span>
    </button>
  );
}
