import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-server";
import { sendBookingConfirmed, sendBookingDeclined } from "@/lib/email";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const { status, priceBrl, installments } = await request.json();

  if (!["confirmed", "declined", "pending"].includes(status)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  const supabase = createAdminClient();

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const updatePayload: Record<string, unknown> = { status };
  if (status === "confirmed" && priceBrl) {
    updatePayload.price_brl = priceBrl;
    updatePayload.installments = installments ?? 2;
  }

  const { error } = await supabase.from("bookings").update(updatePayload).eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const info = {
    id: booking.id,
    name: booking.name,
    email: booking.email,
    phone: booking.phone,
    eventType: booking.event_type,
    guestCount: booking.guest_count,
    dateKeys: booking.date_keys,
    services: booking.services ?? [],
    message: booking.message ?? "",
    priceBrl: status === "confirmed" ? (priceBrl ?? null) : null,
    installments: installments ?? 2,
  };

  if (status === "confirmed") {
    sendBookingConfirmed(info).catch(console.error);
  } else if (status === "declined") {
    sendBookingDeclined(info).catch(console.error);
  }

  return NextResponse.json({ success: true });
}
