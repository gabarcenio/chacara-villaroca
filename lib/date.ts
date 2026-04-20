import { getDaysInMonth } from "date-fns";
import { formatInTimeZone, fromZonedTime, toZonedTime } from "date-fns-tz";
import { VENUE } from "@/lib/constants";

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function nowInVenueTimeZone() {
  return toZonedTime(Date.now(), VENUE.timezone);
}

export function todayVenueDateKey() {
  return formatInTimeZone(Date.now(), VENUE.timezone, "yyyy-MM-dd");
}

export function makeVenueDate(year: number, monthIndex: number, day: number) {
  const month = String(monthIndex + 1).padStart(2, "0");
  const date = String(day).padStart(2, "0");

  return fromZonedTime(`${year}-${month}-${date}T12:00:00`, VENUE.timezone);
}

export function parseVenueDateKey(dateKey: string) {
  if (!DATE_KEY_PATTERN.test(dateKey)) {
    throw new Error(`Invalid venue date key: ${dateKey}`);
  }

  const [year, month, day] = dateKey.split("-").map(Number);

  return makeVenueDate(year, month - 1, day);
}

export function toVenueDateKey(date: Date) {
  return formatInTimeZone(date, VENUE.timezone, "yyyy-MM-dd");
}

export function getVenueDayOfWeek(date: Date) {
  return toZonedTime(date, VENUE.timezone).getDay();
}

export function formatVenueDateLong(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: VENUE.timezone,
  }).format(date);
}

export function formatVenueMonthLabel(year: number, monthIndex: number) {
  const date = makeVenueDate(year, monthIndex, 1);

  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: VENUE.timezone,
  }).format(date);
}

export function isPastVenueDate(date: Date) {
  const todayKey = todayVenueDateKey();
  const dateKey = toVenueDateKey(date);

  return dateKey < todayKey;
}

export function getDaysInMonthUtil(year: number, monthIndex: number) {
  return getDaysInMonth(makeVenueDate(year, monthIndex, 1));
}
