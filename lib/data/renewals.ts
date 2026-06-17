import { createClient } from '@/lib/supabase/server'
import { computeUrgency, currentMonthRange, getDaysRemaining, toISODateString, today } from '@/lib/utils/date'
import type { Renewal, RenewalFilter, RenewalSortKey, RenewalWithUrgency } from '@/types'

interface GetRenewalsParams {
  filter?: RenewalFilter
  sort?: RenewalSortKey
  search?: string
}

export async function getRenewals(params: GetRenewalsParams = {}): Promise<RenewalWithUrgency[]> {
  const { filter = 'all', sort = 'due_date', search = '' } = params
  const supabase = await createClient()

  // Soft-deleted rows are filtered here, not via RLS — see migrations/002_fix_soft_delete_rls.sql.
  let query = supabase.from('renewals').select('*').is('deleted_at', null)

  switch (filter) {
    case 'active':
      query = query.eq('status', 'active')
      break
    case 'archived':
      query = query.eq('status', 'archived')
      break
    case 'due_this_month': {
      const { start, end } = currentMonthRange()
      query = query.eq('status', 'active').gte('renewal_date', start).lte('renewal_date', end)
      break
    }
    case 'overdue':
      query = query.eq('status', 'active').lt('renewal_date', toISODateString(today()))
      break
    case 'all':
    default:
      query = query.neq('status', 'archived')
      break
  }

  if (search.trim()) {
    query = query.ilike('title', `%${search.trim()}%`)
  }

  switch (sort) {
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'oldest':
      query = query.order('created_at', { ascending: true })
      break
    case 'category':
      query = query.order('category', { ascending: true })
      break
    case 'cost':
      query = query.order('amount', { ascending: false, nullsFirst: false })
      break
    case 'due_date':
    default:
      query = query.order('renewal_date', { ascending: true })
      break
  }

  const { data, error } = await query
  if (error) return []

  return (data as Renewal[]).map(r => ({
    ...r,
    urgency:        computeUrgency(r),
    days_remaining: getDaysRemaining(r.renewal_date),
  }))
}

export async function getRenewalById(id: string): Promise<Renewal | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('renewals')
    .select('*')
    .eq('id', id)
    .is('deleted_at', null)
    .single()

  if (error) return null
  return data as Renewal
}
