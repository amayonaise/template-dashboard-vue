<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import {
  X,
  Sun,
  Moon,
  Monitor,
  PanelLeft,
  PanelTop,
  Maximize2,
  Minimize2,
  AlignLeft,
  AlignRight,
  AlignJustify,
  RotateCcw,
} from 'lucide-vue-next'
import {
  useThemeConfig,
  ACCENT_PRESETS,
  type ThemeMode,
  type DensityMode,
  type LayoutMode,
  type ContainerMode,
  type DirectionMode,
  type LocaleCode,
} from '@/composables/useThemeConfig'
import { useDashboardStore } from '@/composables/useDashboardStore'
import { useI18n } from '@/composables/useI18n'

const { config, resetToDefaults } = useThemeConfig()
const { isCustomizerOpen, pushToast } = useDashboardStore()
const { t } = useI18n()

const themeOptions: { id: ThemeMode; labelKey: string; icon: unknown }[] = [
  { id: 'light', labelKey: 'customizer.light', icon: Sun },
  { id: 'dark', labelKey: 'customizer.dark', icon: Moon },
  { id: 'system', labelKey: 'customizer.system', icon: Monitor },
]

const densityOptions: { id: DensityMode; labelKey: string }[] = [
  { id: 'compact', labelKey: 'customizer.compact' },
  { id: 'comfortable', labelKey: 'customizer.comfortable' },
  { id: 'spacious', labelKey: 'customizer.spacious' },
]

const layoutOptions: { id: LayoutMode; labelKey: string; icon: unknown }[] = [
  { id: 'sidebar', labelKey: 'customizer.sidebar', icon: PanelLeft },
  { id: 'topnav', labelKey: 'customizer.topnav', icon: PanelTop },
]

const containerOptions: { id: ContainerMode; labelKey: string; icon: unknown }[] = [
  { id: 'fluid', labelKey: 'customizer.fluid', icon: Maximize2 },
  { id: 'boxed', labelKey: 'customizer.boxed', icon: Minimize2 },
]

const directionOptions: { id: DirectionMode; label: string; icon: unknown }[] = [
  { id: 'ltr', label: 'LTR', icon: AlignLeft },
  { id: 'rtl', label: 'RTL', icon: AlignRight },
]

const localeOptions: { id: LocaleCode; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'de', label: 'Deutsch' },
  { id: 'fr', label: 'Français' },
]

function handleReset() {
  resetToDefaults()
  pushToast('Theme reset', 'Dashboard appearance restored to defaults.')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isCustomizerOpen.value) {
    isCustomizerOpen.value = false
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div v-if="isCustomizerOpen" class="fixed inset-0 z-50 flex justify-end">
      <div
        class="fixed inset-0 bg-black/50 backdrop-blur-[1px] animate-fade-in"
        @click="isCustomizerOpen = false"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Customize dashboard theme"
        class="relative z-10 flex h-full w-full max-w-[380px] flex-col border-s border-border bg-card text-card-foreground shadow-2xl"
      >
        <!-- Sheet Header -->
        <div class="flex items-start justify-between p-5 pb-4">
          <div>
            <h2 class="text-base font-semibold text-foreground">
              {{ t('customizer.title') }}
            </h2>
            <p class="mt-0.5 text-xs text-muted-foreground">
              {{ t('customizer.subtitle') }}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close customizer"
            class="cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="isCustomizerOpen = false"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <!-- Scrollable Controls -->
        <div class="flex-1 space-y-6 overflow-y-auto px-5 pb-6">
          <!-- Theme -->
          <div class="space-y-3">
            <label class="block text-sm font-medium leading-none">
              {{ t('customizer.theme') }}
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="opt in themeOptions"
                :key="opt.id"
                type="button"
                class="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all"
                :class="
                  config.theme === opt.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                "
                @click="config.theme = opt.id"
              >
                <component :is="opt.icon" class="h-5 w-5" />
                <span class="text-xs font-medium">{{ t(opt.labelKey) }}</span>
              </button>
            </div>
          </div>

          <div class="h-px bg-border" />

          <!-- Color -->
          <div class="space-y-3">
            <label class="block text-sm font-medium leading-none">
              {{ t('customizer.color') }}
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="preset in ACCENT_PRESETS"
                :key="preset.id"
                type="button"
                class="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all"
                :class="
                  config.accent === preset.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                "
                @click="config.accent = preset.id"
              >
                <span
                  class="inline-block h-5 w-5 rounded-full transition-shadow"
                  :class="
                    config.accent === preset.id
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-card'
                      : ''
                  "
                  :style="{ backgroundColor: preset.swatch }"
                />
                <span class="text-xs font-medium">{{ preset.label }}</span>
              </button>
            </div>
          </div>

          <div class="h-px bg-border" />

          <!-- Density -->
          <div class="space-y-3">
            <label class="block text-sm font-medium leading-none">
              {{ t('customizer.density') }}
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="opt in densityOptions"
                :key="opt.id"
                type="button"
                class="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all"
                :class="
                  config.density === opt.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                "
                @click="config.density = opt.id"
              >
                <AlignJustify class="h-4 w-4" />
                <span class="text-xs font-medium">{{ t(opt.labelKey) }}</span>
              </button>
            </div>
          </div>

          <div class="h-px bg-border" />

          <!-- Layout -->
          <div class="space-y-3">
            <label class="block text-sm font-medium leading-none">
              {{ t('customizer.layout') }}
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="opt in layoutOptions"
                :key="opt.id"
                type="button"
                class="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all"
                :class="
                  config.layout === opt.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                "
                @click="config.layout = opt.id"
              >
                <component :is="opt.icon" class="h-4 w-4" />
                <span class="text-xs font-medium">{{ t(opt.labelKey) }}</span>
              </button>
            </div>
          </div>

          <div class="h-px bg-border" />

          <!-- Container -->
          <div class="space-y-3">
            <label class="block text-sm font-medium leading-none">
              {{ t('customizer.container') }}
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="opt in containerOptions"
                :key="opt.id"
                type="button"
                class="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all"
                :class="
                  config.container === opt.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                "
                @click="config.container = opt.id"
              >
                <component :is="opt.icon" class="h-4 w-4" />
                <span class="text-xs font-medium">{{ t(opt.labelKey) }}</span>
              </button>
            </div>
          </div>

          <div class="h-px bg-border" />

          <!-- Direction -->
          <div class="space-y-3">
            <label class="block text-sm font-medium leading-none">
              {{ t('customizer.direction') }}
            </label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="opt in directionOptions"
                :key="opt.id"
                type="button"
                class="flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all"
                :class="
                  config.direction === opt.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                "
                @click="config.direction = opt.id"
              >
                <component :is="opt.icon" class="h-4 w-4" />
                <span class="text-xs font-medium">{{ opt.label }}</span>
              </button>
            </div>
          </div>

          <div class="h-px bg-border" />

          <!-- Language -->
          <div class="space-y-3">
            <label class="block text-sm font-medium leading-none">
              {{ t('customizer.language') }}
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="opt in localeOptions"
                :key="opt.id"
                type="button"
                class="flex cursor-pointer items-center justify-center rounded-lg border-2 px-2 py-2.5 text-xs font-medium transition-all"
                :class="
                  config.locale === opt.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/30'
                "
                @click="config.locale = opt.id"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-border p-4">
          <button
            type="button"
            class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            @click="handleReset"
          >
            <RotateCcw class="h-3.5 w-3.5" />
            <span>{{ t('customizer.reset') }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
