<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Search, X, Plus, Moon, Sun } from 'lucide-vue-next'
import { navigationGroups, documentationNavItem } from '@/data/navigation'
import { useDashboardStore } from '@/composables/useDashboardStore'
import { useThemeConfig } from '@/composables/useThemeConfig'
import { useI18n } from '@/composables/useI18n'

interface PaletteItem {
  id: string
  group: 'pages' | 'actions' | 'quick'
  label: string
  badge?: number
  hint?: string
  icon: unknown
  run: () => void
}

const router = useRouter()
const {
  isCommandPaletteOpen,
  isNewOrderModalOpen,
  ordersBadgeCount,
  unreadNotificationCount,
} = useDashboardStore()
const { isDark, toggleDarkMode } = useThemeConfig()
const { t } = useI18n()

const query = ref('')
const activeIndex = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

const allItems = computed<PaletteItem[]>(() => {
  const pages: PaletteItem[] = navigationGroups.flatMap((g) =>
    g.items.map((item) => ({
      id: item.id,
      group: 'pages' as const,
      label: t(item.labelKey),
      badge:
        item.badgeType === 'orders'
          ? ordersBadgeCount.value
          : item.badgeType === 'notifications'
            ? unreadNotificationCount.value || undefined
            : item.badge,
      icon: item.icon,
      run: () => {
        router.push(item.to)
        isCommandPaletteOpen.value = false
      },
    })),
  )

  const actions: PaletteItem[] = [
    {
      id: 'action-new-order',
      group: 'actions',
      label: t('header.newOrder'),
      icon: Plus,
      run: () => {
        isCommandPaletteOpen.value = false
        isNewOrderModalOpen.value = true
      },
    },
    {
      id: 'action-toggle-theme',
      group: 'actions',
      label: t('command.toggleTheme'),
      hint: isDark.value ? t('command.switchToLight') : t('command.switchToDark'),
      icon: isDark.value ? Sun : Moon,
      run: () => {
        toggleDarkMode()
        isCommandPaletteOpen.value = false
      },
    },
  ]

  const quick: PaletteItem[] = [
    {
      id: 'quick-docs',
      group: 'quick',
      label: t(documentationNavItem.labelKey),
      icon: documentationNavItem.icon,
      run: () => {
        router.push(documentationNavItem.to)
        isCommandPaletteOpen.value = false
      },
    },
  ]

  return [...pages, ...actions, ...quick]
})

const filteredItems = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return allItems.value
  return allItems.value.filter(
    (item) =>
      item.label.toLowerCase().includes(q) ||
      (item.hint && item.hint.toLowerCase().includes(q)),
  )
})

const groupedResults = computed(() => {
  const groups: { key: 'pages' | 'actions' | 'quick'; title: string; items: PaletteItem[] }[] = [
    { key: 'pages', title: t('command.pages'), items: [] },
    { key: 'actions', title: t('command.actions'), items: [] },
    { key: 'quick', title: t('command.quickLinks'), items: [] },
  ]
  for (const item of filteredItems.value) {
    const target = groups.find((g) => g.key === item.group)
    if (target) target.items.push(item)
  }
  return groups.filter((g) => g.items.length > 0)
})

function flatIndex(itemId: string): number {
  return filteredItems.value.findIndex((i) => i.id === itemId)
}

watch(isCommandPaletteOpen, async (open) => {
  if (open) {
    query.value = ''
    activeIndex.value = 0
    await nextTick()
    inputRef.value?.focus()
  }
})

watch(query, () => {
  activeIndex.value = 0
})

function onGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isCommandPaletteOpen.value = !isCommandPaletteOpen.value
    return
  }

  if (!isCommandPaletteOpen.value) return

  if (e.key === 'Escape') {
    e.preventDefault()
    isCommandPaletteOpen.value = false
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    const len = filteredItems.value.length
    if (len > 0) activeIndex.value = (activeIndex.value + 1) % len
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    const len = filteredItems.value.length
    if (len > 0) activeIndex.value = (activeIndex.value - 1 + len) % len
  } else if (e.key === 'Enter') {
    e.preventDefault()
    const selected = filteredItems.value[activeIndex.value]
    if (selected) selected.run()
  }
}

onMounted(() => window.addEventListener('keydown', onGlobalKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKeydown))
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isCommandPaletteOpen"
      class="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-[14vh] backdrop-blur-[2px] animate-fade-in"
      @click.self="isCommandPaletteOpen = false"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        class="w-full max-w-[512px] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl animate-scale-in"
      >
        <!-- Search Input Row -->
        <div class="flex items-center border-b border-border px-3.5">
          <Search class="me-2.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            :placeholder="t('command.placeholder')"
            class="h-12 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
          <button
            type="button"
            aria-label="Close command palette"
            class="ms-2 cursor-pointer rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            @click="isCommandPaletteOpen = false"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <!-- Results List -->
        <div class="max-h-[340px] overflow-y-auto p-2">
          <p
            v-if="groupedResults.length === 0"
            class="py-10 text-center text-sm text-muted-foreground"
          >
            {{ t('command.empty') }}
          </p>

          <div
            v-for="(group, idx) in groupedResults"
            :key="group.key"
            :class="{ 'mt-2 border-t border-border pt-2': idx > 0 }"
          >
            <p class="px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground">
              {{ group.title }}
            </p>

            <button
              v-for="item in group.items"
              :key="item.id"
              type="button"
              class="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-start text-sm transition-colors"
              :class="
                flatIndex(item.id) === activeIndex
                  ? 'bg-accent text-accent-foreground'
                  : 'text-foreground hover:bg-accent/60'
              "
              @mouseenter="activeIndex = flatIndex(item.id)"
              @click="item.run()"
            >
              <component
                :is="item.icon"
                class="h-4 w-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span class="flex-1 truncate">{{ item.label }}</span>

              <span
                v-if="item.badge"
                class="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/15 px-1.5 text-[11px] font-semibold text-primary tabular-nums"
              >
                {{ item.badge }}
              </span>

              <span
                v-if="item.hint"
                class="text-xs text-muted-foreground"
              >
                {{ item.hint }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
