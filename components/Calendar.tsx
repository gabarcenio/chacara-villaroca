"use client";

import { getDaysInMonth } from "date-fns";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VENUE } from "@/lib/constants";
import {
  formatVenueMonthLabel,
  getVenueDayOfWeek,
  isPastVenueDate,
  makeVenueDate,
  nowInVenueTimeZone,
  toVenueDateKey,
} from "@/lib/date";

type CalendarState = "available" | "pending" | "booked" | "blocked";

type CalendarDay = {
  key: string;
  date: Date;
  dayNumber: number;
  state: CalendarState;
};

type CalendarProps = {
  pendingDateKeys: Set<string>;
  selectedDateKeys: Set<string>;
  onToggleDate: (date: Date) => void;
};

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const seededBookedDates = new Set(["2026-05-09", "2026-05-23"]);

function generateCalendarDays(year: number, month: number, pendingDateKeys: Set<string>) {
  const firstDay = makeVenueDate(year, month, 1);
  const startingDayOfWeek = getVenueDayOfWeek(firstDay);
  const daysInMonth = getDaysInMonth(firstDay);
  const days: Array<CalendarDay | null> = [];

  for (let index = 0; index < startingDayOfWeek; index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = makeVenueDate(year, month, day);
    const key = toVenueDateKey(date);
    const isPast = isPastVenueDate(date);

    let state: CalendarState = "available";

    if (isPast) {
      state = "blocked";
    } else if (seededBookedDates.has(key)) {
      state = "booked";
    } else if (pendingDateKeys.has(key)) {
      state = "pending";
    }

    days.push({ key, date, dayNumber: day, state });
  }

  return days;
}

export function Calendar({ pendingDateKeys, selectedDateKeys, onToggleDate }: CalendarProps) {
  const today = nowInVenueTimeZone();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const days = generateCalendarDays(currentYear, currentMonth, pendingDateKeys);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
      return;
    }
    setCurrentMonth(currentMonth - 1);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
      return;
    }
    setCurrentMonth(currentMonth + 1);
  };

  return (
    <section className="w-full bg-primary px-5 py-16 md:py-24" id="disponibilidade">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="mb-2 text-accent" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.5rem" }}>
            escolha sua data
          </p>
          <h2 className="mb-4 text-3xl text-white md:text-4xl">Disponibilidade</h2>
          <p className="mx-auto max-w-2xl text-white/72">
            Selecione uma ou mais datas disponíveis para solicitar um orçamento personalizado.
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4 shadow-lg md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              aria-label="Mês anterior"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>

            <h3 className="text-xl capitalize text-white">{formatVenueMonthLabel(currentYear, currentMonth)}</h3>

            <button
              onClick={handleNextMonth}
              className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              aria-label="Próximo mês"
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </div>

          <div className="mb-3 grid grid-cols-7 gap-1.5 md:gap-2">
            {weekDays.map((day) => (
              <div key={day} className="py-2 text-center text-xs text-white/58 md:text-sm">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5 md:gap-2">
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const isSelectable = day.state === "available";
              const isSelected = selectedDateKeys.has(day.key);

              return (
                <button
                  key={day.key}
                  onClick={() => isSelectable && onToggleDate(day.date)}
                  disabled={!isSelectable}
                  aria-label={`${day.dayNumber}, ${stateLabels[day.state]}`}
                  aria-pressed={isSelected}
                  className={[
                    "relative flex aspect-square items-center justify-center rounded-lg text-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
                    isSelected ? "bg-accent text-primary font-semibold" : "text-white",
                    day.state === "available" && !isSelected ? "bg-white/[0.07] hover:bg-accent/20" : "",
                    day.state === "pending" ? "cursor-not-allowed border border-accent/60 text-white/60" : "",
                    day.state === "booked" ? "cursor-not-allowed bg-white/[0.02] text-white/35 line-through" : "",
                    day.state === "blocked" ? "cursor-not-allowed text-white/25" : "",
                  ].join(" ")}
                >
                  {day.dayNumber}
                  {day.state === "available" && !isSelected ? (
                    <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
                  ) : null}
                  {day.state === "pending" ? (
                    <span className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full border border-accent" />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-4 border-t border-white/15 pt-6 text-sm text-white/70">
            <LegendDot className="bg-accent" label="Disponível" />
            <LegendDot className="border border-accent" label="Em análise" />
            <LegendDot className="bg-white/20" label="Reservado" />
          </div>

          <p className="mt-5 text-sm text-white/55">
            Capacidade: {VENUE.capacity.total} convidados · Hospedagem: {VENUE.capacity.beds} camas · Preços sob orçamento.
          </p>
        </div>
      </div>
    </section>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${className}`} />
      {label}
    </span>
  );
}

const stateLabels: Record<CalendarState, string> = {
  available: "disponível",
  pending: "em análise",
  booked: "reservado",
  blocked: "indisponível",
};
