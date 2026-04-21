"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { VENUE } from "@/lib/constants";
import { formatBRL, calcInstallments } from "@/lib/pricing";

type BookingSummary = {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  guest_count: number;
  date_keys: string[];
  price_brl: number | null;
  installments: number;
  contract_status: string;
  client_cpf: string;
};

type FormState = {
  cpf: string;
  rg: string;
  birthDate: string;
  address: string;
  city: string;
  state: string;
  cep: string;
};

export default function ContratoPage() {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>({
    cpf: "",
    rg: "",
    birthDate: "",
    address: "",
    city: "",
    state: "",
    cep: "",
  });

  useEffect(() => {
    fetch(`/api/contrato/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setBooking(data);
        if (data.client_cpf) {
          setForm((prev) => ({ ...prev, cpf: data.client_cpf }));
        }
      })
      .catch(() => setError("Reserva não encontrada."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cpf || !form.rg || !form.birthDate || !form.address || !form.city || !form.state || !form.cep) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    setError("");
    setSubmitting(true);
    const res = await fetch(`/api/contrato/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setDone(true);
    } else {
      const d = await res.json();
      setError(d.error ?? "Erro ao enviar dados.");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary">
        <p className="text-muted-foreground">Carregando…</p>
      </div>
    );
  }

  if (!booking || error === "Reserva não encontrada.") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-secondary px-5 text-center">
        <p className="text-xl font-medium text-primary">Reserva não encontrada</p>
        <p className="mt-2 text-muted-foreground">Verifique o link enviado por e-mail.</p>
      </div>
    );
  }

  if (booking.contract_status === "signed") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-secondary px-5 text-center">
        <div className="rounded-2xl bg-white p-10 shadow">
          <p className="mb-2 text-3xl">✅</p>
          <p className="text-xl font-medium text-primary">Contrato assinado</p>
          <p className="mt-2 text-muted-foreground">Seu contrato já foi assinado. Obrigado!</p>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-secondary px-5 text-center">
        <div className="rounded-2xl bg-white p-10 shadow">
          <p className="mb-2 text-3xl">🎉</p>
          <p className="text-xl font-medium text-primary">Dados recebidos!</p>
          <p className="mt-2 text-muted-foreground">
            O contrato será gerado e enviado para seu e-mail em instantes. Aguarde.
          </p>
        </div>
      </div>
    );
  }

  const installmentRows = booking.price_brl
    ? calcInstallments(booking.price_brl, booking.installments ?? 2)
    : null;

  return (
    <div className="min-h-screen bg-secondary pb-20">
      {/* Header */}
      <header className="border-b border-border bg-white px-5 py-4">
        <p className="mx-auto max-w-2xl font-semibold text-primary">
          {VENUE.name} — Dados para Contrato
        </p>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-8">
        {/* Booking summary */}
        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Sua reserva</p>
          <p className="text-lg font-medium text-primary">{booking.event_type}</p>
          <p className="text-sm text-muted-foreground">{booking.guest_count} convidados</p>
          {installmentRows ? (
            <div className="mt-4 border-t pt-4">
              <p className="mb-2 text-sm font-medium text-primary">Cronograma de pagamento</p>
              {installmentRows.map((row) => (
                <div key={row.label} className="flex justify-between py-1 text-sm">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-semibold text-primary">{formatBRL(row.amount)}</span>
                </div>
              ))}
              <p className="mt-2 text-xs text-muted-foreground">
                Total: <strong>{formatBRL(booking.price_brl!)}</strong> · Pix (dados enviados junto ao contrato)
              </p>
            </div>
          ) : null}
        </div>

        {/* Data collection form */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">Dados pessoais para contrato</p>
          <p className="mb-6 text-sm text-muted-foreground">
            Preencha os dados abaixo para gerarmos o contrato de locação.
          </p>

          {error ? (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="CPF *" htmlFor="cpf">
              <input
                id="cpf"
                type="text"
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={(e) => handleChange("cpf", e.target.value)}
                className="input"
              />
            </FormField>

            <FormField label="RG e órgão expedidor *" htmlFor="rg">
              <input
                id="rg"
                type="text"
                placeholder="00.000.000-0 SSP/SP"
                value={form.rg}
                onChange={(e) => handleChange("rg", e.target.value)}
                className="input"
              />
            </FormField>

            <FormField label="Data de nascimento *" htmlFor="birthDate">
              <input
                id="birthDate"
                type="date"
                value={form.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                className="input"
              />
            </FormField>

            <FormField label="Endereço completo (rua, número, bairro) *" htmlFor="address">
              <input
                id="address"
                type="text"
                placeholder="Rua Exemplo, 123, Centro"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="input"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField label="Cidade *" htmlFor="city">
                <input
                  id="city"
                  type="text"
                  placeholder="Barretos"
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="input"
                />
              </FormField>
              <FormField label="Estado *" htmlFor="state">
                <input
                  id="state"
                  type="text"
                  maxLength={2}
                  placeholder="SP"
                  value={form.state}
                  onChange={(e) => handleChange("state", e.target.value.toUpperCase())}
                  className="input"
                />
              </FormField>
            </div>

            <FormField label="CEP *" htmlFor="cep">
              <input
                id="cep"
                type="text"
                inputMode="numeric"
                placeholder="00000-000"
                value={form.cep}
                onChange={(e) => handleChange("cep", e.target.value)}
                className="input"
              />
            </FormField>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-primary py-4 font-semibold text-white transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? "Enviando…" : "Enviar dados e gerar contrato"}
            </button>
          </form>
        </div>
      </main>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 2px solid transparent;
          background: var(--input-background, #f5f5f3);
          padding: 0.75rem 1rem;
          outline: none;
          transition: border-color 0.15s;
          font-size: 0.9rem;
        }
        .input:focus {
          border-color: var(--color-primary, #1C1C1C);
        }
      `}</style>
    </div>
  );
}

function FormField({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-primary">
        {label}
      </label>
      {children}
    </div>
  );
}
