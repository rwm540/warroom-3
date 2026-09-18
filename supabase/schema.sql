-- ============================================================================
--  🎖️  پلتفرم «اتاق جنگ» — Query کامل ساخت دیتابیس Supabase
-- ============================================================================
--  راهنمای اجرا:
--    ۱) وارد پروژه خود در https://supabase.com/dashboard شوید
--    ۲) از منوی کنار:  SQL Editor → New query
--    ۳) کل این فایل را Paste کرده و Run کنید
--
--  این فایل شامل:
--    • ۲۰ جدول داده عمومی (الگوی سند JSONB: id متنی + ستون data از نوع jsonb)
--    • 🛡️ ۵ جدول امنیتی سرور (اعتبارنامه‌ها، نشست‌ها، درخواست‌های تغییر رمز،
--      رخدادهای امنیتی، تنظیمات امنیتی) — بدون هیچ سیاست عمومی (RLS بسته)
--    • تریگر به‌روزرسانی خودکار updated_at
--    • ایندکس‌های کمکی روی فیلدهای jsonb
--    • فعال‌سازی RLS (جدول‌های عمومی: سیاست دموی باز / جدول‌های حساس: بدون دسترسی عمومی)
--    • مجوزهای اجرا (Grants)
--    • پروفایل «مدیر کل» فقط با یک ایندکس یکتا
--    • باکت Storage عمومی برای رسانه‌ها (warroom-media)
--    • انتشار بلادرنگ (Realtime Publications)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- ۰) اکستنشن‌ها
-- ----------------------------------------------------------------------------
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- ۱) ساخت جداول (الگوی سند JSONB)
-- ----------------------------------------------------------------------------

