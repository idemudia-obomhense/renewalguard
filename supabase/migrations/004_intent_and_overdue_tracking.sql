-- =============================================================================
-- RenewalGuard — Add intent field (one-time renewals) and overdue email tracking
-- =============================================================================

-- intent: only meaningful when frequency = 'one_time' (ignored app-side otherwise).
-- overdue_emails_sent / last_overdue_email_sent_at: drive the overdue-escalation
-- cron pass — a counter (not just a timestamp) so escalation is robust to a
-- missed cron run, and a same-day dedupe guard so it never sends twice in a day.
alter table public.renewals
  add column if not exists intent text check (intent is null or intent in ('renew', 'cancel')),
  add column if not exists overdue_emails_sent integer not null default 0 check (overdue_emails_sent >= 0),
  add column if not exists last_overdue_email_sent_at timestamptz;
