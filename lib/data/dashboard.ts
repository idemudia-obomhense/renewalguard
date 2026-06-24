import { createClient } from '@/lib/supabase/server'
import { getProfile } from '@/lib/data/profile'
import { computeUrgency, getDaysRemaining, isDueThisMonth, isOverdue } from '@/lib/utils/date'
import type { DashboardStats, Renewal, RenewalFrequency, RenewalWithUrgency } from '@/types'

export const ANNUALIZED_MULTIPLIER: Record<RenewalFrequency, number> = {
  one_time:  0,
  monthly:   12,
  quarterly: 4,
  bi_annual: 2,
  annual:    1,
}

async function getActiveRenewals(): Promise<Renewal[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('renewals')
    .select('*')
    .is('deleted_at', null)
    .eq('status', 'active')
    .order('renewal_date', { ascending: true })

  if (error) return []
  return data as Renewal[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [profile, renewals] = await Promise.all([getProfile(), getActiveRenewals()])
  const currency = profile?.currency ?? 'USD'

  // Renewals can each carry their own currency — only ones matching the
  // profile currency can be honestly summed into a single total here.
  const estimatedSpend = renewals.reduce((sum, r) => {
    if (r.amount == null || r.currency !== currency) return sum
    return sum + r.amount * ANNUALIZED_MULTIPLIER[r.frequency]
  }, 0)

  return {
    total_active:    renewals.length,
    due_this_month:  renewals.filter(r => isDueThisMonth(r.renewal_date)).length,
    overdue:         renewals.filter(r => isOverdue(r.renewal_date)).length,
    estimated_spend: estimatedSpend,
    currency,
  }
}

export async function getUpcomingRenewals(limit = 6): Promise<RenewalWithUrgency[]> {
  const renewals = await getActiveRenewals()

  return renewals.slice(0, limit).map(r => ({
    ...r,
    urgency:        computeUrgency(r),
    days_remaining: getDaysRemaining(r.renewal_date),
  }))
}
