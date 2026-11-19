<script setup lang="ts">
import { ref, computed } from 'vue'
import { trafficSources, type TrafficSource } from '@/data/dashboard'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
const activeSourceId = ref<string | null>(null)

const R_OUTER = 71
const R_INNER = 48
const PAD_DEG = 2.4

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

function describeDonutArc(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startDeg: number,
  endDeg: number,
): string {
  const startOuter = polarToCartesian(cx, cy, rOuter, startDeg)
  const endOuter = polarToCartesian(cx, cy, rOuter, endDeg)
  const endInner = polarToCartesian(cx, cy, rInner, endDeg)
  const startInner = polarToCartesian(cx, cy, rInner, startDeg)
  const largeArc = endDeg - startDeg > 180 ? 1 : 0

  return [
    `M ${startOuter.x.toFixed(2)} ${startOuter.y.toFixed(2)}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${endOuter.x.toFixed(2)} ${endOuter.y.toFixed(2)}`,
    `L ${endInner.x.toFixed(2)} ${endInner.y.toFixed(2)}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${startInner.x.toFixed(2)} ${startInner.y.toFixed(2)}`,
    'Z',
  ].join(' ')
}

const segments = computed(() => {
  let cursor = 0
  return trafficSources.map((src) => {
    const sweep = (src.percentage / 100) * 360
    const start = cursor + PAD_DEG / 2
    const end = cursor + sweep - PAD_DEG / 2
    cursor += sweep
    return {
      ...src,
      path: describeDonutArc(72, 72, R_OUTER, R_INNER, start, end),
    }
  })
})

const activeSource = computed<TrafficSource | null>(() => {
  if (!activeSourceId.value) return null
  return trafficSources.find((s) => s.id === activeSourceId.value) ?? null
})
</script>

<template>
  <div
    data-slot="card"
    class="min-w-0 rounded-xl border border-border bg-card text-card-foreground shadow-sm"
  >
    <div class="flex flex-col space-y-1.5 p-6 pb-2">
      <h2 class="text-base font-semibold tracking-tight">
        {{ t('dashboard.trafficSources') }}
      </h2>
      <p class="text-xs text-muted-foreground">
        {{ t('dashboard.trafficSourcesSub') }}
      </p>
    </div>

    <div class="p-6 pt-2">
      <div class="flex items-center gap-5">
        <div class="relative h-36 w-36 shrink-0">
          <svg
            viewBox="0 0 144 144"
            width="144"
            height="144"
            class="block h-36 w-36"
            role="img"
            aria-label="Traffic sources breakdown donut chart"
          >
            <path
              v-for="seg in segments"
              :key="seg.id"
              :d="seg.path"
              :fill="seg.colorVar"
              stroke="var(--card)"
              stroke-width="1.2"
              stroke-linejoin="round"
              class="cursor-pointer transition-all duration-200"
              :style="{
                opacity: activeSourceId === null || activeSourceId === seg.id ? 1 : 0.35,
                transformOrigin: '72px 72px',
                transform: activeSourceId === seg.id ? 'scale(1.03)' : 'scale(1)',
              }"
              @mouseenter="activeSourceId = seg.id"
              @mouseleave="activeSourceId = null"
            />
          </svg>

          <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span class="text-lg font-bold tracking-tight tabular-nums">
              {{ activeSource ? `${activeSource.percentage}%` : '284K' }}
            </span>
            <span class="text-[10px] text-muted-foreground">
              {{ activeSource ? activeSource.name : t('dashboard.visits') }}
            </span>
          </div>
        </div>

        <div class="flex-1 space-y-3">
          <div
            v-for="src in trafficSources"
            :key="src.id"
            class="flex cursor-pointer items-center justify-between rounded-md px-1.5 py-0.5 transition-colors hover:bg-muted/50"
            @mouseenter="activeSourceId = src.id"
            @mouseleave="activeSourceId = null"
          >
            <div class="flex items-center gap-2">
              <span
                class="h-2.5 w-2.5 shrink-0 rounded-full"
                :style="{ backgroundColor: src.colorVar }"
              />
              <span class="text-xs text-muted-foreground">
                {{ src.name }}
              </span>
            </div>
            <span class="text-xs font-semibold tabular-nums">
              {{ src.percentage }}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
