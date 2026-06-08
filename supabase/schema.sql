-- Table des groupes
create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  created_at timestamp with time zone default now(),
  ends_at timestamp with time zone,
  challenge_type text default 'pompes',
  duration_days integer default 30
);

-- Table des utilisateurs
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  pseudo text not null,
  group_id uuid references groups(id) on delete cascade,
  auth_id uuid,
  created_at timestamp with time zone default now()
);

create index if not exists users_auth_id_idx on users(auth_id);

-- Table des entrées journalières
create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  date date not null,
  count integer not null default 0,
  created_at timestamp with time zone default now(),
  unique(user_id, date)
);

-- Realtime
alter publication supabase_realtime add table groups;
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table entries;

-- RLS
alter table groups enable row level security;
alter table users enable row level security;
alter table entries enable row level security;

create policy "Public read groups" on groups for select using (true);
create policy "Public insert groups" on groups for insert with check (true);

create policy "Public read users" on users for select using (true);
create policy "Public insert users" on users for insert with check (true);
create policy "Public delete users" on users for delete using (true);

create policy "Public read entries" on entries for select using (true);
create policy "Public insert entries" on entries for insert with check (true);
create policy "Public update entries" on entries for update using (true);
create policy "Public delete entries" on entries for delete using (true);

-- ============================================================
-- MIGRATIONS (à exécuter si la base existe déjà)
-- ============================================================
-- ALTER TABLE groups ADD COLUMN IF NOT EXISTS challenge_type text DEFAULT 'pompes';
-- ALTER TABLE groups ADD COLUMN IF NOT EXISTS duration_days integer DEFAULT 30;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_id uuid;
-- CREATE INDEX IF NOT EXISTS users_auth_id_idx ON users(auth_id);
