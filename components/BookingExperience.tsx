"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Calendar } from "@/components/Calendar";
import { Confirmation } from "@/components/Confirmation";
import { Hero } from "@/components/Hero";
import { QuoteForm } from "@/components/QuoteForm";
import type { QuoteDraft } from "@/lib/quotes";
import { toVenueDateKey } from "@/lib/date";

type CalendarData = {
  pending: string[];
  confirmed: string[];
  blocked: string[];
};

type BookingSummary = {
  name: string;
  eventType: string;
  guestCount: number;
  dateKeys: string[];
  phone: string;
};

type BookingExperienceProps = {
  hero?: boolean;
  children?: ReactNode;
};

export function BookingExperience({ hero = true, children }: BookingExperienceProps) {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [lastBooking, setLastBooking] = useState<BookingSummary | null>(null);
  const [calendarData, setCalendarData] = useState<CalendarData>({ pending: [], confirmed: [], blocked: [] });
  const [calendarLoading, setCalendarLoading] = useState(true);
  const calendarRef = useRef<HTMLDivElement>(null);

  const fetchCalendar = useCallback(async () => {
    try {
      const res = await fetch("/api/calendar");
      if (res.ok) setCalendarData(await res.json());
    } finally {
      setCalendarLoading(false);
    }
  }, []);

  useEffect(() => { fetchCalendar(); }, [fetchCalendar]);

  const selectedDateKeys = useMemo(
    () => new Set(selectedDates.map(toVenueDateKey)),
    [selectedDates],
  );

  const pendingDateKeys = useMemo(() => new Set(calendarData.pending), [calendarData.pending]);
  const confirmedDateKeys = useMemo(() => new Set(calendarData.confirmed), [calendarData.confirmed]);
  const blockedDateKeys = useMemo(() => new Set(calendarData.blocked), [calendarData.blocked]);

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

  const handleSubmitQuote = async (draft: QuoteDraft) => {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dateKeys: draft.dateKeys,
        eventType: draft.eventType,
        guestCount: draft.guestCount,
        services: draft.services,
        name: draft.name,
        email: draft.email,
        phone: draft.phone,
        message: draft.message,
        marketingOptIn: draft.marketingOptIn,
        startTime: draft.startTime,
        endTime: draft.endTime,
      }),
    });

    if (!res.ok) return;

    setLastBooking({
      name: draft.name,
      eventType: draft.eventType,
      guestCount: draft.guestCount,
      dateKeys: draft.dateKeys,
      phone: draft.phone,
    });
    setSelectedDates([]);
    setShowForm(false);
    await fetchCalendar();
  };

  return (
    <>
      {hero ? <Hero onScrollToCalendar={handleScrollToCalendar} /> : null}

      {children}

      <div ref={calendarRef}>
        <Calendar
          pendingDateKeys={pendingDateKeys}
          confirmedDateKeys={confirmedDateKeys}
          blockedDateKeys={blockedDateKeys}
          selectedDateKeys={selectedDateKeys}
          onToggleDate={handleToggleDate}
          loading={calendarLoading}
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

      {lastBooking ? (
        <Confirmation booking={lastBooking} onClose={() => setLastBooking(null)} />
      ) : null}
    </>
  );
}
