import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

// Mercado Pago sends a webhook for every payment event.
// Register this URL in your Mercado Pago developer panel → Webhooks:
//   https://villaroca.com.br/api/webhooks/mercadopago
//
// Validate requests using MERCADO_PAGO_WEBHOOK_SECRET (optional but recommended).
// Set it in the MP dashboard under Webhooks → Segredo.

export async function POST(req: NextRequest) {
  // Optional signature validation
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  if (secret) {
    const xSignature = req.headers.get("x-signature") ?? "";
    const xRequestId = req.headers.get("x-request-id") ?? "";
    const { searchParams } = new URL(req.url);
    const dataId = searchParams.get("data.id") ?? "";
    // MP signature: ts=...;v1=HMAC-SHA256(ts + xRequestId + dataId, secret)
    // For full validation see: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
    const [, receivedHash] = xSignature.split(";v1=");
    if (receivedHash) {
      const { createHmac } = await import("crypto");
      const ts = xSignature.split(";")[0].replace("ts=", "");
      const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
      const expected = createHmac("sha256", secret).update(manifest).digest("hex");
      if (receivedHash !== expected) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }
  }

  const event = await req.json();

  // MP sends notifications as { type: "payment", action: "payment.updated", data: { id: "..." } }
  if (event.type !== "payment") {
    return NextResponse.json({ ok: true });
  }

  const paymentId = event.data?.id;
  if (!paymentId) return NextResponse.json({ ok: true });

  // Fetch payment details from MP API
  const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}` },
  });

  if (!mpRes.ok) return NextResponse.json({ ok: true });
  const payment = await mpRes.json();

  if (!["approved", "authorized"].includes(payment.status)) {
    return NextResponse.json({ ok: true });
  }

  const externalRef = payment.external_reference as string | undefined;
  if (!externalRef) return NextResponse.json({ ok: true });

  const bookingId = externalRef.split("_")[0];
  const label = externalRef.split("_").slice(1).join("_").toLowerCase();

  const supabase = createAdminClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select("payment_status, price_brl")
    .eq("id", bookingId)
    .single();

  if (!booking) return NextResponse.json({ ok: true });

  let newPaymentStatus = booking.payment_status ?? "pending";

  const isDeposit = label.includes("entrada") || label.includes("sinal");
  const isFinalInstallment = label.includes("saldo") || label.includes("3ª parcela") || label.includes("único");

  if (isDeposit && newPaymentStatus === "pending") {
    newPaymentStatus = "deposit_paid";
  }
  if (isFinalInstallment || payment.transaction_amount >= booking.price_brl) {
    newPaymentStatus = "fully_paid";
  }

  if (newPaymentStatus !== booking.payment_status) {
    await supabase
      .from("bookings")
      .update({ payment_status: newPaymentStatus })
      .eq("id", bookingId);
  }

  return NextResponse.json({ ok: true });
}
