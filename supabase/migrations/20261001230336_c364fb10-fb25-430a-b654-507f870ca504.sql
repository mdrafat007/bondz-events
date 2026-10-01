CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  ref text, event text, event_title text, guests integer, "where" text, venue_name text,
  date_str text, slot text, total_cost numeric, deposit_paid numeric,
  client_name text, client_phone text, client_email text, notes text, signature_url text,
  assigned_partners jsonb DEFAULT '[]'::jsonb, run_of_show jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'Confirmed', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX bookings_session_idx ON public.bookings(session_id);
CREATE TABLE public.custom_partners (
  id text PRIMARY KEY, session_id text NOT NULL,
  name text, category text, contact text, phone text, email text, rate_label text, capacity text,
  active boolean DEFAULT true, is_paused boolean DEFAULT false, is_archived boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX custom_partners_session_idx ON public.custom_partners(session_id);
CREATE TABLE public.partner_blackouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), session_id text NOT NULL,
  partner_id text, day_offset integer, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX partner_blackouts_session_idx ON public.partner_blackouts(session_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings, public.custom_partners, public.partner_blackouts TO anon, authenticated;
GRANT ALL ON public.bookings, public.custom_partners, public.partner_blackouts TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_blackouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "session rows" ON public.bookings FOR ALL TO anon, authenticated USING (length(session_id) >= 16) WITH CHECK (length(session_id) >= 16);
CREATE POLICY "session rows" ON public.custom_partners FOR ALL TO anon, authenticated USING (length(session_id) >= 16) WITH CHECK (length(session_id) >= 16);
CREATE POLICY "session rows" ON public.partner_blackouts FOR ALL TO anon, authenticated USING (length(session_id) >= 16) WITH CHECK (length(session_id) >= 16);

CREATE POLICY "signature uploads" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'booking-signatures');
CREATE POLICY "signature reads" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'booking-signatures');