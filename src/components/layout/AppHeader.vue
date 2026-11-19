<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
  Menu,
  Search,
  Plus,
  Moon,
  Sun,
  Palette,
  Bell,
  Settings,
  LogOut,
  Check,
  ShoppingCart,
  CreditCard,
  Users,
  Truck,
  Zap,
} from 'lucide-vue-next'
import { useThemeConfig } from '@/composables/useThemeConfig'
import { useDashboardStore } from '@/composables/useDashboardStore'
import { useI18n } from '@/composables/useI18n'

const router = useRouter()
const { config, isDark, toggleDarkMode } = useThemeConfig()
const {
  notifications,
  unreadNotificationCount,
  isCommandPaletteOpen,
  isCustomizerOpen,
  isNewOrderModalOpen,
  isMobileSidebarOpen,
  markAllNotificationsRead,
  toggleNotificationRead,
  pushToast,
} = useDashboardStore()
const { t } = useI18n()

const isNotificationsOpen = ref(false)
const isUserMenuOpen = ref(false)

const notifIcons = {
  cart: ShoppingCart,
  'credit-card': CreditCard,
  users: Users,
  truck: Truck,
}

function toggleNotifications() {
  isNotificationsOpen.value = !isNotificationsOpen.value
  isUserMenuOpen.value = false
}

function toggleUserMenu() {
  isUserMenuOpen.value = !isUserMenuOpen.value
  isNotificationsOpen.value = false
}

function navigateAndClose(path: string) {
  isUserMenuOpen.value = false
  isNotificationsOpen.value = false
  router.push(path)
}

function handleLogout() {
  isUserMenuOpen.value = false
  pushToast('Signed out', 'Demo session active — logged in as Aigars S.')
}

function onOutsideClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('[data-notifications-popover]')) {
    isNotificationsOpen.value = false
  }
  if (!target.closest('[data-user-menu]')) {
    isUserMenuOpen.value = false
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    isNotificationsOpen.value = false
    isUserMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onOutsideClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onOutsideClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6"
  >
    <!-- Left Side -->
    <div class="flex items-center gap-3">
      <!-- Mobile menu button -->
      <button
        type="button"
        aria-label="Open menu"
        class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
        @click="isMobileSidebarOpen = true"
      >
        <Menu class="h-5 w-5" aria-hidden="true" />
      </button>

      <!-- Brand mark shown when Top Nav layout is enabled -->
      <template v-if="config.layout === 'topnav'">
        <RouterLink to="/" class="hidden items-center gap-2.5 lg:flex">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap class="h-4 w-4 text-primary-foreground" />
          </div>
          <span class="text-sm font-bold tracking-tight">Apex</span>
        </RouterLink>
        <div class="hidden h-5 w-px bg-border lg:block" />
      </template>

      <!-- Command Palette Search Trigger -->
      <button
        type="button"
        class="relative hidden h-9 w-72 cursor-pointer items-center justify-between rounded-lg border border-input bg-muted/40 ps-9 pe-3 text-start text-sm text-muted-foreground/60 transition-colors hover:bg-muted/60 sm:flex"
        @click="isCommandPaletteOpen = true"
      >
        <Search
          class="pointer-events-none absolute start-3 h-4 w-4 text-muted-foreground/70"
          aria-hidden="true"
        />
        <span class="truncate">{{ t('header.search') }}</span>
        <kbd
          class="pointer-events-none inline-flex h-5 select-none items-center rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
        >
          ⌘K
        </kbd>
      </button>
    </div>

    <!-- Right Side -->
    <div class="flex items-center gap-1.5">
      <!-- New Order CTA -->
      <button
        type="button"
        class="hidden h-8 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex"
        @click="isNewOrderModalOpen = true"
      >
        <Plus class="h-3.5 w-3.5" aria-hidden="true" />
        <span>{{ t('header.newOrder') }}</span>
      </button>

      <!-- Vertical Divider -->
      <div class="mx-1.5 hidden h-5 w-px bg-border sm:block" />

      <!-- Dark/Light Theme Toggle -->
      <button
        type="button"
        aria-label="Toggle theme"
        class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        @click="toggleDarkMode"
      >
        <Sun v-if="isDark" class="h-4 w-4" aria-hidden="true" />
        <Moon v-else class="h-4 w-4" aria-hidden="true" />
      </button>

      <!-- Theme Customizer Trigger -->
      <button
        type="button"
        aria-label="Customize theme"
        class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        @click="isCustomizerOpen = true"
      >
        <Palette class="h-4 w-4" aria-hidden="true" />
      </button>

      <!-- Notifications Bell + Popover -->
      <div class="relative" data-notifications-popover>
        <button
          type="button"
          aria-label="Notifications"
          class="relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          @click.stop="toggleNotifications"
        >
          <Bell class="h-4 w-4" aria-hidden="true" />
          <span
            v-if="unreadNotificationCount > 0"
            class="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background"
          />
        </button>

        <div
          v-if="isNotificationsOpen"
          class="absolute end-0 top-11 z-50 w-80 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-xl animate-scale-in sm:w-[340px]"
        >
          <div class="flex items-center justify-between border-b border-border px-4 py-3">
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold">{{ t('header.notifications') }}</span>
              <span
                class="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/15 px-1.5 text-[11px] font-semibold text-primary tabular-nums"
              >
                {{ notifications.length }}
              </span>
            </div>

            <button
              type="button"
              class="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              @click="markAllNotificationsRead"
            >
              <Check class="h-3.5 w-3.5" />
              <span>{{ t('header.markAllRead') }}</span>
            </button>
          </div>

          <div class="max-h-80 divide-y divide-border/50 overflow-y-auto">
            <button
              v-for="item in notifications"
              :key="item.id"
              type="button"
              class="flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-start transition-colors hover:bg-muted/40"
              :class="{ 'bg-primary/[0.04]': !item.read }"
              @click="toggleNotificationRead(item.id)"
            >
              <div
                class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                :class="item.iconBgClass"
              >
                <component
                  :is="notifIcons[item.iconName]"
                  class="h-4 w-4"
                  :class="item.iconColorClass"
                />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <p
                    class="truncate text-xs leading-snug"
                    :class="item.read ? 'font-medium text-muted-foreground' : 'font-semibold text-foreground'"
                  >
                    {{ item.title }}
                  </p>
                  <span
                    v-if="!item.read"
                    class="h-2 w-2 shrink-0 rounded-full bg-primary"
                  />
                </div>
                <p class="mt-0.5 truncate text-xs text-muted-foreground">
                  {{ item.description }}
                </p>
                <p class="mt-1 text-[11px] text-muted-foreground/60">
                  {{ item.time }}
                </p>
              </div>
            </button>
          </div>

          <div class="border-t border-border p-2">
            <button
              type="button"
              class="w-full cursor-pointer rounded-md py-1.5 text-center text-xs font-medium text-primary transition-colors hover:bg-primary/10"
              @click="navigateAndClose('/notifications')"
            >
              {{ t('header.viewAllNotifications') }}
            </button>
          </div>
        </div>
      </div>

      <!-- User Avatar Dropdown -->
      <div class="relative" data-user-menu>
        <button
          type="button"
          aria-label="User menu"
          class="ms-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
          @click.stop="toggleUserMenu"
        >
          AS
        </button>

        <div
          v-if="isUserMenuOpen"
          class="absolute end-0 top-11 z-50 w-56 overflow-hidden rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-xl animate-scale-in"
        >
          <div class="px-2.5 py-2">
            <p class="text-sm font-semibold">Aigars S.</p>
            <p class="text-xs text-muted-foreground">aigars@example.com</p>
          </div>

          <div class="my-1 h-px bg-border" />

          <button
            type="button"
            class="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors hover:bg-accent"
            @click="navigateAndClose('/settings')"
          >
            <Settings class="h-4 w-4 text-muted-foreground" />
            <span>{{ t('nav.settings') }}</span>
          </button>

          <button
            type="button"
            class="flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-2 text-xs font-medium transition-colors hover:bg-accent"
            @click="navigateAndClose('/notifications')"
          >
            <span class="flex items-center gap-2.5">
              <Bell class="h-4 w-4 text-muted-foreground" />
              <span>{{ t('nav.notifications') }}</span>
            </span>
            <span
              class="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/15 px-1.5 text-[11px] font-semibold text-primary tabular-nums"
            >
              {{ notifications.length }}
            </span>
          </button>

          <div class="my-1 h-px bg-border" />

          <button
            type="button"
            class="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors hover:bg-accent"
            @click="handleLogout"
          >
            <LogOut class="h-4 w-4 text-muted-foreground" />
            <span>{{ t('header.logout') }}</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
