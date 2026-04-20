import { RENTAL } from "@/lib/constants";
import { toVenueDateKey } from "@/lib/date";

export type QuoteStatus = "pending" | "quoted" | "accepted" | "declined" | "expired";

export type QuoteRequest = {
  id: string;
  eventType: string;
  guestCount: number;
  dateKeys: string[];
  startTime: string;
  endTime: string;
  services: string[];
  name: string;
  email: string;
  phone: string;
  message: string;
  marketingOptIn: boolean;
  status: QuoteStatus;
  createdAt: string;
};

export type QuoteDraft = Omit<QuoteRequest, "id" | "status" | "createdAt">;

export function validateQuoteDraft(draft: QuoteDraft) {
  const errors: Partial<Record<keyof QuoteDraft, string>> = {};

  if (!draft.eventType) {
    errors.eventType = "Selecione o tipo de evento";
  }

  if (!Number.isInteger(draft.guestCount) || draft.guestCount <= 0) {
    errors.guestCount = "Informe o número de convidados";
  } else if (draft.guestCount > 60) {
    errors.guestCount = "Capacidade máxima: 60 convidados";
  }

  if (!draft.dateKeys.length) {
    errors.dateKeys = "Selecione ao menos uma data";
  }

  if (!draft.name.trim()) {
    errors.name = "Nome obrigatório";
  }

  if (!draft.email.trim()) {
    errors.email = "E-mail obrigatório";
  } else if (!/\S+@\S+\.\S+/.test(draft.email)) {
    errors.email = "E-mail inválido";
  }

  if (!draft.phone.trim()) {
    errors.phone = "Telefone obrigatório";
  }

  return errors;
}

export function createQuoteRequest(draft: QuoteDraft): QuoteRequest {
  return {
    ...draft,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date(Date.now()).toISOString(),
  };
}

export function createDraftFromDates(dates: Date[]): Pick<QuoteDraft, "dateKeys" | "startTime" | "endTime"> {
  return {
    dateKeys: dates.map(toVenueDateKey),
    startTime: RENTAL.defaultCheckIn,
    endTime: RENTAL.defaultCheckOut,
  };
}
