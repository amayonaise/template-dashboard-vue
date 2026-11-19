<script setup lang="ts">
import { RouterView } from 'vue-router'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useThemeConfig } from '@/composables/useThemeConfig'

// Initialize persisted theme, accent, density, container, direction & locale
useThemeConfig()
</script>

<template>
  <DashboardLayout>
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </DashboardLayout>
</template>
