<script setup lang="ts">
import { X, CheckCircle2 } from 'lucide-vue-next'
import { useDashboardStore } from '@/composables/useDashboardStore'

const { toasts, dismissToast } = useDashboardStore()
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed bottom-4 end-4 z-[60] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-2.5 rounded-xl border border-border bg-popover p-3.5 text-popover-foreground shadow-lg animate-slide-in-up"
      >
        <CheckCircle2 class="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <div class="min-w-0 flex-1">
          <p class="text-xs font-semibold">{{ toast.title }}</p>
          <p v-if="toast.description" class="mt-0.5 text-xs text-muted-foreground">
            {{ toast.description }}
          </p>
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          class="cursor-pointer rounded p-0.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          @click="dismissToast(toast.id)"
        >
          <X class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  </Teleport>
</template>
