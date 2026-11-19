<script setup lang="ts">
import { computed } from 'vue'
import {
  DollarSign,
  Users,
  ShoppingCart,
  Eye,
  TrendingUp,
  TrendingDown,
} from 'lucide-vue-next'
import type { KpiMetric } from '@/data/dashboard'

const props = defineProps<{
  metric: KpiMetric
  index?: number
}>()

const iconMap = {
  dollar: DollarSign,
  users: Users,
  cart: ShoppingCart,
  eye: Eye,
}

const iconComponent = computed(() => iconMap[props.metric.iconName])

const linePath = computed(() => {
  const pts = props.metric.sparkline
  const step = 100 / (pts.length - 1)
  return pts
    .map((y, idx) => `${idx === 0 ? 'M' : 'L'}${(idx * step).toFixed(1)},${y.toFixed(1)}`)
    .join(' ')
})

const areaPath = computed(() => `${linePath.value} L100,40 L0,40 Z`)

const gradientId = computed(() => `spark-${props.metric.id}`)

const animationDelay = computed(() => `${(props.index ?? 0) * 60}ms`)
</script>

<template>
  <div
    data-slot="card"
    class="group relative overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md animate-slide-in-up"
    :style="{ animationDelay }"
  >
    <div class="p-5 pb-0">
      <div class="flex items-start justify-between gap-3">
        <div class="space-y-2">
          <p class="text-xs font-medium text-muted-foreground">
            {{ metric.label }}
          </p>
          <p class="text-2xl font-bold tracking-tight tabular-nums">
            {{ metric.value }}
          </p>
          <div class="flex items-center gap-1.5">
            <TrendingUp
              v-if="metric.positive"
              class="h-3.5 w-3.5 text-success shrink-0"
              aria-hidden="true"
            />
            <TrendingDown
              v-else
              class="h-3.5 w-3.5 text-destructive shrink-0"
              aria-hidden="true"
            />
            <span
              class="text-xs font-semibold"
              :class="metric.positive ? 'text-success' : 'text-destructive'"
            >
              {{ metric.change }}
            </span>
            <span class="text-xs text-muted-foreground">
              {{ metric.period }}
            </span>
          </div>
        </div>

        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          :class="metric.iconBgClass"
        >
          <component
            :is="iconComponent"
            class="h-5 w-5"
            :class="metric.iconColorClass"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>

    <div class="mt-2 h-12 w-full">
      <svg
        class="h-full w-full"
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" :stop-color="metric.chartColorVar" stop-opacity="0.22" />
            <stop offset="100%" :stop-color="metric.chartColorVar" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path :d="areaPath" :fill="`url(#${gradientId})`" />
        <path
          :d="linePath"
          fill="none"
          :stroke="metric.chartColorVar"
          stroke-width="1.5"
          vector-effect="non-scaling-stroke"
        />
      </svg>
    </div>
  </div>
</template>
