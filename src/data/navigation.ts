import type { Component } from 'vue'
import {
  LayoutDashboard,
  BarChart3,
  Store,
  Handshake,
  Rocket,
  ChartNoAxesCombined,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Mail,
  MessageCircle,
  FolderOpen,
  Kanban,
  Calendar,
  ListChecks,
  FileInput,
  CreditCard,
  UserCog,
  Bell,
  Settings,
  CircleHelp,
  BookOpen,
} from 'lucide-vue-next'

export interface NavItem {
  id: string
  labelKey: string
  to: string
  icon: Component
  badge?: number
  badgeType?: 'orders' | 'notifications'
}

export interface NavGroup {
  id: string
  labelKey: string
  items: NavItem[]
}

export const navigationGroups: NavGroup[] = [
  {
    id: 'overview',
    labelKey: 'nav.groups.overview',
    items: [
      { id: 'dashboard', labelKey: 'nav.dashboard', to: '/', icon: LayoutDashboard },
      { id: 'analytics', labelKey: 'nav.analytics', to: '/analytics', icon: BarChart3 },
      { id: 'ecommerce', labelKey: 'nav.ecommerce', to: '/ecommerce', icon: Store },
      { id: 'crm', labelKey: 'nav.crm', to: '/crm', icon: Handshake },
      { id: 'saas', labelKey: 'nav.saas', to: '/saas', icon: Rocket },
      { id: 'charts', labelKey: 'nav.charts', to: '/charts', icon: ChartNoAxesCombined },
    ],
  },
  {
    id: 'commerce',
    labelKey: 'nav.groups.commerce',
    items: [
      { id: 'orders', labelKey: 'nav.orders', to: '/orders', icon: ShoppingCart, badge: 12, badgeType: 'orders' },
      { id: 'products', labelKey: 'nav.products', to: '/products', icon: Package },
      { id: 'customers', labelKey: 'nav.customers', to: '/customers', icon: Users },
      { id: 'invoices', labelKey: 'nav.invoices', to: '/invoices', icon: FileText },
    ],
  },
  {
    id: 'apps',
    labelKey: 'nav.groups.apps',
    items: [
      { id: 'mail', labelKey: 'nav.mail', to: '/mail', icon: Mail },
      { id: 'chat', labelKey: 'nav.chat', to: '/chat', icon: MessageCircle },
      { id: 'files', labelKey: 'nav.files', to: '/files', icon: FolderOpen },
      { id: 'kanban', labelKey: 'nav.kanban', to: '/kanban', icon: Kanban },
      { id: 'calendar', labelKey: 'nav.calendar', to: '/calendar', icon: Calendar },
      { id: 'wizard', labelKey: 'nav.wizard', to: '/wizard', icon: ListChecks },
      { id: 'forms', labelKey: 'nav.forms', to: '/forms', icon: FileInput },
    ],
  },
  {
    id: 'finance',
    labelKey: 'nav.groups.finance',
    items: [
      { id: 'billing', labelKey: 'nav.billing', to: '/billing', icon: CreditCard },
    ],
  },
  {
    id: 'system',
    labelKey: 'nav.groups.system',
    items: [
      { id: 'users', labelKey: 'nav.users', to: '/users', icon: UserCog },
      { id: 'notifications', labelKey: 'nav.notifications', to: '/notifications', icon: Bell, badge: 3, badgeType: 'notifications' },
      { id: 'settings', labelKey: 'nav.settings', to: '/settings', icon: Settings },
      { id: 'support', labelKey: 'nav.support', to: '/support', icon: CircleHelp },
    ],
  },
]

export const documentationNavItem: NavItem = {
  id: 'docs',
  labelKey: 'nav.documentation',
  to: '/docs',
  icon: BookOpen,
}

export const allNavItems: NavItem[] = [
  ...navigationGroups.flatMap((g) => g.items),
  documentationNavItem,
]
