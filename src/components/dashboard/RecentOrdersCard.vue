<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowUpRight, Ellipsis, Eye, CheckCircle2, Copy, Trash2, X } from 'lucide-vue-next'
import { useDashboardStore } from '@/composables/useDashboardStore'
import { useI18n } from '@/composables/useI18n'
import type { OrderRecord, OrderStatus } from '@/data/dashboard'

const { orders, updateOrderStatus, deleteOrder, pushToast } = useDashboardStore()
const { t } = useI18n()

const openMenuId = ref<string | null>(null)
const selectedOrder = ref<OrderRecord | null>(null)

function statusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case 'completed':
      return 'bg-success text-success-foreground'
    case 'processing':
      return 'bg-primary text-primary-foreground'
    case 'pending':
      return 'bg-warning text-warning-foreground'
    case 'cancelled':
      return 'bg-destructive text-destructive-foreground'
  }
}

function formatAmount(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function toggleMenu(id: string) {
  openMenuId.value = openMenuId.value === id ? null : id
}

function viewOrder(order: OrderRecord) {
  selectedOrder.value = order
  openMenuId.value = null
}

function copyOrderId(id: string) {
  navigator.clipboard?.writeText(id).catch(() => {})
  pushToast('Copied to clipboard', `Order ID ${id} copied.`)
  openMenuId.value = null
}

function markCompleted(id: string) {
  updateOrderStatus(id, 'completed')
  openMenuId.value = null
}

function removeOrder(id: string) {
  deleteOrder(id)
  openMenuId.value = null
}

function onOutsideClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('[data-order-menu]')) {
    openMenuId.value = null
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    openMenuId.value = null
    selectedOrder.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', onOutsideClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onOutsideClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div
    data-slot="card"
    class="min-w-0 rounded-xl border border-border bg-card text-card-foreground shadow-sm"
  >
    <div class="flex flex-row items-center justify-between p-6 pb-4">
      <div>
        <h2 class="text-base font-semibold tracking-tight">
          {{ t('dashboard.recentOrders') }}
        </h2>
        <p class="mt-0.5 text-xs text-muted-foreground">
          {{ t('dashboard.recentOrdersSub') }}
        </p>
      </div>

      <RouterLink
        to="/orders"
        class="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
      >
        {{ t('dashboard.viewAll') }}
        <ArrowUpRight class="h-3.5 w-3.5" aria-hidden="true" />
      </RouterLink>
    </div>

    <div class="p-6 pt-0">
      <div class="relative overflow-x-auto">
        <table class="w-full min-w-[600px]">
          <thead>
            <tr class="border-b border-border">
              <th class="pb-3 text-start text-xs font-medium text-muted-foreground">Customer</th>
              <th class="pb-3 text-start text-xs font-medium text-muted-foreground">Order ID</th>
              <th class="pb-3 text-start text-xs font-medium text-muted-foreground">Product</th>
              <th class="pb-3 text-start text-xs font-medium text-muted-foreground">Status</th>
              <th class="pb-3 text-end text-xs font-medium text-muted-foreground">Amount</th>
              <th class="relative pb-3 text-end text-xs font-medium text-muted-foreground">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="order in orders"
              :key="order.id"
              class="group border-b border-border/50 transition-colors last:border-0 hover:bg-muted/30"
            >
              <td class="py-3.5 pe-3">
                <div class="flex items-center gap-3">
                  <span
                    class="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br text-[10px] font-bold text-white"
                    :class="order.avatarClass"
                  >
                    {{ order.initials }}
                  </span>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-medium">{{ order.customer }}</p>
                    <p class="truncate text-xs text-muted-foreground">{{ order.email }}</p>
                  </div>
                </div>
              </td>

              <td class="py-3.5 pe-3">
                <span class="font-mono text-xs text-muted-foreground">{{ order.id }}</span>
              </td>

              <td class="py-3.5 pe-3">
                <span class="text-sm">{{ order.product }}</span>
              </td>

              <td class="py-3.5 pe-3">
                <span
                  class="inline-flex items-center rounded-md border border-transparent px-2 py-0.5 text-[11px] font-medium capitalize shadow-sm transition-colors"
                  :class="statusBadgeClass(order.status)"
                >
                  {{ order.status }}
                </span>
              </td>

              <td class="py-3.5 text-end">
                <span class="text-sm font-semibold tabular-nums">
                  {{ formatAmount(order.amount) }}
                </span>
              </td>

              <td class="relative py-3.5 ps-2 text-end" data-order-menu>
                <button
                  type="button"
                  :aria-label="`Actions for ${order.id}`"
                  class="cursor-pointer rounded-md p-1 text-muted-foreground opacity-0 transition-all hover:bg-accent hover:text-foreground focus:opacity-100 group-hover:opacity-100"
                  :class="{ 'opacity-100 bg-accent text-foreground': openMenuId === order.id }"
                  @click.stop="toggleMenu(order.id)"
                >
                  <Ellipsis class="h-4 w-4" aria-hidden="true" />
                </button>

                <div
                  v-if="openMenuId === order.id"
                  class="absolute end-0 top-11 z-30 w-44 rounded-lg border border-border bg-popover p-1 text-start text-popover-foreground shadow-lg animate-scale-in"
                >
                  <button
                    type="button"
                    class="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs hover:bg-accent"
                    @click="viewOrder(order)"
                  >
                    <Eye class="h-3.5 w-3.5 text-muted-foreground" />
                    View details
                  </button>
                  <button
                    v-if="order.status !== 'completed'"
                    type="button"
                    class="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs hover:bg-accent"
                    @click="markCompleted(order.id)"
                  >
                    <CheckCircle2 class="h-3.5 w-3.5 text-success" />
                    Mark completed
                  </button>
                  <button
                    type="button"
                    class="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs hover:bg-accent"
                    @click="copyOrderId(order.id)"
                  >
                    <Copy class="h-3.5 w-3.5 text-muted-foreground" />
                    Copy order ID
                  </button>
                  <div class="my-1 h-px bg-border" />
                  <button
                    type="button"
                    class="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                    @click="removeOrder(order.id)"
                  >
                    <Trash2 class="h-3.5 w-3.5" />
                    Delete order
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Order Details Modal -->
    <Teleport to="body">
      <div
        v-if="selectedOrder"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] animate-fade-in"
        @click.self="selectedOrder = null"
      >
        <div
          role="dialog"
          aria-modal="true"
          class="w-full max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xl animate-scale-in"
        >
          <div class="flex items-start justify-between">
            <div>
              <p class="font-mono text-xs text-muted-foreground">{{ selectedOrder.id }}</p>
              <h3 class="mt-0.5 text-base font-semibold">Order Details</h3>
            </div>
            <button
              type="button"
              aria-label="Close modal"
              class="cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              @click="selectedOrder = null"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <div class="mt-5 space-y-3 text-sm">
            <div class="flex items-center justify-between border-b border-border/60 pb-2.5">
              <span class="text-muted-foreground">Customer</span>
              <span class="font-medium">{{ selectedOrder.customer }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-border/60 pb-2.5">
              <span class="text-muted-foreground">Email</span>
              <span class="text-xs text-muted-foreground">{{ selectedOrder.email }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-border/60 pb-2.5">
              <span class="text-muted-foreground">Product</span>
              <span class="font-medium">{{ selectedOrder.product }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-border/60 pb-2.5">
              <span class="text-muted-foreground">Date</span>
              <span>{{ selectedOrder.date }}</span>
            </div>
            <div class="flex items-center justify-between border-b border-border/60 pb-2.5">
              <span class="text-muted-foreground">Status</span>
              <span
                class="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium capitalize"
                :class="statusBadgeClass(selectedOrder.status)"
              >
                {{ selectedOrder.status }}
              </span>
            </div>
            <div class="flex items-center justify-between pt-1">
              <span class="text-muted-foreground">Total Amount</span>
              <span class="text-base font-bold tabular-nums">
                {{ formatAmount(selectedOrder.amount) }}
              </span>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-2">
            <button
              type="button"
              class="cursor-pointer rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent"
              @click="selectedOrder = null"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
