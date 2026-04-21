"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle, XCircle, Clock, CalendarX, CalendarCheck,
  LogOut, RefreshCw, DollarSign, FileText, Wallet,
} from "lucide-react";
import { VENUE, PRICING } from "@/lib/constants";
import { formatBRL, calcInstallments } from "@/lib/pricing";
import {
  formatVenueDateLong, parseVenueDateKey, nowInVenueTimeZone,
  makeVenueDate, getVenueDayOfWeek, getDaysInMonthUtil,
} from "@/lib/date";

type Booking = {
  id: string;
  date_keys: string[];
  status: "pending" | "confirmed" | "declined";
  event_type: string;
  guest_count: number;
  services: string[];
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
  price_brl: number | null;
  installments: number | null;
  contract_status: string | null;
  payment_status: string | null;
};

type BlockedDate = { date_key: string; reason: string };

const statusLabel: Record<Booking["status"], string> = {
  pending: "Em análise",
  confirmed: "Confirmado",
  declined: "Recusado",
};

const statusColors: Record<Booking["status"], string> = {
  pending: "bg-accent text-primary",
  confirmed: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-700",
};

const paymentStatusLabel: Record<string, string> = {
  pending: "Aguardando pagamento",
  deposit_paid: "Entrada paga",
  fully_paid: "Pago integralmente",
};

const paymentStatusColors: Record<string, string> = {
  pending: "text-amber-600",
  deposit_paid: "text-blue-600",
  fully_paid: "text-green-600",
};

// ─── Price approval modal ────────────────────────────────────────────────────

