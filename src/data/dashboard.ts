export interface KpiMetric {
  id: string
  label: string
  value: string
  change: string
  positive: boolean
  period: string
  chartColorVar: string
  iconBgClass: string
  iconColorClass: string
  iconName: 'dollar' | 'users' | 'cart' | 'eye'
  sparkline: number[]
}

export interface MonthlyPerformancePoint {
  month: string
  revenue: number
  orders: number
  profit: number
}

export interface TrafficSource {
  id: string
  name: string
  percentage: number
  visits: number
  colorVar: string
}

export interface MonthlyGoal {
  id: string
  title: string
  percentage: number
  current: string
  target: string
  barClass: string
}

export type OrderStatus = 'completed' | 'processing' | 'pending' | 'cancelled'

export interface OrderRecord {
  id: string
  customer: string
  email: string
  initials: string
  avatarClass: string
  product: string
  status: OrderStatus
  amount: number
  date: string
}

export interface ActivityEvent {
  id: string
  title: string
  description: string
  time: string
  iconName: 'cart' | 'user-plus' | 'star' | 'credit-card' | 'message-square'
  iconBgClass: string
  iconColorClass: string
}

export interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  iconName: 'cart' | 'credit-card' | 'users' | 'truck'
  iconBgClass: string
  iconColorClass: string
}

export const kpiMetrics: KpiMetric[] = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    value: '$48,295',
    change: '+12.5%',
    positive: true,
    period: 'vs last month',
    chartColorVar: 'var(--chart-1)',
    iconBgClass: 'bg-chart-1/10',
    iconColorClass: 'text-chart-1',
    iconName: 'dollar',
    sparkline: [33.2, 28.2, 37.0, 24.4, 30.7, 20.6, 15.6, 23.1, 11.8, 18.1, 8.0, 3.0],
  },
  {
    id: 'users',
    label: 'Active Users',
    value: '2,847',
    change: '+8.2%',
    positive: true,
    period: 'vs last month',
    chartColorVar: 'var(--chart-2)',
    iconBgClass: 'bg-chart-2/10',
    iconColorClass: 'text-chart-2',
    iconName: 'users',
    sparkline: [37.0, 28.5, 32.8, 22.1, 26.4, 15.8, 24.3, 11.5, 17.9, 7.3, 13.6, 3.0],
  },
  {
    id: 'orders',
    label: 'Total Orders',
    value: '1,432',
    change: '-3.1%',
    positive: false,
    period: 'vs last month',
    chartColorVar: 'var(--chart-3)',
    iconBgClass: 'bg-chart-3/10',
    iconColorClass: 'text-chart-3',
    iconName: 'cart',
    sparkline: [21.5, 14.2, 7.0, 17.5, 28.2, 21.0, 34.0, 26.5, 30.8, 36.5, 29.5, 35.0],
  },
  {
    id: 'views',
    label: 'Page Views',
    value: '284K',
    change: '+24.7%',
    positive: true,
    period: 'vs last month',
    chartColorVar: 'var(--chart-4)',
    iconBgClass: 'bg-chart-4/10',
    iconColorClass: 'text-chart-4',
    iconName: 'eye',
    sparkline: [37.0, 34.0, 35.5, 31.0, 27.5, 29.0, 24.5, 20.5, 18.0, 14.5, 9.5, 4.0],
  },
]

export const monthlyPerformance: MonthlyPerformancePoint[] = [
  { month: 'Jan', revenue: 18500, orders: 245, profit: 6200 },
  { month: 'Feb', revenue: 22100, orders: 310, profit: 8100 },
  { month: 'Mar', revenue: 19800, orders: 278, profit: 7200 },
  { month: 'Apr', revenue: 28500, orders: 388, profit: 11400 },
  { month: 'May', revenue: 32000, orders: 420, profit: 13200 },
  { month: 'Jun', revenue: 29600, orders: 384, profit: 11800 },
  { month: 'Jul', revenue: 36100, orders: 465, profit: 15600 },
  { month: 'Aug', revenue: 38200, orders: 498, profit: 16800 },
  { month: 'Sep', revenue: 41300, orders: 534, profit: 18200 },
  { month: 'Oct', revenue: 39800, orders: 512, profit: 17100 },
  { month: 'Nov', revenue: 44100, orders: 580, profit: 19800 },
  { month: 'Dec', revenue: 48295, orders: 612, profit: 22100 },
]

export const trafficSources: TrafficSource[] = [
  { id: 'direct', name: 'Direct', percentage: 35, visits: 99400, colorVar: 'var(--chart-1)' },
  { id: 'organic', name: 'Organic', percentage: 28, visits: 79520, colorVar: 'var(--chart-2)' },
  { id: 'referral', name: 'Referral', percentage: 22, visits: 62480, colorVar: 'var(--chart-3)' },
  { id: 'social', name: 'Social', percentage: 15, visits: 42600, colorVar: 'var(--chart-5)' },
]

export const monthlyGoals: MonthlyGoal[] = [
  {
    id: 'monthly-revenue',
    title: 'Monthly Revenue',
    percentage: 88,
    current: '48,295',
    target: 'Target: 55,000',
    barClass: 'bg-chart-1',
  },
  {
    id: 'new-customers',
    title: 'New Customers',
    percentage: 85,
    current: '847',
    target: 'Target: 1,000',
    barClass: 'bg-chart-2',
  },
  {
    id: 'conversion-rate',
    title: 'Conversion Rate',
    percentage: 76,
    current: '3.8',
    target: 'Target: 5',
    barClass: 'bg-chart-3',
  },
]

