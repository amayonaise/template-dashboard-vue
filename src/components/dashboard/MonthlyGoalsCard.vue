<script setup lang="ts">
import { monthlyGoals } from '@/data/dashboard'
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <div
    data-slot="card"
    class="rounded-xl border border-border bg-card text-card-foreground shadow-sm"
  >
    <div class="flex flex-col space-y-1.5 p-6 pb-2">
      <h2 class="text-base font-semibold tracking-tight">
        {{ t('dashboard.monthlyGoals') }}
      </h2>
      <p class="text-xs text-muted-foreground">
        {{ t('dashboard.monthlyGoalsSub') }}
      </p>
    </div>

    <div class="space-y-5 p-6 pt-3">
      <div v-for="goal in monthlyGoals" :key="goal.id" class="space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-medium text-foreground">{{ goal.title }}</span>
          <span class="text-muted-foreground tabular-nums">{{ goal.percentage }}%</span>
        </div>

        <div class="relative h-2 w-full overflow-hidden rounded-full bg-primary/15">
          <div
            class="h-full rounded-full transition-all duration-500 ease-out"
            :class="goal.barClass"
            :style="{ width: `${goal.percentage}%` }"
          />
        </div>

        <div class="flex items-center justify-between text-[11px] text-muted-foreground tabular-nums">
          <span>{{ goal.current }}</span>
          <span>{{ goal.target }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
