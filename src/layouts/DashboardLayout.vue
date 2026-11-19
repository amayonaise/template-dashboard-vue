<script setup lang="ts">
import { computed } from 'vue'
import { useThemeConfig } from '@/composables/useThemeConfig'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopNav from '@/components/layout/AppTopNav.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import CommandPalette from '@/components/layout/CommandPalette.vue'
import ThemeCustomizer from '@/components/layout/ThemeCustomizer.vue'
import NewOrderModal from '@/components/layout/NewOrderModal.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'

const { config } = useThemeConfig()

const contentOffsetClass = computed(() => {
  if (config.layout === 'topnav') return ''
  return config.sidebarCollapsed ? 'lg:ps-[68px]' : 'lg:ps-[260px]'
})
</script>

<template>
  <div
    class="min-h-screen bg-background text-foreground transition-colors duration-200"
    :class="
      config.container === 'boxed'
        ? 'mx-auto max-w-[1440px] border-x border-border shadow-xl'
        : ''
    "
  >
    <!-- Desktop + Mobile Sidebar -->
    <AppSidebar v-if="config.layout === 'sidebar'" />

    <!-- Main Shell -->
    <div
      class="flex min-h-screen min-w-0 flex-col transition-all duration-300 ease-in-out"
      :class="contentOffsetClass"
    >
      <AppHeader />
      <AppTopNav v-if="config.layout === 'topnav'" />

      <main class="min-w-0 flex-1 p-4 sm:p-6">
        <slot />
      </main>
    </div>

    <!-- Overlays -->
    <CommandPalette />
    <ThemeCustomizer />
    <NewOrderModal />
    <ToastContainer />
  </div>
</template>
