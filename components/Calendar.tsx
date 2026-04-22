"use client";

import { getDaysInMonth } from "date-fns";
import { useState } from "react";
import type { ReactNode } from "react";
import { VENUE } from "@/lib/constants";
import {
  formatVenueMonthLabel,
  getVenueDayOfWeek,
  isPastVenueDate,
  makeVenueDate,
  nowInVenueTimeZone,
  toVenueDateKey,
} from "@/lib/date";

// ── Design tokens ──────────────────────────────────────────────────────────────
const INK    = "#0c0a08";
const PAPER  = "#faf8f4";
const YELLOW = "#ffd23f";
const LINE   = "rgba(250,248,244,0.12)";

type CalendarState = "available" | "pending" | "confirmed" | "blocked";

type CalendarDay = {
  key: string;
  date: Date;
  dayNumber: number;
  state: CalendarState;
};

type CalendarProps = {
  pendingDateKeys: Set<string>;
  confirmedDateKeys: Set<string>;
  blockedDateKeys: Set<string>;
  selectedDateKeys: Set<string>;
  onToggleDate: (date: Date) => void;
  loading?: boolean;
};

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const stateLabels: Record<CalendarState, string> = {
  available: "disponível",
  pending: "em análise",
  confirmed: "reservado",
  blocked: "indisponível",
};

function generateCalendarDays(
  year: number,
  month: number,
  pendingDateKeys: Set<string>,
  confirmedDateKeys: Set<string>,
  blockedDateKeys: Set<string>,
) {
  const firstDay = makeVenueDate(year, month, 1);
  const startingDayOfWeek = getVenueDayOfWeek(firstDay);
  const daysInMonth = getDaysInMonth(firstDay);
  const days: Array<CalendarDay | null> = [];

  for (let i = 0; i < startingDayOfWeek; i++) days.push(null);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = makeVenueDate(year, month, day);
    const key = toVenueDateKey(date);
    const isPast = isPastVenueDate(date);

    let state: CalendarState = "available";
    if (isPast || blockedDateKeys.has(key)) state = "blocked";
    else if (confirmedDateKeys.has(key)) state = "confirmed";
    else if (pendingDateKeys.has(key)) state = "pending";

    days.push({ key, date, dayNumber: day, state });
  }

  return days;
}

