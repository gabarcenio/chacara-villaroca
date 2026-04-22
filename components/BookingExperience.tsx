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
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 40,
            background: "rgba(12,10,8,0.96)",
            borderTop: "1px solid rgba(250,248,244,0.12)",
            padding: "16px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backdropFilter: "blur(8px)",
            fontFamily: "var(--font-inter)",
          }}
        >
          <div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(250,248,244,0.5)", letterSpacing: "1.8px", textTransform: "uppercase", display: "block", marginBottom: 4 }}>
              Selecionado
            </span>
            <span style={{ fontFamily: "var(--font-fraunces)", fontSize: 20, fontWeight: 360, letterSpacing: "-0.4px", color: "#faf8f4" }}>
              {selectedDates.length} {selectedDates.length === 1 ? "data" : "datas"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => setSelectedDates([])}
              style={{ background: "transparent", border: "none", color: "rgba(250,248,244,0.5)", fontSize: 13, fontWeight: 500, cursor: "pointer", padding: "8px 4px", fontFamily: "var(--font-inter)" }}
            >
              Limpar
            </button>
            <button
              onClick={() => setShowForm(true)}
              style={{
                background: "#faf8f4",
                border: "none",
                color: "#0c0a08",
                fontSize: 13,
                fontWeight: 500,
                padding: "12px 20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-inter)",
                letterSpacing: "0.2px",
              }}
            >
              Solicitar orçamento
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 7h8M7.5 3.5L11 7l-3.5 3.5" /></svg>
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
