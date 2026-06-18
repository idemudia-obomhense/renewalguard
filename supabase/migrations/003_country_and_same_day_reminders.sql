-- =============================================================================
-- RenewalGuard — Add country to profiles, allow same-day (0) reminders
-- =============================================================================

-- Country, set at signup and used to derive the profile's default currency.
-- Nullable: pre-existing rows and any future non-signup-form insert path
-- (e.g. OAuth) won't have it.
alter table public.profiles add column if not exists country text;

-- Re-create the signup trigger to also persist country/currency from the
-- auth user's metadata (passed by signUpAction). Falls back to the existing
-- defaults when absent so other insert paths keep working unchanged.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, country, currency)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'country',
    coalesce(new.raw_user_meta_data ->> 'currency', 'USD')
  );
  return new;
end;
$$;

-- Allow a same-day ("Today") reminder option (days_before = 0).
alter table public.reminders drop constraint if exists reminders_days_before_check;
alter table public.reminders add constraint reminders_days_before_check check (days_before >= 0);
