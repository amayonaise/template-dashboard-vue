import { ref, computed } from 'vue'
import {
  initialOrders,
  initialActivities,
  initialNotifications,
  type OrderRecord,
  type OrderStatus,
  type ActivityEvent,
  type NotificationItem,
} from '@/data/dashboard'

export interface ToastMessage {
  id: number
  title: string
  description?: string
}

const orders = ref<OrderRecord[]>(initialOrders.map((o) => ({ ...o })))
const activities = ref<ActivityEvent[]>(initialActivities.map((a) => ({ ...a })))
const notifications = ref<NotificationItem[]>(initialNotifications.map((n) => ({ ...n })))
const toasts = ref<ToastMessage[]>([])

const isCommandPaletteOpen = ref(false)
const isCustomizerOpen = ref(false)
const isNewOrderModalOpen = ref(false)
const isMobileSidebarOpen = ref(false)

let toastSeq = 1
let orderSeq = 7892

const avatarGradients = [
  'from-chart-1/70 to-chart-1',
  'from-chart-2/70 to-chart-2',
  'from-chart-3/70 to-chart-3',
  'from-chart-4/70 to-chart-4',
  'from-chart-5/70 to-chart-5',
]

export function useDashboardStore() {
  const unreadNotificationCount = computed(
    () => notifications.value.filter((n) => !n.read).length,
  )

  const ordersBadgeCount = computed(() => 12 + Math.max(0, orders.value.length - initialOrders.length))

  function pushToast(title: string, description?: string) {
    const id = toastSeq++
    toasts.value.push({ id, title, description })
    setTimeout(() => {
      dismissToast(id)
    }, 3400)
  }

  function dismissToast(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function markAllNotificationsRead() {
    notifications.value.forEach((n) => {
      n.read = true
    })
    pushToast('Notifications cleared', 'All notifications marked as read.')
  }

  function toggleNotificationRead(id: string) {
    const item = notifications.value.find((n) => n.id === id)
    if (item) {
      item.read = true
    }
  }

  function addOrder(payload: {
    customer: string
    email: string
    product: string
    amount: number
    status: OrderStatus
  }) {
    const id = `ORD-${orderSeq++}`
    const parts = payload.customer.trim().split(/\s+/)
    const initials = parts
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .join('') || 'NA'

    const newOrder: OrderRecord = {
      id,
      customer: payload.customer.trim(),
      email: payload.email.trim(),
      initials,
      avatarClass: avatarGradients[orderSeq % avatarGradients.length],
      product: payload.product,
      status: payload.status,
      amount: payload.amount,
      date: 'Just now',
    }

    orders.value.unshift(newOrder)

    activities.value.unshift({
      id: `act-${Date.now()}`,
      title: 'New order placed',
      description: `${newOrder.customer} purchased ${newOrder.product}`,
      time: 'Just now',
      iconName: 'cart',
      iconBgClass: 'bg-chart-1/10',
      iconColorClass: 'text-chart-1',
    })

    notifications.value.unshift({
      id: `notif-${Date.now()}`,
      title: 'New order received',
      description: `${newOrder.customer} placed order ${newOrder.id} for $${newOrder.amount.toFixed(2)}`,
      time: 'Just now',
      read: false,
      iconName: 'cart',
      iconBgClass: 'bg-chart-1/10',
      iconColorClass: 'text-chart-1',
    })

    pushToast('Order created', `${newOrder.id} for ${newOrder.customer} ($${newOrder.amount.toFixed(2)})`)
  }

  function updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = orders.value.find((o) => o.id === orderId)
    if (!order) return
    order.status = status
    pushToast('Order updated', `${orderId} status changed to ${status}.`)
  }

  function deleteOrder(orderId: string) {
    orders.value = orders.value.filter((o) => o.id !== orderId)
    pushToast('Order removed', `${orderId} has been removed from recent orders.`)
  }

  return {
    orders,
    activities,
    notifications,
    toasts,
    unreadNotificationCount,
    ordersBadgeCount,
    isCommandPaletteOpen,
    isCustomizerOpen,
    isNewOrderModalOpen,
    isMobileSidebarOpen,
    pushToast,
    dismissToast,
    markAllNotificationsRead,
    toggleNotificationRead,
    addOrder,
    updateOrderStatus,
    deleteOrder,
  }
}