function PriceModal({
  booking,
  onConfirm,
  onCancel,
}: {
  booking: Booking;
  onConfirm: (priceBrl: number, installments: number) => void;
  onCancel: () => void;
}) {
  const suggested = PRICING[booking.event_type]?.suggested ?? 3000;
  const [price, setPrice] = useState(String(booking.price_brl ?? suggested));
  const [installments, setInstallments] = useState(booking.installments ?? 2);
  const priceNum = Number(price.replace(/\D/g, "")) || 0;
  const installmentRows = priceNum > 0 ? calcInstallments(priceNum, installments) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="mb-1 text-lg font-semibold text-primary">Confirmar reserva</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          {booking.name} · {booking.event_type}
        </p>

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-primary">
            Valor total (R$)
          </label>
          <input
            type="number"
            min="0"
            step="50"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border-2 border-transparent bg-secondary px-4 py-3 text-lg font-semibold outline-none transition-colors focus:border-primary"
            placeholder="Ex: 3500"
          />
          {PRICING[booking.event_type] && (
            <p className="mt-1 text-xs text-muted-foreground">
              Sugestão para {booking.event_type}: {formatBRL(PRICING[booking.event_type].min)} – {formatBRL(PRICING[booking.event_type].max)}
            </p>
          )}
        </div>

        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-primary">Parcelamento</label>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setInstallments(n)}
                className={`flex-1 rounded-lg border py-2.5 text-sm transition-all ${
                  installments === n ? "border-primary bg-primary text-white" : "border-border hover:border-primary/40"
                }`}
              >
                {n}x
              </button>
            ))}
          </div>
        </div>

        {installmentRows.length > 0 && (
          <div className="mb-5 rounded-lg bg-secondary px-4 py-3 text-sm">
            <p className="mb-2 font-medium text-primary">Cronograma</p>
            {installmentRows.map((row) => (
              <div key={row.label} className="flex justify-between py-1">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-semibold text-primary">{formatBRL(row.amount)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg bg-secondary py-3 text-sm text-muted-foreground transition-all hover:bg-secondary/80"
          >
            Cancelar
          </button>
          <button
            onClick={() => priceNum > 0 && onConfirm(priceNum, installments)}
            disabled={priceNum <= 0}
            className="flex-1 rounded-lg bg-green-600 py-3 text-sm font-semibold text-white transition-all hover:bg-green-700 disabled:opacity-40"
          >
            Confirmar e enviar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main dashboard ──────────────────────────────────────────────────────────

export function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<"bookings" | "calendar" | "financeiro">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blocked, setBlocked] = useState<BlockedDate[]>([]);
  const [calendarBookings, setCalendarBookings] = useState<{ pending: string[]; confirmed: string[] }>({ pending: [], confirmed: [] });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<Booking | null>(null);

  const today = nowInVenueTimeZone();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [bRes, blRes, cRes] = await Promise.all([
      fetch("/api/admin/bookings"),
      fetch("/api/admin/blocked"),
      fetch("/api/calendar"),
    ]);
    if (bRes.ok) setBookings(await bRes.json());
    if (blRes.ok) setBlocked(await blRes.json());
    if (cRes.ok) {
      const c = await cRes.json();
      setCalendarBookings({ pending: c.pending, confirmed: c.confirmed });
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateBookingStatus = async (id: string, status: Booking["status"], priceBrl?: number, installments?: number) => {
    setActionLoading(id);
    setConfirmModal(null);
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, priceBrl, installments }),
    });
    await fetchAll();
    setActionLoading(null);
  };

  const toggleBlockDate = async (dateKey: string) => {
    setActionLoading(dateKey);
    const isBlocked = blocked.some((b) => b.date_key === dateKey);
    if (isBlocked) {
      await fetch(`/api/admin/blocked/${dateKey}`, { method: "DELETE" });
    } else {
      await fetch("/api/admin/blocked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date_key: dateKey }),
      });
    }
    await fetchAll();
    setActionLoading(null);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const totalRevenue = confirmedBookings.reduce((s, b) => s + (b.price_brl ?? 0), 0);
  const paidRevenue = confirmedBookings
    .filter((b) => b.payment_status === "fully_paid")
    .reduce((s, b) => s + (b.price_brl ?? 0), 0);

  // Admin calendar
  const firstDay = makeVenueDate(calYear, calMonth, 1);
  const startDow = getVenueDayOfWeek(firstDay);
  const daysInMonth = getDaysInMonthUtil(calYear, calMonth);
  const blockedSet = new Set(blocked.map((b) => b.date_key));
  const pendingSet = new Set(calendarBookings.pending);
  const confirmedSet = new Set(calendarBookings.confirmed);
  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); };
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); };

  return (
    <div className="min-h-screen bg-secondary">
      {confirmModal ? (
        <PriceModal
          booking={confirmModal}
          onConfirm={(price, inst) => updateBookingStatus(confirmModal.id, "confirmed", price, inst)}
          onCancel={() => setConfirmModal(null)}
        />
      ) : null}

      {/* Header */}
      <header className="border-b border-border bg-white px-5 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="text-primary" style={{ fontFamily: "var(--font-caveat)", fontSize: "1.5rem" }}>
              {VENUE.name.replace("Chácara ", "")}
            </p>
            <p className="text-sm text-muted-foreground">Painel administrativo</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAll}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
              title="Atualizar"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg bg-white p-1 shadow-sm">
          <TabBtn active={tab === "bookings"} onClick={() => setTab("bookings")}>
            Solicitações
            {pendingCount > 0 ? (
              <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-primary">{pendingCount}</span>
            ) : null}
          </TabBtn>
          <TabBtn active={tab === "calendar"} onClick={() => setTab("calendar")}>
            Calendário
          </TabBtn>
          <TabBtn active={tab === "financeiro"} onClick={() => setTab("financeiro")}>
            Financeiro
          </TabBtn>
        </div>

        {/* ── Bookings tab ── */}
        {tab === "bookings" ? (
          <div className="space-y-4">
            {loading ? (
              <p className="text-muted-foreground">Carregando…</p>
            ) : bookings.length === 0 ? (
              <div className="rounded-lg bg-white p-8 text-center">
                <p className="text-muted-foreground">Nenhuma solicitação ainda.</p>
              </div>
            ) : (
              bookings.map((b) => (
                <article key={b.id} className="rounded-lg bg-white p-5 shadow-sm">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-medium text-primary">{b.name}</h2>
                      <p className="text-sm text-muted-foreground">
                        {b.event_type} · {b.guest_count} convidados
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {b.price_brl ? (
                        <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold text-primary">
                          {formatBRL(b.price_brl)}
                        </span>
                      ) : null}
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[b.status]}`}>
                        {statusLabel[b.status]}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {b.date_keys.map((k) => (
                      <span key={k} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                        {formatVenueDateLong(parseVenueDateKey(k))}
                      </span>
                    ))}
                  </div>

                  <div className="mb-3 grid gap-1 text-sm text-muted-foreground md:grid-cols-2">
                    <span>📞 {b.phone}</span>
                    <span>✉️ {b.email}</span>
                    {b.services.length > 0 ? <span className="md:col-span-2">🎯 {b.services.join(", ")}</span> : null}
                    {b.message ? <p className="md:col-span-2 italic">&ldquo;{b.message}&rdquo;</p> : null}
                  </div>

                  {/* Contract + payment status badges */}
                  {b.status === "confirmed" ? (
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                        <FileText size={11} />
                        Contrato: {b.contract_status === "signed" ? "assinado" : b.contract_status === "sent" ? "enviado" : "pendente"}
                      </span>
                      <span className={`flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium ${paymentStatusColors[b.payment_status ?? "pending"]}`}>
                        <Wallet size={11} />
                        {paymentStatusLabel[b.payment_status ?? "pending"]}
                      </span>
                    </div>
                  ) : null}

                  <p className="mb-4 text-xs text-muted-foreground/60">
                    Enviado em {new Date(b.created_at).toLocaleString("pt-BR")}
                  </p>

                  {b.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmModal(b)}
                        disabled={actionLoading === b.id}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white transition-all hover:bg-green-700 disabled:opacity-50"
                      >
                        <CheckCircle size={15} /> Confirmar
                      </button>
                      <button
                        onClick={() => updateBookingStatus(b.id, "declined")}
                        disabled={actionLoading === b.id}
                        className="flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700 transition-all hover:bg-red-200 disabled:opacity-50"
                      >
                        <XCircle size={15} /> Recusar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => updateBookingStatus(b.id, "pending")}
                      disabled={actionLoading === b.id}
                      className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-secondary/80 disabled:opacity-50"
                    >
                      <Clock size={15} /> Voltar para análise
                    </button>
                  )}
                </article>
              ))
            )}
          </div>
        ) : null}

        {/* ── Calendar tab ── */}
        {tab === "calendar" ? (
          <div className="rounded-lg bg-white p-5 shadow-sm md:p-8">
            <p className="mb-4 text-sm text-muted-foreground">
              Clique em qualquer data para bloquear ou desbloquear. Datas bloqueadas não aparecem como disponíveis para os clientes.
            </p>

            <div className="mb-4 flex items-center justify-between">
              <button onClick={prevMonth} className="rounded-lg p-2 transition-colors hover:bg-secondary">‹</button>
              <h3 className="text-lg font-medium text-primary">{monthNames[calMonth]} {calYear}</h3>
              <button onClick={nextMonth} className="rounded-lg p-2 transition-colors hover:bg-secondary">›</button>
            </div>

            <div className="mb-2 grid grid-cols-7 gap-1.5">
              {weekDays.map((d) => (
                <div key={d} className="py-2 text-center text-xs text-muted-foreground">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: startDow }).map((_, i) => (
                <div key={`e-${i}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const key = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isBlocked = blockedSet.has(key);
                const isPending = pendingSet.has(key);
                const isConfirmed = confirmedSet.has(key);
                const isLoading = actionLoading === key;

                return (
                  <button
                    key={key}
                    onClick={() => !isPending && !isConfirmed && toggleBlockDate(key)}
                    disabled={isLoading || isPending || isConfirmed}
                    title={
                      isConfirmed ? "Data confirmada (reservada)" :
                      isPending ? "Solicitação em análise" :
                      isBlocked ? "Clique para desbloquear" : "Clique para bloquear"
                    }
                    className={[
                      "relative flex aspect-square items-center justify-center rounded-lg text-sm transition-all",
                      isConfirmed ? "cursor-default bg-green-100 text-green-700 line-through" : "",
                      isPending ? "cursor-default border border-amber-400 bg-amber-50 text-amber-700" : "",
                      isBlocked && !isPending && !isConfirmed ? "bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100" : "",
                      !isBlocked && !isPending && !isConfirmed ? "bg-secondary text-primary hover:bg-accent/20" : "",
                      isLoading ? "opacity-50" : "",
                    ].join(" ")}
                  >
                    {day}
                    {isBlocked && !isPending && !isConfirmed ? (
                      <CalendarX size={8} className="absolute bottom-1 right-1 text-red-400" />
                    ) : null}
                    {isConfirmed ? (
                      <CalendarCheck size={8} className="absolute bottom-1 right-1 text-green-500" />
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-4 border-t pt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-secondary" /> Disponível</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded border border-amber-400 bg-amber-50" /> Em análise</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-green-100" /> Confirmado</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-red-50 ring-1 ring-red-200" /> Bloqueado</span>
            </div>
          </div>
        ) : null}

        {/* ── Financeiro tab ── */}
        {tab === "financeiro" ? (
          <div className="space-y-4">
            {/* Summary cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                icon={<DollarSign size={20} className="text-green-600" />}
                label="Receita confirmada"
                value={formatBRL(totalRevenue)}
              />
              <StatCard
                icon={<Wallet size={20} className="text-blue-600" />}
                label="Recebido"
                value={formatBRL(paidRevenue)}
              />
              <StatCard
                icon={<Clock size={20} className="text-amber-600" />}
                label="A receber"
                value={formatBRL(totalRevenue - paidRevenue)}
              />
            </div>

            {/* Confirmed bookings financial detail */}
            {confirmedBookings.length === 0 ? (
              <div className="rounded-lg bg-white p-8 text-center">
                <p className="text-muted-foreground">Nenhuma reserva confirmada ainda.</p>
              </div>
            ) : (
              confirmedBookings.map((b) => {
                const installmentRows = b.price_brl ? calcInstallments(b.price_brl, b.installments ?? 2) : [];
                return (
                  <article key={b.id} className="rounded-lg bg-white p-5 shadow-sm">
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h2 className="font-medium text-primary">{b.name}</h2>
                        <p className="text-sm text-muted-foreground">
                          {b.event_type} · {b.date_keys.map((k) => formatVenueDateLong(parseVenueDateKey(k))).join(", ")}
                        </p>
                      </div>
                      <span className={`text-sm font-semibold ${paymentStatusColors[b.payment_status ?? "pending"]}`}>
                        {paymentStatusLabel[b.payment_status ?? "pending"]}
                      </span>
                    </div>

                    {b.price_brl ? (
                      <div className="rounded-lg bg-secondary p-4">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          Cronograma · Total {formatBRL(b.price_brl)}
                        </p>
                        {installmentRows.map((row) => (
                          <div key={row.label} className="flex items-center justify-between py-1.5 text-sm">
                            <span className="text-muted-foreground">{row.label}</span>
                            <span className="font-semibold text-primary">{formatBRL(row.amount)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-amber-600">Preço ainda não definido</p>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText size={11} />
                        Contrato: {b.contract_status === "signed" ? "assinado ✓" : b.contract_status === "sent" ? "enviado (aguardando assinatura)" : "pendente"}
                      </span>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all ${
        active ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2">{icon}<span className="text-sm text-muted-foreground">{label}</span></div>
      <p className="text-2xl font-semibold text-primary">{value}</p>
    </div>
  );
}
