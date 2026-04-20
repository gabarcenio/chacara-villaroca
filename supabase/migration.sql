-- Run this once in the Supabase SQL editor:
-- https://supabase.com/dashboard/project/rcjicyrmwjysaogsrwpb/sql/new

CREATE TABLE IF NOT EXISTS public.bookings (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  date_keys      TEXT[]      NOT NULL,
  status         TEXT        NOT NULL DEFAULT 'pending'
                             CHECK (status IN ('pending', 'confirmed', 'declined')),
  event_type     TEXT        NOT NULL,
  guest_count    INTEGER     NOT NULL,
  services       TEXT[]      DEFAULT '{}',
  name           TEXT        NOT NULL,
  email          TEXT        NOT NULL,
  phone          TEXT        NOT NULL,
  message        TEXT        DEFAULT '',
  marketing_opt_in BOOLEAN   DEFAULT false,
  start_time     TEXT        DEFAULT '08:00',
  end_time       TEXT        DEFAULT '18:00',
  created_at     TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blocked_dates (
  date_key   TEXT        PRIMARY KEY,
  reason     TEXT        DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.bookings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- Clients can submit bookings
CREATE POLICY "anon_insert_bookings"
  ON public.bookings FOR INSERT TO anon WITH CHECK (true);

-- Calendar can read which dates are blocked
CREATE POLICY "anon_read_blocked_dates"
  ON public.blocked_dates FOR SELECT TO anon USING (true);

-- Calendar can read booking statuses (no personal data exposed)
CREATE POLICY "anon_read_booking_dates"
  ON public.bookings FOR SELECT TO anon
  USING (true);
