"use client";

import { useEffect, useState } from "react";
import { parseVenueDateKey, formatVenueDateLong } from "@/lib/date";
import { listStoredQuotes } from "@/lib/quote-storage";
import type { QuoteRequest } from "@/lib/quotes";

export function LocalQuotesList() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);

  useEffect(() => {
    setQuotes(listStoredQuotes());
  }, []);

  if (quotes.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-white p-6">
        <h2 className="mb-2 text-xl text-primary">Nenhuma solicitação ainda</h2>
        <p className="text-muted-foreground">
          Quando você solicitar um orçamento neste navegador, ele aparecerá aqui como uma prévia do painel do cliente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <article key={quote.id} className="rounded-lg border border-border bg-white p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl text-primary">{quote.eventType}</h2>
            <span className="rounded-full bg-accent px-3 py-1 text-sm text-primary">Em análise</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quote.dateKeys.map((key) => (
              <span key={key} className="rounded-full bg-secondary px-2.5 py-0.5 text-sm text-muted-foreground">
                {formatVenueDateLong(parseVenueDateKey(key))}
              </span>
            ))}
          </div>
          <p className="mt-2 text-muted-foreground">
            {quote.guestCount} convidados · {quote.name} · {quote.phone}
          </p>
        </article>
      ))}
    </div>
  );
}
