-- =============================================================================
-- Fix soft-delete RLS paradox on renewals
-- =============================================================================
-- The original "renewals: owner select" policy filtered out rows where
-- deleted_at is set. Postgres requires the *new* row of an UPDATE to also
-- satisfy that same SELECT policy, so setting deleted_at (soft-deleting)
-- made the row fail its own visibility policy and Postgres rejected the
-- UPDATE outright with "new row violates row-level security policy".
--
-- Fix: the SELECT policy only enforces ownership now; soft-deleted rows are
-- filtered out at the application query layer instead (lib/data/renewals.ts).

drop policy if exists "renewals: owner select" on public.renewals;

create policy "renewals: owner select"
  on public.renewals for select
  using (auth.uid() = user_id);
