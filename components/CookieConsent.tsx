"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "villaroca.cookieConsent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem(STORAGE_KEY) !== "accepted");
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-3xl rounded-lg border border-border bg-white p-4 shadow-2xl md:flex md:items-center md:justify-between md:gap-6">
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground md:mb-0">
        Usamos cookies essenciais e métricas para melhorar sua experiência. Você pode continuar usando o site sem aceitar comunicação de marketing.{" "}
        <Link className="text-primary underline" href="/privacidade">
          Privacidade
        </Link>
      </p>
      <button
        onClick={() => {
          window.localStorage.setItem(STORAGE_KEY, "accepted");
          setVisible(false);
        }}
        className="w-full rounded-lg bg-primary px-5 py-3 text-sm text-white md:w-auto"
      >
        Entendi
      </button>
    </div>
  );
}
