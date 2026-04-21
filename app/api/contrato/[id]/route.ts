import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";
import { generateContractHtml } from "@/lib/contract";
import { sendContractForSigning } from "@/lib/email";
import { isAutentiqueConfigured, createAndSendContract } from "@/lib/autentique";
import { isMercadoPagoConfigured, generateInstallmentCharges } from "@/lib/mercadopago";
import { calcInstallments } from "@/lib/pricing";

// GET — fetch booking summary for the data collection form
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("id,name,email,phone,event_type,guest_count,date_keys,price_brl,installments,contract_status,client_cpf,start_time,end_time")
    .eq("id", id)
    .eq("status", "confirmed")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 });
  }

  return NextResponse.json(data);
}

// POST — save client personal data, generate + send contract, trigger Pix charges
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { cpf, rg, birthDate, address, city, state, cep } = body;

  if (!cpf || !rg || !birthDate || !address || !city || !state || !cep) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: booking, error: fetchErr } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .eq("status", "confirmed")
    .single();

  if (fetchErr || !booking) {
    return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 });
  }

  if (!booking.price_brl) {
    return NextResponse.json({ error: "Preço ainda não definido pelo proprietário" }, { status: 422 });
  }

  // Persist personal data
  await supabase.from("bookings").update({
    client_cpf: cpf,
    client_rg: rg,
    client_birth_date: birthDate,
    client_address: address,
    client_city: city,
    client_state: state,
    client_cep: cep,
    contract_status: "sent",
  }).eq("id", id);

  const contractData = {
    bookingId: booking.id,
    clientName: booking.name,
    clientCpf: cpf,
    clientRg: rg,
    clientBirthDate: birthDate,
    clientAddress: address,
    clientCity: city,
    clientState: state,
    clientCep: cep,
    clientPhone: booking.phone,
    clientEmail: booking.email,
    eventType: booking.event_type,
    guestCount: booking.guest_count,
    dateKeys: booking.date_keys,
    startTime: booking.start_time ?? "08:00",
    endTime: booking.end_time ?? "18:00",
    priceBrl: booking.price_brl,
    installments: booking.installments ?? 2,
  };

  const contractHtml = generateContractHtml(contractData);
  const filename = `contrato-villaroca-${id.slice(0, 8)}`;

  // Try Autentique; fall back to emailing the HTML
  if (isAutentiqueConfigured()) {
    try {
      const { documentId } = await createAndSendContract({
        documentName: filename,
        contractHtml,
        signerEmail: booking.email,
        signerName: booking.name,
      });
      await supabase.from("bookings").update({ esign_document_id: documentId }).eq("id", id);
    } catch (err) {
      console.error("Autentique error, falling back to email:", err);
      await sendContractForSigning({ ...contractData, contractHtml });
    }
  } else {
    await sendContractForSigning({ ...contractData, contractHtml });
  }

  // Generate Mercado Pago Pix charges if configured
  if (isMercadoPagoConfigured() && booking.price_brl) {
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://villaroca.com.br";
      const installmentList = calcInstallments(booking.price_brl, booking.installments ?? 2);
      await generateInstallmentCharges({
        bookingId: id,
        eventType: booking.event_type,
        firstEventDate: booking.date_keys[0],
        payerEmail: booking.email,
        payerCpf: cpf,
        siteUrl,
        installments: installmentList,
      });
    } catch (err) {
      console.error("Mercado Pago error (non-fatal):", err);
    }
  }

  return NextResponse.json({ success: true });
}
