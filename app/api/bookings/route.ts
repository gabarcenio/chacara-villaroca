import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      date_keys: body.dateKeys,
      event_type: body.eventType,
      guest_count: body.guestCount,
      services: body.services ?? [],
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message ?? "",
      marketing_opt_in: body.marketingOptIn ?? false,
      start_time: body.startTime ?? "08:00",
      end_time: body.endTime ?? "18:00",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id });
}
