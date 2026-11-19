<script setup lang="ts">
import { ref, computed } from 'vue'
import { monthlyPerformance } from '@/data/dashboard'
import { useI18n } from '@/composables/useI18n'

type ChartTab = 'revenue' | 'orders' | 'profit'

const { t } = useI18n()
const activeTab = ref<ChartTab>('revenue')
const hoveredIndex = ref<number | null>(null)

const VB_W = 680
const VB_H = 320
const PAD = { top: 20, right: 16, bottom: 34, left: 48 }
const PLOT_W = VB_W - PAD.left - PAD.right
const PLOT_H = VB_H - PAD.top - PAD.bottom

const tabs = computed(() => [
  { id: 'revenue' as ChartTab, label: t('dashboard.revenue') },
  { id: 'orders' as ChartTab, label: t('dashboard.orders') },
  { id: 'profit' as ChartTab, label: t('dashboard.profit') },
])

interface SeriesConfig {
  type: 'area' | 'bar'
  colorVar: string
  maxY: number
  gridStep: number
  labelStep: number
  values: number[]
  formatTick: (v: number) => string
  formatTooltip: (v: number) => string
  seriesLabel: string
}

const seriesConfig = computed<SeriesConfig>(() => {
  if (activeTab.value === 'orders') {
    return {
      type: 'bar',
      colorVar: 'var(--chart-3)',
      maxY: 620,
      gridStep: 50,
      labelStep: 100,
      values: monthlyPerformance.map((p) => p.orders),
      formatTick: (v) => `${v}`,
      formatTooltip: (v) => `${v.toLocaleString()} orders`,
      seriesLabel: t('dashboard.orders'),
    }
  }
  if (activeTab.value === 'profit') {
    return {
      type: 'area',
      colorVar: 'var(--chart-2)',
      maxY: 22500,
      gridStep: 2500,
      labelStep: 5000,
      values: monthlyPerformance.map((p) => p.profit),
      formatTick: (v) => `$${Math.round(v / 1000)}k`,
      formatTooltip: (v) => `$${v.toLocaleString()}`,
      seriesLabel: t('dashboard.profit'),
    }
  }
  return {
    type: 'area',
    colorVar: 'var(--chart-1)',
    maxY: 48500,
    gridStep: 5000,
    labelStep: 10000,
    values: monthlyPerformance.map((p) => p.revenue),
    formatTick: (v) => `$${Math.round(v / 1000)}k`,
    formatTooltip: (v) => `$${v.toLocaleString()}`,
    seriesLabel: t('dashboard.revenue'),
  }
})

function yForValue(v: number, maxY: number): number {
  const ratio = Math.min(Math.max(v / maxY, 0), 1)
  return PAD.top + PLOT_H * (1 - ratio)
}

const gridLines = computed(() => {
  const cfg = seriesConfig.value
  const lines: { value: number; y: number; label: string | null }[] = []
  for (let v = 0; v <= cfg.maxY; v += cfg.gridStep) {
    const showLabel = v % cfg.labelStep === 0 && v <= cfg.maxY - cfg.gridStep * 0.2
    lines.push({
      value: v,
      y: yForValue(v, cfg.maxY),
      label: showLabel ? cfg.formatTick(v) : null,
    })
  }
  return lines
})

const areaPoints = computed(() => {
  const cfg = seriesConfig.value
  const count = cfg.values.length
  const stepX = PLOT_W / (count - 1)
  return cfg.values.map((v, i) => ({
    x: PAD.left + i * stepX,
    y: yForValue(v, cfg.maxY),
    value: v,
    month: monthlyPerformance[i].month,
  }))
})

// Monotone cubic Hermite spline (matches D3 / Unovis curveMonotoneX)
function buildMonotonePath(pts: { x: number; y: number }[]): string {
  const n = pts.length
  if (n < 2) return ''
  const d: number[] = []
  const m: number[] = new Array(n).fill(0)

  for (let i = 0; i < n - 1; i++) {
    const dx = pts[i + 1].x - pts[i].x
    d.push(dx === 0 ? 0 : (pts[i + 1].y - pts[i].y) / dx)
  }

  m[0] = d[0]
  m[n - 1] = d[n - 2]
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) {
      m[i] = 0
    } else {
      m[i] = (d[i - 1] + d[i]) / 2
    }
  }

  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0
      m[i + 1] = 0
    } else {
      const a = m[i] / d[i]
      const b = m[i + 1] / d[i]
      const h = Math.hypot(a, b)
      if (h > 3) {
        const tScale = 3 / h
        m[i] = tScale * a * d[i]
        m[i + 1] = tScale * b * d[i]
      }
    }
  }

  let path = `M${pts[0].x.toFixed(2)},${pts[0].y.toFixed(2)}`
  for (let i = 0; i < n - 1; i++) {
    const dx = (pts[i + 1].x - pts[i].x) / 3
    const cp1x = pts[i].x + dx
    const cp1y = pts[i].y + m[i] * dx
    const cp2x = pts[i + 1].x - dx
    const cp2y = pts[i + 1].y - m[i + 1] * dx
    path += ` C${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${pts[i + 1].x.toFixed(2)},${pts[i + 1].y.toFixed(2)}`
  }
  return path
}

