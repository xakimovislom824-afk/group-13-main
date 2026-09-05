"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TaqqoslashPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/katalog");
  }, [router]);

  return null;
}
