import { createClient } from '@/lib/supabase/server'
import type { Notification } from '@/types'

export async function getNotifications(limit = 10): Promise<Notification[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return []
  return data as Notification[]
}

export async function getUnreadNotificationCount(): Promise<number> {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('read', false)

  if (error) return 0
  return count ?? 0
}
