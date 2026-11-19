<script setup lang="ts">
import { reactive, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useDashboardStore } from '@/composables/useDashboardStore'
import type { OrderStatus } from '@/data/dashboard'

const { isNewOrderModalOpen, addOrder } = useDashboardStore()

const products = [
  { name: 'Pro Dashboard License', price: 299 },
  { name: 'Team Plan Upgrade', price: 599 },
  { name: 'Enterprise License', price: 1499 },
  { name: 'Single License', price: 79 },
]

const form = reactive({
  customer: '',
  email: '',
  product: products[0].name,
  amount: products[0].price,
  status: 'processing' as OrderStatus,
})

watch(
  () => form.product,
  (selected) => {
    const match = products.find((p) => p.name === selected)
    if (match) form.amount = match.price
  },
)

function submit() {
  if (!form.customer.trim() || !form.email.trim()) return
  addOrder({
    customer: form.customer,
    email: form.email,
    product: form.product,
    amount: Number(form.amount) || 0,
    status: form.status,
  })
  form.customer = ''
  form.email = ''
  form.product = products[0].name
  form.amount = products[0].price
  form.status = 'processing'
  isNewOrderModalOpen.value = false
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isNewOrderModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] animate-fade-in"
      @click.self="isNewOrderModalOpen = false"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create new order"
        class="w-full max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground shadow-xl animate-scale-in"
      >
        <div class="flex items-start justify-between">
          <div>
            <h2 class="text-base font-semibold">New Order</h2>
            <p class="mt-0.5 text-xs text-muted-foreground">
              Add a new transaction directly to Recent Orders.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            class="cursor-pointer rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
            @click="isNewOrderModalOpen = false"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <form class="mt-5 space-y-4" @submit.prevent="submit">
          <div class="space-y-1.5">
            <label for="order-customer" class="text-xs font-medium">Customer Name</label>
            <input
              id="order-customer"
              v-model="form.customer"
              type="text"
              required
              placeholder="e.g. Liam Novak"
              class="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <div class="space-y-1.5">
            <label for="order-email" class="text-xs font-medium">Customer Email</label>
            <input
              id="order-email"
              v-model="form.email"
              type="email"
              required
              placeholder="liam@company.io"
              class="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label for="order-product" class="text-xs font-medium">Product</label>
              <select
                id="order-product"
                v-model="form.product"
                class="flex h-9 w-full cursor-pointer rounded-lg border border-input bg-background px-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option v-for="p in products" :key="p.name" :value="p.name">
                  {{ p.name }}
                </option>
              </select>
            </div>

            <div class="space-y-1.5">
              <label for="order-status" class="text-xs font-medium">Status</label>
              <select
                id="order-status"
                v-model="form.status"
                class="flex h-9 w-full cursor-pointer rounded-lg border border-input bg-background px-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div class="space-y-1.5">
            <label for="order-amount" class="text-xs font-medium">Amount (USD)</label>
            <input
              id="order-amount"
              v-model.number="form.amount"
              type="number"
              min="1"
              step="0.01"
              required
              class="flex h-9 w-full rounded-lg border border-input bg-background px-3 text-sm tabular-nums text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button
              type="button"
              class="cursor-pointer rounded-md border border-border px-3.5 py-2 text-xs font-medium hover:bg-accent"
              @click="isNewOrderModalOpen = false"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="cursor-pointer rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
