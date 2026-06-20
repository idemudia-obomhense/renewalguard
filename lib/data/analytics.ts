import { subMonths, parseISO, isAfter } from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/data/profile'
import { ANNUALIZED_MULTIPLIER } from '@/lib/data/dashboard'
import { DEFAULT_CURRENCY } from '@/lib/constants'
import { today } from '@/lib/utils/date'
import type { Renewal, RenewalCategory } from '@/types'

function annualized(r: Pick<Renewal, 'amount' | 'frequency'>): number {
  return (r.amount ?? 0) * ANNUALIZED_MULTIPLIER[r.frequency]
}

/**
 * There's no event log of when a renewal stopped being active (the
 * renewal_activity_log table exists but is only ever written to by the
 * cron's auto-roll, not by archive/complete/restore). The best available
 * proxy is `updated_at`, which a DB trigger refreshes on every update —
 * including every status-changing action. So "active sometime in the last
 * 12 months" is approximated as: currently active, OR archived/completed
 * with `updated_at` inside that window. This can't distinguish "archived
 * for an unrelated edit" from "archived because it was cancelled," but
 * status-changing actions are by far the most common reason an
 * archived/completed renewal's row gets touched again.
 */
function wasActiveInLastYear(r: Renewal, oneYearAgo: Date): boolean {
  if (r.status === 'active') return true
  return isAfter(parseISO(r.updated_at), oneYearAgo)
}

interface CurrencyTotal {
  currency: string
  amount: number
  count: number
}

function totalsByCurrency(renewals: Renewal[], primaryCurrency: string): CurrencyTotal[] {
  const map = new Map<string, CurrencyTotal>()
  for (const r of renewals) {
    const currency = r.currency ?? primaryCurrency
    const entry = map.get(currency) ?? { currency, amount: 0, count: 0 }
    entry.amount += annualized(r)
    entry.count += 1
    map.set(currency, entry)
  }
  return [...map.values()]
}

/**
 * Picks which currency the two hero numbers are shown in: the user's
 * profile currency if it has any active spend, else whichever currency
 * actually has the most active spend (never silently show "₦0" when real
 * spend exists only in another currency). Falls back to the total-spend
 * set if there's no active spend at all, and finally to the profile
 * currency itself for a genuine empty state.
 */
function pickHeroCurrency(
  activeTotals: CurrencyTotal[],
  totalTotals: CurrencyTotal[],
  primaryCurrency: string,
): string {
  const fromActive = pickFromTotals(activeTotals, primaryCurrency)
  if (fromActive) return fromActive
  const fromTotal = pickFromTotals(totalTotals, primaryCurrency)
  if (fromTotal) return fromTotal
  return primaryCurrency
}

function pickFromTotals(totals: CurrencyTotal[], primaryCurrency: string): string | null {
  const primary = totals.find(t => t.currency === primaryCurrency)
  if (primary && primary.count > 0) return primaryCurrency
  const sorted = [...totals].sort((a, b) => b.amount - a.amount)
  return sorted[0]?.currency ?? null
}

export interface CategoryBreakdownRow {
  category: RenewalCategory
  count: number
  amount: number
  share: number
}

export interface MonthlyAmount {
  month: number // 0-11
  amount: number
}

export interface SpendAnalytics {
  heroCurrency: string
  activeSpend: { amount: number; renewalCount: number }
  totalSpend: { amount: number; renewalCount: number }
  otherActiveCurrencies: { currency: string; amount: number }[]
  byCategory: CategoryBreakdownRow[]
  byMonth: MonthlyAmount[]
}

export async function getSpendAnalytics(): Promise<SpendAnalytics> {
  const supabase = await createClient()
  const profile = await getProfile()
  const primaryCurrency = profile?.currency ?? DEFAULT_CURRENCY

  const { data } = await supabase.from('renewals').select('*').is('deleted_at', null)
  const renewals = (data ?? []) as Renewal[]

  const activeRenewals = renewals.filter(r => r.status === 'active')
  const oneYearAgo = subMonths(today(), 12)
  const totalRenewals = renewals.filter(r => wasActiveInLastYear(r, oneYearAgo))

  const activeTotals = totalsByCurrency(activeRenewals, primaryCurrency)
  const totalTotals = totalsByCurrency(totalRenewals, primaryCurrency)
  const heroCurrency = pickHeroCurrency(activeTotals, totalTotals, primaryCurrency)

  const activeHero = activeTotals.find(t => t.currency === heroCurrency) ?? { amount: 0, count: 0 }
  const totalHero = totalTotals.find(t => t.currency === heroCurrency) ?? { amount: 0, count: 0 }

  const otherActiveCurrencies = activeTotals
    .filter(t => t.currency !== heroCurrency)
    .map(t => ({ currency: t.currency, amount: t.amount }))
    .sort((a, b) => b.amount - a.amount)

  const activeHeroRenewals = activeRenewals.filter(r => (r.currency ?? primaryCurrency) === heroCurrency)

  const categoryMap = new Map<RenewalCategory, { count: number; amount: number }>()
  for (const r of activeHeroRenewals) {
    const entry = categoryMap.get(r.category) ?? { count: 0, amount: 0 }
    entry.count += 1
    entry.amount += annualized(r)
    categoryMap.set(r.category, entry)
  }
  const categoryTotal = [...categoryMap.values()].reduce((s, c) => s + c.amount, 0)
  const byCategory: CategoryBreakdownRow[] = [...categoryMap.entries()]
    .map(([category, { count, amount }]) => ({
      category,
      count,
      amount,
      share: categoryTotal > 0 ? amount / categoryTotal : 0,
    }))
    .sort((a, b) => b.amount - a.amount)

  const currentYear = today().getFullYear()
  const byMonth: MonthlyAmount[] = Array.from({ length: 12 }, (_, month) => ({ month, amount: 0 }))
  for (const r of activeHeroRenewals) {
    const date = parseISO(r.renewal_date)
    if (date.getFullYear() !== currentYear) continue
    byMonth[date.getMonth()].amount += r.amount ?? 0
  }

  return {
    heroCurrency,
    activeSpend: { amount: activeHero.amount, renewalCount: activeHero.count },
    totalSpend: { amount: totalHero.amount, renewalCount: totalHero.count },
    otherActiveCurrencies,
    byCategory,
    byMonth,
  }
}
