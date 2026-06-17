import {
  CreditCard,
  Globe,
  Shield,
  BookOpen,
  Stamp,
  Award,
  Users,
  Building2,
  Receipt,
  Tag,
  LayoutDashboard,
  CalendarClock,
  Settings,
  type LucideIcon,
} from 'lucide-react'

/**
 * Maps the icon name strings stored in CATEGORY_META / NAV_ITEMS
 * (lib/constants.ts) to their Lucide component. Keeping icon identity as a
 * string in constants avoids importing React components into plain data.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  CreditCard,
  Globe,
  Shield,
  BookOpen,
  Stamp,
  Award,
  Users,
  Building2,
  Receipt,
  Tag,
  LayoutDashboard,
  CalendarClock,
  Settings,
}

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Tag
}
