// Mercado Pago — Dynamic Pix QR codes + webhooks
// Docs: https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-configuration/integrate-with-pix
// Get your access token at: https://www.mercadopago.com.br/developers/panel
// Set MERCADO_PAGO_ACCESS_TOKEN in .env.local to activate.

const BASE = "https://api.mercadopago.com";
const TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN;

export function isMercadoPagoConfigured() {
  return Boolean(TOKEN);
}

async function mpRequest(path: string, method = "GET", body?: object, idempotencyKey?: string) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
    "X-Idempotency-Key": idempotencyKey ?? crypto.randomUUID(),
  };
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mercado Pago ${method} ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

export type MpPixCharge = {
  id: number;
  status: string;
  qrCode: string;       // copia e cola text
  qrCodeBase64: string; // PNG base64 for display
  dueDate: string;
  value: number;
};

export async function createPixCharge(opts: {
  description: string;
  amount: number;       // in BRL (not cents)
  dueDate: string;      // ISO date string YYYY-MM-DD
  payerEmail: string;
  payerCpf: string;
  externalReference: string; // bookingId_label
  notificationUrl: string;
}): Promise<MpPixCharge> {
  const expirationDate = new Date(opts.dueDate);
  expirationDate.setHours(23, 59, 59, 0);

  const payment = await mpRequest("/v1/payments", "POST", {
    transaction_amount: opts.amount,
    description: opts.description,
    payment_method_id: "pix",
    date_of_expiration: expirationDate.toISOString(),
    notification_url: opts.notificationUrl,
    external_reference: opts.externalReference,
    payer: {
      email: opts.payerEmail,
      identification: {
        type: "CPF",
        number: opts.payerCpf.replace(/\D/g, ""),
      },
    },
  }, opts.externalReference);

  const txData = payment.point_of_interaction?.transaction_data ?? {};

  return {
    id: payment.id,
    status: payment.status,
    qrCode: txData.qr_code ?? "",
    qrCodeBase64: txData.qr_code_base64 ?? "",
    dueDate: opts.dueDate,
    value: opts.amount,
  };
}

// Generate one QR code per installment
export async function generateInstallmentCharges(opts: {
  bookingId: string;
  eventType: string;
  firstEventDate: string; // YYYY-MM-DD
  payerEmail: string;
  payerCpf: string;
  siteUrl: string;
  installments: Array<{ label: string; amount: number; dueDaysBeforeEvent: number | null }>;
}): Promise<MpPixCharge[]> {
  const today = new Date().toISOString().split("T")[0];
  const eventDate = new Date(opts.firstEventDate);
  const notificationUrl = `${opts.siteUrl}/api/webhooks/mercadopago`;

  const charges: MpPixCharge[] = [];
  for (const inst of opts.installments) {
    let dueDate: string;
    if (inst.dueDaysBeforeEvent == null) {
      dueDate = today;
    } else {
      const due = new Date(eventDate);
      due.setDate(due.getDate() - inst.dueDaysBeforeEvent);
      dueDate = due.toISOString().split("T")[0];
    }

    const charge = await createPixCharge({
      description: `${opts.eventType} — ${inst.label} · VillaRoça`,
      amount: inst.amount,
      dueDate,
      payerEmail: opts.payerEmail,
      payerCpf: opts.payerCpf,
      externalReference: `${opts.bookingId}_${inst.label}`,
      notificationUrl,
    });
    charges.push(charge);
  }
  return charges;
}
