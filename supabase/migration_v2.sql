-- Migration v2: pricing, contract, and payment fields
-- Run in the Supabase SQL editor after migration.sql

-- Pricing set by admin at approval time
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS price_brl       INTEGER;        -- total agreed price in BRL
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS installments    INTEGER DEFAULT 2;

-- Client personal data for contract (collected via /contrato/[id] page)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS client_cpf        TEXT DEFAULT '';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS client_rg         TEXT DEFAULT '';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS client_birth_date TEXT DEFAULT '';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS client_address    TEXT DEFAULT '';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS client_city       TEXT DEFAULT '';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS client_state      TEXT DEFAULT '';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS client_cep        TEXT DEFAULT '';

-- Contract & payment lifecycle
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS contract_status TEXT DEFAULT 'pending'
  CHECK (contract_status IN ('pending', 'sent', 'signed'));

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending'
  CHECK (payment_status IN ('pending', 'deposit_paid', 'fully_paid'));

-- External integration IDs (optional)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS esign_document_id TEXT DEFAULT '';  -- Autentique document ID
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS mp_payment_ids    TEXT DEFAULT '';  -- Mercado Pago payment IDs (comma-separated)
