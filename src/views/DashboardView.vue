<script setup lang="ts">
import { kpiMetrics } from '@/data/dashboard'
import { useI18n } from '@/composables/useI18n'
import KpiCard from '@/components/dashboard/KpiCard.vue'
import OverviewChart from '@/components/dashboard/OverviewChart.vue'
import TrafficSourcesCard from '@/components/dashboard/TrafficSourcesCard.vue'
import MonthlyGoalsCard from '@/components/dashboard/MonthlyGoalsCard.vue'
import RecentOrdersCard from '@/components/dashboard/RecentOrdersCard.vue'
import RecentActivityCard from '@/components/dashboard/RecentActivityCard.vue'

const { t } = useI18n()
</script>

<template>
  <div>
    <!-- Page Heading -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight">
        {{ t('dashboard.title') }}
      </h1>
      <p class="mt-1 text-sm text-muted-foreground">
        {{ t('dashboard.subtitle') }}
      </p>
    </div>

    <!-- Row 1: 4 KPI Cards -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
      :style="{ gap: 'var(--density-gap)' }"
    >
      <KpiCard
        v-for="(metric, idx) in kpiMetrics"
        :key="metric.id"
        :metric="metric"
        :index="idx"
      />
    </div>

    <!-- Row 2: Overview Chart (8 cols) + Traffic Sources & Monthly Goals (4 cols) -->
    <div
      class="grid grid-cols-1 xl:grid-cols-12"
      :style="{ marginTop: 'var(--density-section)', gap: 'var(--density-gap)' }"
    >
      <OverviewChart class="xl:col-span-8" />

      <div
        class="flex flex-col xl:col-span-4"
        :style="{ gap: 'var(--density-gap)' }"
      >
        <TrafficSourcesCard />
        <MonthlyGoalsCard class="flex-1" />
      </div>
    </div>

    <!-- Row 3: Recent Orders (8 cols) + Recent Activity (4 cols) -->
    <div
      class="grid grid-cols-1 xl:grid-cols-12"
      :style="{ marginTop: 'var(--density-section)', gap: 'var(--density-gap)' }"
    >
      <RecentOrdersCard class="xl:col-span-8" />
      <RecentActivityCard class="xl:col-span-4" />
    </div>
  </div>
</template>
