-- Supabase/Postgres schema for PSR Benefits System
-- Run this in Supabase SQL editor or via psql using service_role key

-- Profiles (user metadata separate from Auth)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY,
  email text UNIQUE,
  name text,
  nickname text,
  unit text,
  role text DEFAULT 'user',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Master data for dropdowns
CREATE TABLE IF NOT EXISTS master_data (
  id bigserial PRIMARY KEY,
  category text NOT NULL,
  value text NOT NULL
);

-- Requests
CREATE TABLE IF NOT EXISTS requests (
  id text PRIMARY KEY,
  email text,
  affiliation text,
  mission_type text,
  operation text,
  area text,
  province text,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'draft'
);

-- Beneficiaries
CREATE TABLE IF NOT EXISTS beneficiaries (
  id bigserial PRIMARY KEY,
  request_id text REFERENCES requests(id),
  rank text,
  first_name text,
  last_name text,
  position text,
  loss_type text,
  benefit_level text,
  current_benefit text,
  orders text,
  order_date text,
  issued_by text,
  behavior text,
  created_at timestamptz DEFAULT now()
);

-- Approvals
CREATE TABLE IF NOT EXISTS approvals (
  id bigserial PRIMARY KEY,
  request_id text REFERENCES requests(id),
  step text,
  action text,
  date timestamptz DEFAULT now(),
  reviewer text,
  comment text,
  status text
);