export const initialOrders: OrderRecord[] = [
  {
    id: 'ORD-7891',
    customer: 'Emma Wilson',
    email: 'emma@example.com',
    initials: 'EW',
    avatarClass: 'from-chart-1/70 to-chart-1',
    product: 'Pro Dashboard License',
    status: 'completed',
    amount: 299.0,
    date: 'Today, 14:32',
  },
  {
    id: 'ORD-7890',
    customer: 'James Chen',
    email: 'james@company.io',
    initials: 'JC',
    avatarClass: 'from-chart-2/70 to-chart-2',
    product: 'Team Plan Upgrade',
    status: 'processing',
    amount: 599.0,
    date: 'Today, 13:18',
  },
  {
    id: 'ORD-7889',
    customer: 'Sofia Garcia',
    email: 'sofia@startup.co',
    initials: 'SG',
    avatarClass: 'from-chart-3/70 to-chart-3',
    product: 'Enterprise License',
    status: 'completed',
    amount: 1499.0,
    date: 'Today, 11:04',
  },
  {
    id: 'ORD-7888',
    customer: 'Alex Thompson',
    email: 'alex@dev.com',
    initials: 'AT',
    avatarClass: 'from-chart-4/70 to-chart-4',
    product: 'Single License',
    status: 'pending',
    amount: 79.0,
    date: 'Today, 09:47',
  },
  {
    id: 'ORD-7887',
    customer: 'Maria Santos',
    email: 'maria@agency.co',
    initials: 'MS',
    avatarClass: 'from-chart-5/70 to-chart-5',
    product: 'Pro Dashboard License',
    status: 'completed',
    amount: 299.0,
    date: 'Yesterday, 18:22',
  },
  {
    id: 'ORD-7886',
    customer: 'David Kim',
    email: 'david@tech.io',
    initials: 'DK',
    avatarClass: 'from-chart-1/70 to-chart-1',
    product: 'Team Plan Upgrade',
    status: 'cancelled',
    amount: 599.0,
    date: 'Yesterday, 15:10',
  },
]

export const initialActivities: ActivityEvent[] = [
  {
    id: 'act-1',
    title: 'New order placed',
    description: 'Emma Wilson purchased Pro Dashboard License',
    time: '2 min ago',
    iconName: 'cart',
    iconBgClass: 'bg-chart-1/10',
    iconColorClass: 'text-chart-1',
  },
  {
    id: 'act-2',
    title: 'New customer registered',
    description: 'James Chen created an account',
    time: '15 min ago',
    iconName: 'user-plus',
    iconBgClass: 'bg-chart-2/10',
    iconColorClass: 'text-chart-2',
  },
  {
    id: 'act-3',
    title: '5-star review received',
    description: '"Amazing template, exactly what I needed!"',
    time: '1 hour ago',
    iconName: 'star',
    iconBgClass: 'bg-chart-5/10',
    iconColorClass: 'text-chart-5',
  },
  {
    id: 'act-4',
    title: 'Payment received',
    description: '$1,499 from Sofia Garcia',
    time: '2 hours ago',
    iconName: 'credit-card',
    iconBgClass: 'bg-chart-3/10',
    iconColorClass: 'text-chart-3',
  },
  {
    id: 'act-5',
    title: 'Support ticket resolved',
    description: 'Ticket #4521 marked as resolved',
    time: '3 hours ago',
    iconName: 'message-square',
    iconBgClass: 'bg-chart-4/10',
    iconColorClass: 'text-chart-4',
  },
  {
    id: 'act-6',
    title: 'New order placed',
    description: 'Alex Thompson purchased Single License',
    time: '5 hours ago',
    iconName: 'cart',
    iconBgClass: 'bg-chart-1/10',
    iconColorClass: 'text-chart-1',
  },
]

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New order received',
    description: 'Emma Wilson placed order ORD-7891 for $299.00',
    time: '2 min ago',
    read: false,
    iconName: 'cart',
    iconBgClass: 'bg-chart-1/10',
    iconColorClass: 'text-chart-1',
  },
  {
    id: 'notif-2',
    title: 'Payment processed',
    description: 'Payment of $1,499.00 from Sofia Garcia confirmed',
    time: '15 min ago',
    read: false,
    iconName: 'credit-card',
    iconBgClass: 'bg-chart-2/10',
    iconColorClass: 'text-chart-2',
  },
  {
    id: 'notif-3',
    title: 'New customer signup',
    description: 'James Chen created an account',
    time: '1 hour ago',
    read: false,
    iconName: 'users',
    iconBgClass: 'bg-chart-3/10',
    iconColorClass: 'text-chart-3',
  },
  {
    id: 'notif-4',
    title: 'Order shipped',
    description: 'ORD-7889 has been shipped to Sofia Garcia',
    time: '2 hours ago',
    read: true,
    iconName: 'truck',
    iconBgClass: 'bg-chart-1/10',
    iconColorClass: 'text-chart-1',
  },
]