const linePath = computed(() => buildMonotonePath(areaPoints.value))

const areaFillPath = computed(() => {
  const pts = areaPoints.value
  if (pts.length < 2) return ''
  const baselineY = PAD.top + PLOT_H
  return `${linePath.value} L${pts[pts.length - 1].x.toFixed(2)},${baselineY} L${pts[0].x.toFixed(2)},${baselineY} Z`
})

const barItems = computed(() => {
  const cfg = seriesConfig.value
  const count = cfg.values.length
  const slotW = PLOT_W / count
  const barW = Math.min(34, slotW * 0.6)
  const baselineY = PAD.top + PLOT_H

  return cfg.values.map((v, i) => {
    const cx = PAD.left + slotW * i + slotW / 2
    const topY = yForValue(v, cfg.maxY)
    const height = Math.max(0, baselineY - topY)
    return {
      x: cx - barW / 2,
      cx,
      y: topY,
      width: barW,
      height,
      value: v,
      month: monthlyPerformance[i].month,
    }
  })
})

function roundedTopBarPath(x: number, y: number, w: number, h: number, r = 4): string {
  const radius = Math.min(r, w / 2, h)
  const bottom = y + h
  return [
    `M${x},${bottom}`,
    `L${x},${y + radius}`,
    `Q${x},${y} ${x + radius},${y}`,
    `L${x + w - radius},${y}`,
    `Q${x + w},${y} ${x + w},${y + radius}`,
    `L${x + w},${bottom}`,
    'Z',
  ].join(' ')
}

const visibleXLabels = computed(() => {
  const indices = [0, 5, 10] // Jan, Jun, Nov — matches Apex default desktop rhythm
  const count = monthlyPerformance.length
  if (seriesConfig.value.type === 'bar') {
    const slotW = PLOT_W / count
    return indices.map((i) => ({
      index: i,
      label: monthlyPerformance[i].month,
      x: PAD.left + slotW * i + slotW / 2,
    }))
  }
  const stepX = PLOT_W / (count - 1)
  return indices.map((i) => ({
    index: i,
    label: monthlyPerformance[i].month,
    x: PAD.left + i * stepX,
  }))
})

const hoveredDatum = computed(() => {
  if (hoveredIndex.value === null) return null
  const idx = hoveredIndex.value
  const cfg = seriesConfig.value
  const x =
    cfg.type === 'bar'
      ? barItems.value[idx]?.cx ?? PAD.left
      : areaPoints.value[idx]?.x ?? PAD.left
  const y =
    cfg.type === 'bar'
      ? barItems.value[idx]?.y ?? PAD.top
      : areaPoints.value[idx]?.y ?? PAD.top
  return {
    index: idx,
    month: monthlyPerformance[idx].month,
    value: cfg.values[idx],
    formatted: cfg.formatTooltip(cfg.values[idx]),
    label: cfg.seriesLabel,
    colorVar: cfg.colorVar,
    x,
    y,
    leftPercent: (x / VB_W) * 100,
    topPercent: (y / VB_H) * 100,
  }
})

function onMouseMove(event: MouseEvent) {
  const svg = event.currentTarget as SVGSVGElement
  const rect = svg.getBoundingClientRect()
  const relX = ((event.clientX - rect.left) / rect.width) * VB_W
  const clamped = Math.min(Math.max(relX - PAD.left, 0), PLOT_W)
  const count = monthlyPerformance.length
  if (seriesConfig.value.type === 'bar') {
    const idx = Math.min(count - 1, Math.floor((clamped / PLOT_W) * count))
    hoveredIndex.value = idx
  } else {
    const idx = Math.round((clamped / PLOT_W) * (count - 1))
    hoveredIndex.value = Math.min(Math.max(idx, 0), count - 1)
  }
}

function onMouseLeave() {
  hoveredIndex.value = null
}
</script>

