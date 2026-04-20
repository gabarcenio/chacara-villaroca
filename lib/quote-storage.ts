import type { QuoteRequest } from "@/lib/quotes";

const STORAGE_KEY = "villaroca.quoteRequests";

function canUseStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

export function listStoredQuotes(): QuoteRequest[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredQuote(quote: QuoteRequest) {
  const quotes = [quote, ...listStoredQuotes()];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));

  return quotes;
}

export function listPendingQuoteDateKeys() {
  return new Set(
    listStoredQuotes()
      .filter((quote) => quote.status === "pending")
      .flatMap((quote) => quote.dateKeys),
  );
}
