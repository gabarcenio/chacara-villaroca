"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { createDraftFromDates, type QuoteDraft, validateQuoteDraft } from "@/lib/quotes";
import { formatVenueDateLong } from "@/lib/date";
import { getPriceRange, formatBRL } from "@/lib/pricing";

type QuoteFormProps = {
  selectedDates: Date[];
  onClose: () => void;
  onSubmit: (data: QuoteDraft) => void;
};

type FormErrors = Partial<Record<keyof QuoteDraft, string>>;

const eventTypes = ["Casamento", "Aniversário", "Confraternização", "Corporativo", "Retiro familiar", "Outro"];
const availableServices = ["Decoração", "Buffet", "DJ/Música", "Fotografia", "Bar premium", "Churrasqueira"];

export function QuoteForm({ selectedDates, onClose, onSubmit }: QuoteFormProps) {
  const dateDefaults = useMemo(() => createDraftFromDates(selectedDates), [selectedDates]);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<QuoteDraft>({
    ...dateDefaults,
    eventType: "",
    guestCount: 0,
    services: [],
    name: "",
    email: "",
    phone: "",
    message: "",
    marketingOptIn: false,
  });

  const datesLabel = selectedDates.length === 1
    ? formatVenueDateLong(selectedDates[0])
    : `${selectedDates.length} datas selecionadas`;

  const priceEstimate = useMemo(
    () => getPriceRange(formData.eventType, selectedDates.length),
    [formData.eventType, selectedDates.length],
  );

  const validateStep = (currentStep: number) => {
    const nextErrors = validateQuoteDraft(formData);
    const visibleErrors: FormErrors = {};

    if (currentStep === 1) {
      if (nextErrors.eventType) visibleErrors.eventType = nextErrors.eventType;
      if (nextErrors.guestCount) visibleErrors.guestCount = nextErrors.guestCount;
      if (nextErrors.dateKeys) visibleErrors.dateKeys = nextErrors.dateKeys;
    }

    if (currentStep === 2) {
      if (nextErrors.name) visibleErrors.name = nextErrors.name;
      if (nextErrors.email) visibleErrors.email = nextErrors.email;
      if (nextErrors.phone) visibleErrors.phone = nextErrors.phone;
    }

    setErrors(visibleErrors);
    return Object.keys(visibleErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(1)) setStep(2);
  };

  const handleSubmit = () => {
    if (validateStep(2)) onSubmit(formData);
  };

  const toggleService = (service: string) => {
    setFormData((current) => ({
      ...current,
      services: current.services.includes(service)
        ? current.services.filter((s) => s !== service)
        : [...current.services, service],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center" role="dialog" aria-modal="true">
      <button className="absolute inset-0 cursor-default bg-black/55" onClick={onClose} aria-label="Fechar formulário" />

      <div className="relative max-h-[92svh] w-full overflow-y-auto rounded-t-lg bg-white shadow-2xl md:max-w-2xl md:rounded-lg">
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-white px-5 py-4 md:px-8">
          <div>
            <p className="text-primary" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.25rem" }}>
              solicitar orçamento
            </p>
            <h3 className="text-xl capitalize">{datesLabel}</h3>
            {selectedDates.length > 1 ? (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {selectedDates.map((date) => (
                  <span
                    key={date.toISOString()}
                    className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {formatVenueDateLong(date)}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Fechar"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        <div className="p-5 md:p-8">
          <div className="mb-8 flex items-center gap-2" aria-hidden="true">
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-secondary"}`} />
          </div>

          {errors.dateKeys ? (
            <p className="mb-5 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{errors.dateKeys}</p>
          ) : null}

          {step === 1 ? (
            <div className="space-y-6">
              <Field label="Tipo de evento" error={errors.eventType}>
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData((current) => ({ ...current, eventType: type }))}
                      className={`rounded-lg border px-4 py-2 transition-all ${
                        formData.eventType === type
                          ? "border-primary bg-primary text-white"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </Field>

              {priceEstimate ? (
                <div className="rounded-lg border border-accent/40 bg-accent/10 px-4 py-3 text-sm">
                  <p className="mb-0.5 text-xs font-semibold uppercase tracking-wide text-primary/50">Preço estimado</p>
                  <p className="text-base font-semibold text-primary">
                    {formatBRL(priceEstimate.min)} – {formatBRL(priceEstimate.max)}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Entrada de 30% para confirmar · valor final definido pelo proprietário
                  </p>
                </div>
              ) : null}

              <Field label="Número de convidados" error={errors.guestCount}>
                <input
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max={60}
                  value={formData.guestCount || ""}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      guestCount: Number.parseInt(event.target.value, 10) || 0,
                    }))
                  }
                  className="w-full rounded-lg border-2 border-transparent bg-input-background px-4 py-3 outline-none transition-colors focus:border-primary"
                  placeholder="Máximo 60 pessoas"
                />
              </Field>

              <Field label="Serviços adicionais">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {availableServices.map((service) => (
                    <button
                      key={service}
                      onClick={() => toggleService(service)}
                      className={`rounded-lg border px-4 py-3 text-left transition-all ${
                        formData.services.includes(service)
                          ? "border-primary bg-primary text-white"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </Field>

              <button onClick={handleNext} className="w-full rounded-lg bg-primary py-4 text-white transition-all hover:bg-primary/90">
                Continuar
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <Field label="Nome completo" error={errors.name}>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-lg border-2 border-transparent bg-input-background px-4 py-3 outline-none transition-colors focus:border-primary"
                  placeholder="Seu nome"
                />
              </Field>

              <Field label="E-mail" error={errors.email}>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-lg border-2 border-transparent bg-input-background px-4 py-3 outline-none transition-colors focus:border-primary"
                  placeholder="seu@email.com"
                />
              </Field>

              <Field label="Telefone/WhatsApp" error={errors.phone}>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
                  className="w-full rounded-lg border-2 border-transparent bg-input-background px-4 py-3 outline-none transition-colors focus:border-primary"
                  placeholder="(17) 00000-0000"
                />
              </Field>

              <Field label="Mensagem">
                <textarea
                  value={formData.message}
                  onChange={(event) => setFormData((current) => ({ ...current, message: event.target.value }))}
                  rows={4}
                  className="w-full resize-none rounded-lg border-2 border-transparent bg-input-background px-4 py-3 outline-none transition-colors focus:border-primary"
                  placeholder="Conte mais sobre seu evento"
                />
              </Field>

              <label className="flex items-start gap-3 rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={formData.marketingOptIn}
                  onChange={(event) => setFormData((current) => ({ ...current, marketingOptIn: event.target.checked }))}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                Aceito receber novidades e lembretes da Chácara VillaRoça por e-mail ou WhatsApp.
              </label>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-lg bg-secondary py-4 text-primary transition-all hover:bg-secondary/80"
                >
                  Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 rounded-lg bg-primary py-4 text-white transition-all hover:bg-primary/90"
                >
                  Solicitar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label className="mb-2 block">{label}</label>
      {children}
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
