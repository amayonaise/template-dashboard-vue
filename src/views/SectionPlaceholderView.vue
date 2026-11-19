<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { ArrowLeft, LayoutDashboard } from 'lucide-vue-next'
import { allNavItems } from '@/data/navigation'
import { useI18n } from '@/composables/useI18n'

const route = useRoute()
const { t } = useI18n()

const currentItem = computed(() => allNavItems.find((i) => i.to === route.path))

const pageTitle = computed(() => {
  if (currentItem.value) return t(currentItem.value.labelKey)
  if (route.path === '/profile') return 'Profile'
  return (route.meta.title as string) || 'Page'
})
</script>

<template>
  <div class="animate-slide-in-up">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">{{ pageTitle }}</h1>
        <p class="mt-1 text-sm text-muted-foreground">
          Core Dashboard clone — this secondary route is wired in the Apex layout shell.
        </p>
      </div>

      <RouterLink
        to="/"
        class="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <ArrowLeft class="h-3.5 w-3.5" />
        <span>Back to Dashboard</span>
      </RouterLink>
    </div>

    <div
      class="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center shadow-sm"
    >
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <component :is="currentItem?.icon || LayoutDashboard" class="h-6 w-6" />
      </div>
      <h2 class="mt-4 text-base font-semibold">{{ pageTitle }} View</h2>
      <p class="mt-1 max-w-md text-sm text-muted-foreground">
        Navigation, dark mode, theme customizer, RTL/LTR direction, and ⌘K command palette are fully active on every route.
      </p>
      <RouterLink
        to="/"
        class="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
      >
        Return to Core Dashboard
      </RouterLink>
    </div>
  </div>
</template>
