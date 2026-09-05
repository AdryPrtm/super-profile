-- Menutup tabel publik dari akses anon key (PostgREST).
--
-- Semua akses aplikasi berjalan lewat Prisma sebagai role `postgres` (lihat
-- packages/db/src/index.ts dan packages/auth/src/index.ts), bukan lewat
-- supabase-js. Jadi anon/authenticated tidak butuh hak apa pun di tabel ini.
--
-- Catatan penting:
-- - RLS di-enable TANPA policy => deny-all untuk anon/authenticated.
-- - JANGAN pakai FORCE ROW LEVEL SECURITY: pemilik tabel (postgres) dikecualikan
--   dari RLS, dan itulah yang membuat Prisma tetap jalan normal.
-- - `prisma db push` membuat tabel baru sebagai postgres dan Supabase memberi
--   grant default ke anon/authenticated. Bagian ALTER DEFAULT PRIVILEGES di
--   bawah mematikan itu supaya lubangnya tidak balik lagi setiap push.
--
-- Jalankan lewat: bun run db:secure  (atau paste ke Supabase SQL Editor)

do $$
declare
  t text;
begin
  foreach t in array array['user', 'session', 'account', 'verification', 'profile_content']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from anon, authenticated', t);
  end loop;
end
$$;

-- Tabel yang dibuat postgres setelah ini tidak lagi dapat grant otomatis.
alter default privileges for role postgres in schema public
  revoke all on tables from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke all on sequences from anon, authenticated;
