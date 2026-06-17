-- =============================================================================
-- RenewalGuard — Initial Schema Migration
-- =============================================================================

-- Enable required extensions
create extension if not exists "pgcrypto";

-- =============================================================================
-- TYPES
-- =============================================================================

create type renewal_category as enum (
  'subscription', 'domain', 'insurance', 'passport', 'visa',
  'certification', 'membership', 'business_permit', 'tax', 'other'
);

create type renewal_frequency as enum (
  'one_time', 'monthly', 'quarterly', 'bi_annual', 'annual'
);

create type renewal_status as enum ('active', 'archived', 'completed');

create type reminder_status as enum ('pending', 'sent', 'failed', 'cancelled');

create type notification_type as enum (
  'reminder_sent', 'renewal_due', 'renewal_overdue'
);

create type activity_event_type as enum (
  'created', 'edited', 'archived', 'restored',
  'reminder_scheduled', 'reminder_sent', 'completed', 'deleted'
);

-- =============================================================================
-- HELPER: updated_at trigger function
-- =============================================================================

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- PROFILES
-- =============================================================================

create table public.profiles (
  id                    uuid        primary key references auth.users(id) on delete cascade,
  full_name             text        not null default '',
  timezone              text        not null default 'UTC',
  currency              text        not null default 'USD',
  date_format           text        not null default 'DD/MM/YYYY'
                          check (date_format in ('DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD')),
  theme                 text        not null default 'system'
                          check (theme in ('light', 'dark', 'system')),
  default_reminder_days integer[]   not null default '{7,30}',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

alter table public.profiles enable row level security;

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function set_updated_at();

-- Profiles RLS
create policy "profiles: owner select"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: owner update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- RENEWALS
-- =============================================================================

create table public.renewals (
  id            uuid              primary key default gen_random_uuid(),
  user_id       uuid              not null references auth.users(id) on delete cascade,
  title         text              not null check (char_length(title) between 1 and 200),
  category      renewal_category  not null,
  frequency     renewal_frequency not null,
  amount        numeric(12, 2)    check (amount >= 0),
  currency      text,
  renewal_date  date              not null,
  notes         text              check (char_length(notes) <= 2000),
  status        renewal_status    not null default 'active',
  reminder_days integer[]         not null default '{7,30}',
  deleted_at    timestamptz,
  created_at    timestamptz       not null default now(),
  updated_at    timestamptz       not null default now()
);

alter table public.renewals enable row level security;

create trigger trg_renewals_updated_at
  before update on public.renewals
  for each row execute function set_updated_at();

-- Indexes
create index idx_renewals_user_id      on public.renewals (user_id);
create index idx_renewals_renewal_date on public.renewals (renewal_date);
create index idx_renewals_status       on public.renewals (status);
create index idx_renewals_category     on public.renewals (category);

-- Renewals RLS (soft-delete: never expose rows where deleted_at is set)
create policy "renewals: owner select"
  on public.renewals for select
  using (auth.uid() = user_id and deleted_at is null);

create policy "renewals: owner insert"
  on public.renewals for insert
  with check (auth.uid() = user_id);

create policy "renewals: owner update"
  on public.renewals for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "renewals: owner delete"
  on public.renewals for delete
  using (auth.uid() = user_id);

-- =============================================================================
-- REMINDERS
-- =============================================================================

create table public.reminders (
  id             uuid            primary key default gen_random_uuid(),
  renewal_id     uuid            not null references public.renewals(id) on delete cascade,
  days_before    integer         not null check (days_before > 0),
  scheduled_date date            not null,
  status         reminder_status not null default 'pending',
  sent_at        timestamptz,
  error_msg      text,
  created_at     timestamptz     not null default now()
);

alter table public.reminders enable row level security;

create index idx_reminders_renewal_id     on public.reminders (renewal_id);
create index idx_reminders_scheduled_date on public.reminders (scheduled_date) where status = 'pending';

-- Reminders RLS (join through renewals to verify ownership)
create policy "reminders: owner select"
  on public.reminders for select
  using (
    exists (
      select 1 from public.renewals
      where renewals.id = reminders.renewal_id
        and renewals.user_id = auth.uid()
    )
  );

create policy "reminders: owner insert"
  on public.reminders for insert
  with check (
    exists (
      select 1 from public.renewals
      where renewals.id = reminders.renewal_id
        and renewals.user_id = auth.uid()
    )
  );

create policy "reminders: owner update"
  on public.reminders for update
  using (
    exists (
      select 1 from public.renewals
      where renewals.id = reminders.renewal_id
        and renewals.user_id = auth.uid()
    )
  );

create policy "reminders: owner delete"
  on public.reminders for delete
  using (
    exists (
      select 1 from public.renewals
      where renewals.id = reminders.renewal_id
        and renewals.user_id = auth.uid()
    )
  );

-- =============================================================================
-- NOTIFICATIONS
-- =============================================================================

create table public.notifications (
  id         uuid              primary key default gen_random_uuid(),
  user_id    uuid              not null references auth.users(id) on delete cascade,
  renewal_id uuid              references public.renewals(id) on delete set null,
  type       notification_type not null,
  title      text              not null,
  message    text              not null,
  read       boolean           not null default false,
  created_at timestamptz       not null default now()
);

alter table public.notifications enable row level security;

create index idx_notifications_user_id   on public.notifications (user_id);
create index idx_notifications_unread    on public.notifications (user_id, created_at desc) where read = false;
create index idx_notifications_renewal_id on public.notifications (renewal_id);

-- Notifications RLS
create policy "notifications: owner select"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "notifications: owner update"
  on public.notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "notifications: owner delete"
  on public.notifications for delete
  using (auth.uid() = user_id);

-- =============================================================================
-- RENEWAL ACTIVITY LOG
-- =============================================================================

create table public.renewal_activity_log (
  id          uuid                primary key default gen_random_uuid(),
  renewal_id  uuid                not null references public.renewals(id) on delete cascade,
  user_id     uuid                not null references auth.users(id) on delete cascade,
  event_type  activity_event_type not null,
  metadata    jsonb,
  created_at  timestamptz         not null default now()
);

alter table public.renewal_activity_log enable row level security;

create index idx_activity_renewal_id on public.renewal_activity_log (renewal_id);
create index idx_activity_user_id    on public.renewal_activity_log (user_id);
create index idx_activity_created_at on public.renewal_activity_log (created_at desc);

-- Activity log RLS
create policy "activity_log: owner select"
  on public.renewal_activity_log for select
  using (auth.uid() = user_id);

-- Only service role inserts activity logs (no user policy for insert)
-- (server-side actions bypass RLS with service role key)

-- =============================================================================
-- DASHBOARD STATS VIEW
-- =============================================================================

create or replace view public.dashboard_stats as
select
  r.user_id,
  count(*) filter (where r.status = 'active')                                          as total_active,
  count(*) filter (
    where r.status = 'active'
      and date_part('year',  r.renewal_date) = date_part('year',  current_date)
      and date_part('month', r.renewal_date) = date_part('month', current_date)
  )                                                                                     as due_this_month,
  count(*) filter (where r.status = 'active' and r.renewal_date < current_date)        as overdue,
  coalesce(sum(r.amount) filter (where r.status = 'active' and r.frequency = 'annual'), 0)
                                                                                        as estimated_annual_spend
from public.renewals r
where r.deleted_at is null
group by r.user_id;