export function Calendar({
  pendingDateKeys,
  confirmedDateKeys,
  blockedDateKeys,
  selectedDateKeys,
  onToggleDate,
  loading = false,
}: CalendarProps) {
  const today = nowInVenueTimeZone();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const days = generateCalendarDays(
    currentYear,
    currentMonth,
    pendingDateKeys,
    confirmedDateKeys,
    blockedDateKeys,
  );

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  return (
    <section
      id="disponibilidade"
      style={{ background: INK, padding: "64px 48px 56px", fontFamily: "var(--font-inter)" }}
    >
      {/* ── Hero heading ── */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(250,248,244,0.55)", letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 18 }}>
          Disponibilidade · Escolha sua data
        </div>
        <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: 48, fontWeight: 280, lineHeight: 1.04, letterSpacing: "-0.9px", margin: "0 0 20px", color: PAPER, fontVariationSettings: '"opsz" 144' }}>
          Veja quando a VillaRoça<br />está livre.
        </h2>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "rgba(250,248,244,0.65)", maxWidth: 520, fontWeight: 300 }}>
          Selecione uma ou mais datas disponíveis para solicitar um orçamento
          personalizado. Respondemos em minutos durante o horário de atendimento.
        </p>
      </div>

      {/* ── Month navigation ── */}
      <div style={{ padding: "24px 0", borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <NavBtn onClick={handlePrevMonth} label="Mês anterior">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 2L4 7l5 5" /></svg>
        </NavBtn>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(250,248,244,0.5)", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 6 }}>Mês</div>
          <div style={{ fontFamily: "var(--font-fraunces)", fontSize: 30, fontWeight: 320, letterSpacing: "-0.6px", color: PAPER, textTransform: "capitalize" }}>
            {formatVenueMonthLabel(currentYear, currentMonth)}
          </div>
        </div>

        <NavBtn onClick={handleNextMonth} label="Próximo mês">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M5 2l5 5-5 5" /></svg>
        </NavBtn>
      </div>

      {/* ── Weekday labels ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, padding: "18px 0 6px" }}>
        {weekDays.map((d) => (
          <div key={d} style={{ textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "1.8px", textTransform: "uppercase", color: "rgba(250,248,244,0.5)" }}>
            {d}
          </div>
        ))}
      </div>

      {/* ── Calendar grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, padding: "0 0 24px", opacity: loading ? 0.4 : 1, transition: "opacity 0.2s" }}>
        {days.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} style={{ height: 72 }} />;

          const isSelectable = day.state === "available";
          const isSelected = selectedDateKeys.has(day.key);

          const numColor = isSelected ? INK
            : day.state === "available" ? PAPER
            : day.state === "pending" ? "rgba(250,248,244,0.8)"
            : day.state === "confirmed" ? "rgba(250,248,244,0.35)"
            : "rgba(250,248,244,0.22)";

          return (
            <button
              key={day.key}
              onClick={() => isSelectable && onToggleDate(day.date)}
              disabled={!isSelectable}
              aria-label={`${day.dayNumber}, ${stateLabels[day.state]}`}
              aria-pressed={isSelected}
              style={{
                height: 72,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: isSelected ? YELLOW : "transparent",
                border: isSelected ? `1px solid ${YELLOW}` : "1px solid transparent",
                borderRadius: 4,
                cursor: isSelectable ? "pointer" : "not-allowed",
                color: numColor,
                fontSize: 15,
                fontWeight: isSelected ? 600 : 400,
                letterSpacing: "-0.1px",
                fontFamily: "var(--font-inter)",
                textDecoration: day.state === "blocked" ? "line-through" : "none",
                textDecorationColor: "rgba(250,248,244,0.25)",
                transition: "background 0.15s, border-color 0.15s",
              }}
            >
              <span>{day.dayNumber}</span>
              {day.state === "available" && !isSelected && (
                <span style={{ width: 4, height: 4, borderRadius: 999, background: YELLOW, display: "block" }} />
              )}
              {day.state === "pending" && (
                <span style={{ width: 5, height: 5, borderRadius: 999, border: "1px solid rgba(250,248,244,0.5)", display: "block" }} />
              )}
              {day.state === "confirmed" && (
                <span style={{ width: 4, height: 4, borderRadius: 999, background: "rgba(250,248,244,0.35)", display: "block" }} />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Legend ── */}
      <div style={{ padding: "20px 0 16px", borderTop: `1px solid ${LINE}`, display: "flex", gap: 28, flexWrap: "wrap" }}>
        <LegendItem sym={<Dot bg={YELLOW} />} label="Disponível" />
        <LegendItem sym={<span style={{ width: 7, height: 7, borderRadius: 999, border: "1px solid rgba(250,248,244,0.5)", display: "inline-block" }} />} label="Em análise" />
        <LegendItem sym={<Dot bg="rgba(250,248,244,0.35)" />} label="Reservado" />
        <LegendItem sym={<span style={{ width: 14, height: 1, background: "rgba(250,248,244,0.25)", display: "inline-block", marginBottom: 1 }} />} label="Bloqueado" />
      </div>

      <p style={{ fontSize: 12, color: "rgba(250,248,244,0.4)", margin: 0, fontFamily: "var(--font-mono)", letterSpacing: "0.5px" }}>
        Capacidade: {VENUE.capacity.total} convidados · Hospedagem: {VENUE.capacity.beds} camas · Preços sob orçamento
      </p>
    </section>
  );
}

function NavBtn({ onClick, label, children }: { onClick: () => void; label: string; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      style={{ background: "transparent", border: "1px solid rgba(250,248,244,0.2)", width: 36, height: 36, borderRadius: 999, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(250,248,244,0.7)" }}
    >
      {children}
    </button>
  );
}

function Dot({ bg }: { bg: string }) {
  return <span style={{ width: 6, height: 6, borderRadius: 999, background: bg, display: "inline-block" }} />;
}

function LegendItem({ sym, label }: { sym: ReactNode; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(250,248,244,0.7)" }}>
      {sym}
      <span>{label}</span>
    </span>
  );
}