-- کاربران (رزمنده‌ها و ادمین‌ها)
create table if not exists public.warroom_users (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- جوخه‌ها / گروه‌ها
create table if not exists public.warroom_groups (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- اتاق‌های چت گروهی
create table if not exists public.warroom_group_chat_rooms (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- پیام‌های چت گروهی
create table if not exists public.warroom_group_chat_messages (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- نشست ثبت‌نام تیم و اعتبارنامه‌های مشترک
create table if not exists public.warroom_team_registrations (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- مأموریت‌ها
create table if not exists public.warroom_missions (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ارسال‌ها / پاسخ‌های مأموریت
create table if not exists public.warroom_submissions (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- آموزش‌ها
create table if not exists public.warroom_trainings (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- مدال‌ها
create table if not exists public.warroom_medals (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- مدال‌های اهداشده به کاربران
create table if not exists public.warroom_user_medals (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- تیکت‌های پشتیبانی
create table if not exists public.warroom_support_tickets (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- پاسخ‌های تیکت‌ها
create table if not exists public.warroom_support_replies (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- اطلاعیه‌های درون‌سامانه
create table if not exists public.warroom_announcements (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- اخبار
create table if not exists public.warroom_news (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- نوتیفیکیشن‌های زنده (Push)
create table if not exists public.warroom_notifications (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- اطلاعیه‌های صفحه اصلی
create table if not exists public.warroom_home_announcements (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- سؤالات متداول (FAQ)
create table if not exists public.warroom_faqs (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- مراحل نقشه بازی (Stages)
create table if not exists public.warroom_stages (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- جوایز و پاداش‌ها (Prizes)
create table if not exists public.warroom_prizes (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- آثار ویترین (پست‌های نمایش عمومی)
create table if not exists public.warroom_vitrin_posts (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- نظرات و دیدگاه‌های ویترین
create table if not exists public.warroom_vitrin_comments (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- درگاه‌های بازی / لینک‌دهی (Game Portals)
create table if not exists public.warroom_game_portals (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- جدول کلید/مقدار برای تنظیمات سراسری سایت
create table if not exists public.warroom_kv (
  id         text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- درخواست‌های تغییر رمز (کلاینتی)
create table if not exists public.warroom_password_reset_requests (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ============================================================================
--  🛡️  جدول‌های امنیتی (فقط برای بک‌اند سرور با کلید service_role)
-- ============================================================================

-- اعتبارنامه‌ها
create table if not exists public.warroom_credentials (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- نشست‌های امن
create table if not exists public.warroom_sessions (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- درخواست‌های تغییر رمز (سرور)
create table if not exists public.warroom_password_resets (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- رخدادهای امنیتی (Audit Log)
create table if not exists public.warroom_audit_log (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- تنظیمات امنیتی سرور
create table if not exists public.warroom_security_kv (
  id         text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- ۲) تریگر به‌روزرسانی خودکار updated_at
-- ----------------------------------------------------------------------------
create or replace function public.warroom_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'warroom_users','warroom_groups','warroom_group_chat_rooms','warroom_group_chat_messages','warroom_team_registrations',
    'warroom_stages','warroom_prizes','warroom_missions','warroom_submissions',
    'warroom_trainings','warroom_medals','warroom_user_medals',
    'warroom_support_tickets','warroom_support_replies','warroom_announcements',
    'warroom_news','warroom_notifications','warroom_home_announcements','warroom_faqs',
    'warroom_vitrin_posts','warroom_vitrin_comments','warroom_game_portals','warroom_kv',
    'warroom_password_reset_requests','warroom_credentials','warroom_sessions',
    'warroom_password_resets','warroom_audit_log','warroom_security_kv'
  ]
  loop
    execute format('drop trigger if exists trg_%s_updated_at on public.%I', t, t);
    execute format(
      'create trigger trg_%s_updated_at before update on public.%I
       for each row execute function public.warroom_set_updated_at()', t, t);
  end loop;
end;
$$;

-- ----------------------------------------------------------------------------
-- ۳) ایندکس‌های کمکی
-- ----------------------------------------------------------------------------
create index if not exists idx_warroom_users_national_code on public.warroom_users ((data->>'national_code'));
create index if not exists idx_warroom_users_personal_code on public.warroom_users ((data->>'personal_code'));
create index if not exists idx_warroom_users_role          on public.warroom_users ((data->>'role'));
create index if not exists idx_warroom_submissions_user    on public.warroom_submissions ((data->>'personal_code'));
create index if not exists idx_warroom_submissions_mission on public.warroom_submissions ((data->>'mission_id'));
create index if not exists idx_warroom_tickets_status      on public.warroom_support_tickets ((data->>'status'));
create index if not exists idx_warroom_notifications_target on public.warroom_notifications ((data->>'target'));
create index if not exists idx_warroom_vitrin_comments_post on public.warroom_vitrin_comments ((data->>'postId'));
create index if not exists idx_warroom_user_medals_code     on public.warroom_user_medals ((data->>'personal_code'));
create index if not exists idx_warroom_credentials_updated  on public.warroom_credentials (updated_at desc);
create index if not exists idx_warroom_sessions_expires     on public.warroom_sessions ((data->>'expires_at'));
create index if not exists idx_warroom_sessions_user        on public.warroom_sessions ((data->>'user_id'));
create index if not exists idx_warroom_resets_status        on public.warroom_password_resets ((data->>'status'));
create index if not exists idx_warroom_resets_user          on public.warroom_password_resets ((data->>'user_id'));
create index if not exists idx_warroom_resets_code          on public.warroom_password_resets ((data->>'tracking_code'));
create index if not exists idx_warroom_audit_at             on public.warroom_audit_log (updated_at desc);

create unique index if not exists idx_warroom_users_single_admin
  on public.warroom_users ((data->>'role'))
  where (data->>'role') = 'admin';

-- ----------------------------------------------------------------------------
-- ۴) فعال‌سازی RLS و سیاست‌های دسترسی
-- ----------------------------------------------------------------------------
alter table public.warroom_users              enable row level security;
alter table public.warroom_groups             enable row level security;
alter table public.warroom_stages             enable row level security;
alter table public.warroom_prizes             enable row level security;
alter table public.warroom_missions           enable row level security;
alter table public.warroom_submissions        enable row level security;
alter table public.warroom_trainings          enable row level security;
alter table public.warroom_medals             enable row level security;
alter table public.warroom_user_medals        enable row level security;
alter table public.warroom_support_tickets    enable row level security;
alter table public.warroom_support_replies    enable row level security;
alter table public.warroom_announcements      enable row level security;
alter table public.warroom_news               enable row level security;
alter table public.warroom_notifications      enable row level security;
alter table public.warroom_home_announcements enable row level security;
alter table public.warroom_faqs               enable row level security;
alter table public.warroom_vitrin_posts       enable row level security;
alter table public.warroom_vitrin_comments    enable row level security;
alter table public.warroom_game_portals       enable row level security;
alter table public.warroom_kv                 enable row level security;
alter table public.warroom_password_reset_requests enable row level security;

alter table public.warroom_credentials     enable row level security;
alter table public.warroom_sessions        enable row level security;
alter table public.warroom_password_resets enable row level security;
alter table public.warroom_audit_log       enable row level security;
alter table public.warroom_security_kv     enable row level security;

do $$
declare
  t text;
begin
  foreach t in array array[
    'warroom_users','warroom_groups','warroom_stages','warroom_prizes','warroom_missions','warroom_submissions',
    'warroom_trainings','warroom_medals','warroom_user_medals',
    'warroom_support_tickets','warroom_support_replies','warroom_announcements',
    'warroom_news','warroom_notifications','warroom_home_announcements','warroom_faqs',
    'warroom_vitrin_posts','warroom_vitrin_comments','warroom_game_portals','warroom_kv',
    'warroom_password_reset_requests'
  ]
  loop
    execute format('drop policy if exists "warroom_public_access" on public.%I', t);
    execute format(
      'create policy "warroom_public_access" on public.%I
       for all to anon, authenticated using (true) with check (true)', t);
  end loop;
end;
$$;

-- ----------------------------------------------------------------------------
-- ۵) مجوزهای اجرا (Grants)
-- ----------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all tables in schema public to service_role;
alter default privileges in schema public grant all on tables to anon, authenticated;

revoke all on public.warroom_credentials     from anon, authenticated;
revoke all on public.warroom_sessions        from anon, authenticated;
revoke all on public.warroom_password_resets from anon, authenticated;
revoke all on public.warroom_audit_log       from anon, authenticated;
revoke all on public.warroom_security_kv     from anon, authenticated;

-- ----------------------------------------------------------------------------
-- ۶) داده اولیه: پروفایل «مدیر ارشد عملیات» (ادمین پیش‌فرض)
-- ----------------------------------------------------------------------------
insert into public.warroom_users (id, data) values (
  'u-admin',
  $${"id":"u-admin","first_name":"امیرحسین","last_name":"فرماندهی کل","national_code":"0012345678","phone":"09120000000","role":"admin","education_level":"متوسطه دوم","grade":"دوازدهم","gender":"پسر","province":"تهران","city":"تهران","birth_date":"1384/01/15","school_name":"دبیرستان ماندگار البرز","personal_code":"900000001","address":"ستاد مرکزی اتاق جنگ","password":"ad89b64d66caa8e30e5d5ce4a9763f4ecc205814c412175f3e2c50027471426d"}$$::jsonb
)
on conflict (id) do update set data = excluded.data, updated_at = now();

-- ----------------------------------------------------------------------------
-- ۷) باکت Storage برای رسانه‌ها
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('warroom-media', 'warroom-media', true)
on conflict (id) do nothing;

drop policy if exists "warroom_media_public_read" on storage.objects;
create policy "warroom_media_public_read" on storage.objects
  for select using (bucket_id = 'warroom-media');

drop policy if exists "warroom_media_public_write" on storage.objects;
create policy "warroom_media_public_write" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'warroom-media');

drop policy if exists "warroom_media_public_update" on storage.objects;
create policy "warroom_media_public_update" on storage.objects
  for update to anon, authenticated using (bucket_id = 'warroom-media');

drop policy if exists "warroom_media_public_delete" on storage.objects;
create policy "warroom_media_public_delete" on storage.objects
  for delete to anon, authenticated using (bucket_id = 'warroom-media');

-- ----------------------------------------------------------------------------
-- ۸) فعال‌سازی انتشار بلادرنگ (Realtime Publications)
-- ----------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table 
      public.warroom_notifications,
      public.warroom_support_tickets,
      public.warroom_support_replies,
      public.warroom_users,
      public.warroom_missions,
      public.warroom_submissions,
      public.warroom_groups,
      public.warroom_stages,
      public.warroom_prizes,
      public.warroom_trainings,
      public.warroom_medals,
      public.warroom_user_medals,
      public.warroom_announcements,
      public.warroom_news,
      public.warroom_home_announcements,
      public.warroom_faqs,
      public.warroom_vitrin_posts,
      public.warroom_vitrin_comments,
      public.warroom_game_portals,
      public.warroom_kv,
      public.warroom_password_reset_requests;
  end if;
exception
  when others then
    null;
end;
$$;
