"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Calendar } from "@/components/Calendar";
import { Confirmation } from "@/components/Confirmation";
import { Hero } from "@/components/Hero";
import { QuoteForm } from "@/components/QuoteForm";
import { listPendingQuoteDateKeys, saveStoredQuote } from "@/lib/quote-storage";
import { createQuoteRequest, type QuoteDraft } from "@/lib/quotes";
import { toVenueDateKey } from "@/lib/date";

type BookingExperienceProps = {
  hero?: boolean;
  children?: ReactNode;
};

export function BookingExperience({ hero = true, children }: BookingExperienceProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingDateKeys, setPendingDateKeys] = useState<Set<string>>(() => new Set());
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPendingDateKeys(listPendingQuoteDateKeys());
  }, []);

  const selectedDateKeys = useMemo(
    () => new Set(selectedDates.map(toVenueDateKey)),
    [selectedDates],
  );

  const handleScrollToCalendar = () => {
    calendarRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleToggleDate = (date: Date) => {
    const key = toVenueDateKey(date);
    setSelectedDates((prev) => {
      const exists = prev.some((d) => toVenueDateKey(d) === key);
      if (exists) return prev.filter((d) => toVenueDateKey(d) !== key);
      return [...prev, date];
    });
  };

  const handleSubmitQuote = (draft: QuoteDraft) => {
    const quote = createQuoteRequest(draft);
    saveStoredQuote(quote);
    setPendingDateKeys(listPendingQuoteDateKeys());
    setSelectedDates([]);
    setShowForm(false);
    setShowConfirmation(true);
  };

  return (
    <>
      {hero ? <Hero onScrollToCalendar={handleScrollToCalendar} /> : null}

      {children}

      <div ref={calendarRef}>
        <Calendar
          pendingDateKeys={pendingDateKeys}
          selectedDateKeys={selectedDateKeys}
          onToggleDate={handleToggleDate}
        />
      </div>

      {selectedDates.length > 0 ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-primary px-5 py-4 shadow-2xl md:flex md:items-center md:justify-between">
          <p className="mb-3 text-white md:mb-0">
            <span className="font-semibold text-accent">{selectedDates.length}</span>{" "}
            {selectedDates.length === 1 ? "data selecionada" : "datas selecionadas"}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedDates([])}
              className="rounded-lg px-4 py-2.5 text-sm text-white/60 transition-colors hover:text-white"
            >
              Limpar
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-accent/90"
            >
              Solicitar orçamento
            </button>
          </div>
        </div>
      ) : null}

      {showForm ? (
        <QuoteForm
          selectedDates={selectedDates}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmitQuote}
        />
      ) : null}
      {showConfirmation ? <Confirmation onClose={() => setShowConfirmation(false)} /> : null}
    </>
  );
}
