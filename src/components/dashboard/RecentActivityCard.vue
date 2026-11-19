<script setup lang="ts">
import { RouterLink } from 'vue-router'
import {
  ArrowUpRight,
  ShoppingCart,
  UserPlus,
  Star,
  CreditCard,
  MessageSquare,
} from 'lucide-vue-next'
import { useDashboardStore } from '@/composables/useDashboardStore'
import { useI18n } from '@/composables/useI18n'

const { activities } = useDashboardStore()
const { t } = useI18n()

const iconMap = {
  cart: ShoppingCart,
  'user-plus': UserPlus,
  star: Star,
  'credit-card': CreditCard,
  'message-square': MessageSquare,
}
</script>

<template>
  <div
    data-slot="card"
    class="min-w-0 rounded-xl border border-border bg-card text-card-foreground shadow-sm"
  >
    <div class="flex flex-row items-center justify-between p-6 pb-4">
      <div>
        <h2 class="text-base font-semibold tracking-tight">
          {{ t('dashboard.recentActivity') }}
        </h2>
        <p class="mt-0.5 text-xs text-muted-foreground">
          {{ t('dashboard.recentActivitySub') }}
        </p>
      </div>

      <RouterLink
        to="/notifications"
        class="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
      >
        {{ t('dashboard.viewAll') }}
        <ArrowUpRight class="h-3.5 w-3.5" aria-hidden="true" />
      </RouterLink>
    </div>

    <div class="p-6 pt-0">
      <div class="space-y-0">
        <div
          v-for="item in activities.slice(0, 6)"
          :key="item.id"
          class="group flex gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted/30"
        >
          <div
            class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
            :class="item.iconBgClass"
          >
            <component
              :is="iconMap[item.iconName]"
              class="h-4 w-4"
              :class="item.iconColorClass"
              aria-hidden="true"
            />
          </div>

          <div class="min-w-0 flex-1 space-y-0.5">
            <p class="text-sm font-medium leading-snug">
              {{ item.title }}
            </p>
            <p class="text-xs leading-snug text-muted-foreground">
              {{ item.description }}
            </p>
            <p class="text-[11px] text-muted-foreground/60">
              {{ item.time }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