<template>
  <div
    data-slot="card"
    class="flex min-w-0 flex-col rounded-xl border border-border bg-card text-card-foreground shadow-sm"
  >
    <div class="flex flex-col gap-3 p-6 pb-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-base font-semibold tracking-tight">
          {{ t('dashboard.overview') }}
        </h2>
        <p class="mt-0.5 text-xs text-muted-foreground">
          {{ t('dashboard.overviewSub') }}
        </p>
      </div>

      <div
        role="tablist"
        aria-label="Performance metrics"
        class="inline-flex h-9 w-fit items-center rounded-lg bg-muted p-1 text-muted-foreground"
      >
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="activeTab === tab.id"
          class="cursor-pointer rounded-md px-3 py-1 text-xs font-medium transition-all"
          :class="
            activeTab === tab.id
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          "
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="relative flex-1 p-6 pt-4">
      <div class="relative h-[320px] w-full">
        <svg
          class="h-full w-full select-none overflow-visible"
          :viewBox="`0 0 ${VB_W} ${VB_H}`"
          preserveAspectRatio="none"
          role="img"
          :aria-label="`Monthly ${activeTab} performance chart`"
          @mousemove="onMouseMove"
          @mouseleave="onMouseLeave"
        >
          <defs>
            <linearGradient :id="`overview-area-grad-${activeTab}`" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" :stop-color="seriesConfig.colorVar" stop-opacity="0.22" />
              <stop offset="100%" :stop-color="seriesConfig.colorVar" stop-opacity="0.16" />
            </linearGradient>
          </defs>

          <!-- Horizontal gridlines -->
          <g>
            <line
              v-for="line in gridLines"
              :key="`grid-${line.value}`"
              :x1="PAD.left"
              :x2="VB_W - PAD.right"
              :y1="line.y"
              :y2="line.y"
              stroke="var(--border)"
              stroke-width="1"
              vector-effect="non-scaling-stroke"
              opacity="0.7"
            />
          </g>

          <!-- Area + spline curve for Revenue & Profit -->
          <template v-if="seriesConfig.type === 'area'">
            <path
              :d="areaFillPath"
              :fill="`url(#overview-area-grad-${activeTab})`"
              class="transition-all duration-300"
            />
            <path
              :d="linePath"
              fill="none"
              :stroke="seriesConfig.colorVar"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              vector-effect="non-scaling-stroke"
              class="transition-all duration-300"
            />
          </template>

          <!-- Bars for Orders -->
          <template v-else>
            <path
              v-for="(bar, idx) in barItems"
              :key="bar.month"
              :d="roundedTopBarPath(bar.x, bar.y, bar.width, bar.height, 4)"
              :fill="seriesConfig.colorVar"
              :opacity="hoveredIndex === null || hoveredIndex === idx ? 1 : 0.45"
              class="transition-opacity duration-150"
            />
          </template>

          <!-- Hover crosshair & point indicator -->
          <g v-if="hoveredDatum">
            <line
              :x1="hoveredDatum.x"
              :x2="hoveredDatum.x"
              :y1="PAD.top"
              :y2="PAD.top + PLOT_H"
              stroke="var(--muted-foreground)"
              stroke-width="1"
              stroke-dasharray="3 3"
              opacity="0.6"
              vector-effect="non-scaling-stroke"
            />
            <circle
              v-if="seriesConfig.type === 'area'"
              :cx="hoveredDatum.x"
              :cy="hoveredDatum.y"
              r="5"
              :fill="seriesConfig.colorVar"
              stroke="var(--background)"
              stroke-width="2.5"
            />
          </g>
        </svg>

        <!-- Crisp HTML axis labels (never distorted by SVG aspect scaling) -->
        <div class="pointer-events-none absolute inset-0">
          <template v-for="line in gridLines" :key="`ylbl-${line.value}`">
            <span
              v-if="line.label"
              class="absolute start-0 -translate-y-1/2 whitespace-nowrap text-end text-[11px] text-muted-foreground tabular-nums"
              :style="{
                top: `${(line.y / VB_H) * 100}%`,
                width: `max(34px, ${((PAD.left - 10) / VB_W) * 100}%)`,
              }"
            >
              {{ line.label }}
            </span>
          </template>

          <span
            v-for="xl in visibleXLabels"
            :key="`xlbl-${xl.label}`"
            class="absolute bottom-1 -translate-x-1/2 text-[11px] text-muted-foreground"
            :style="{ left: `${(xl.x / VB_W) * 100}%` }"
          >
            {{ xl.label }}
          </span>
        </div>

        <!-- Hover Tooltip -->
        <div
          v-if="hoveredDatum"
          class="pointer-events-none absolute z-20 rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md transition-all duration-75"
          :style="{
            left: hoveredDatum.leftPercent > 74
              ? `calc(${hoveredDatum.leftPercent}% - 12px)`
              : `calc(${hoveredDatum.leftPercent}% + 12px)`,
            top: `${Math.max(10, Math.min(72, hoveredDatum.topPercent - 8))}%`,
            transform: hoveredDatum.leftPercent > 74 ? 'translateX(-100%)' : 'none',
          }"
        >
          <p class="font-semibold text-foreground">{{ hoveredDatum.month }} 2026</p>
          <div class="mt-1 flex items-center gap-2">
            <span
              class="h-2 w-2 rounded-full"
              :style="{ backgroundColor: hoveredDatum.colorVar }"
            />
            <span class="text-muted-foreground">{{ hoveredDatum.label }}:</span>
            <span class="font-semibold tabular-nums">{{ hoveredDatum.formatted }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
