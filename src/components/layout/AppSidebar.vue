<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  Zap,
  ChevronRight,
  ChevronLeft,
  LogOut,
  X,
} from 'lucide-vue-next'
import { navigationGroups, documentationNavItem, type NavItem } from '@/data/navigation'
import { useThemeConfig } from '@/composables/useThemeConfig'
import { useDashboardStore } from '@/composables/useDashboardStore'
import { useI18n } from '@/composables/useI18n'

const route = useRoute()
const { config, toggleSidebar } = useThemeConfig()
const {
  ordersBadgeCount,
  unreadNotificationCount,
  isMobileSidebarOpen,
  pushToast,
} = useDashboardStore()
const { t } = useI18n()

const collapsedGroups = ref<Record<string, boolean>>({})

function toggleGroup(groupId: string) {
  collapsedGroups.value[groupId] = !collapsedGroups.value[groupId]
}

function isActive(to: string): boolean {
  return route.path === to
}

function getBadgeCount(item: NavItem): number | undefined {
  if (item.badgeType === 'orders') return ordersBadgeCount.value
  if (item.badgeType === 'notifications') return unreadNotificationCount.value || undefined
  return item.badge
}

function handleLogout() {
  pushToast('Signed out', 'Demo session reset — signed in as Aigars S.')
}

function closeMobile() {
  isMobileSidebarOpen.value = false
}
</script>

<template>
  <!-- Desktop Sidebar -->
  <aside
    class="fixed inset-y-0 start-0 z-40 hidden h-screen flex-col border-e border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out lg:flex"
    :class="config.sidebarCollapsed ? 'w-[68px]' : 'w-[260px]'"
  >
    <!-- Brand -->
    <div
      class="flex h-16 shrink-0 items-center border-b border-sidebar-border/60 transition-all"
      :class="config.sidebarCollapsed ? 'justify-center px-2' : 'gap-3 px-4'"
    >
      <RouterLink
        to="/"
        class="flex items-center gap-3 overflow-hidden focus:outline-none"
      >
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
          <Zap class="h-4 w-4 text-sidebar-primary-foreground" aria-hidden="true" />
        </div>
        <div v-if="!config.sidebarCollapsed" class="flex flex-col leading-tight">
          <span class="text-sm font-bold tracking-tight text-sidebar-foreground">Apex</span>
          <span class="text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/40">
            {{ t('brand.subtitle') }}
          </span>
        </div>
      </RouterLink>
    </div>

    <!-- Navigation Groups -->
    <nav
      aria-label="Main navigation"
      class="scrollbar-fade flex-1 space-y-5 overflow-y-auto px-3 py-4"
    >
      <div v-for="(group, gIdx) in navigationGroups" :key="group.id" class="space-y-1">
        <!-- Group Header (expanded) -->
        <button
          v-if="!config.sidebarCollapsed"
          type="button"
          class="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/35 transition-colors hover:text-sidebar-foreground/60"
          @click="toggleGroup(group.id)"
        >
          <span>{{ t(group.labelKey) }}</span>
          <ChevronRight
            class="h-3 w-3 transition-transform duration-200"
            :class="collapsedGroups[group.id] ? '' : 'rotate-90'"
            aria-hidden="true"
          />
        </button>

        <!-- Group Divider (collapsed) -->
        <div
          v-else-if="gIdx > 0"
          class="mx-auto my-2 h-px w-6 bg-sidebar-border/70"
        />

        <!-- Group Items -->
        <div
          v-show="config.sidebarCollapsed || !collapsedGroups[group.id]"
          class="space-y-0.5"
        >
          <RouterLink
            v-for="item in group.items"
            :key="item.id"
            :to="item.to"
            :title="config.sidebarCollapsed ? t(item.labelKey) : undefined"
            class="group relative flex items-center rounded-lg text-sm font-medium transition-all duration-200"
            :class="[
              config.sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2',
              isActive(item.to)
                ? 'bg-sidebar-accent text-sidebar-primary'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
            ]"
          >
            <component
              :is="item.icon"
              class="h-[18px] w-[18px] shrink-0 transition-colors"
              aria-hidden="true"
            />
            <span v-if="!config.sidebarCollapsed" class="truncate">
              {{ t(item.labelKey) }}
            </span>

            <!-- Expanded badge -->
            <span
              v-if="!config.sidebarCollapsed && getBadgeCount(item)"
              class="ms-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary/15 px-1.5 text-[11px] font-semibold text-sidebar-primary tabular-nums"
            >
              {{ getBadgeCount(item) }}
            </span>

            <!-- Collapsed dot indicator -->
            <span
              v-if="config.sidebarCollapsed && getBadgeCount(item)"
              class="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-sidebar-primary ring-2 ring-sidebar"
            />
          </RouterLink>
        </div>
      </div>

      <!-- Bottom Documentation link -->
      <div class="border-t border-sidebar-border/70 pt-3">
        <RouterLink
          :to="documentationNavItem.to"
          :title="config.sidebarCollapsed ? t(documentationNavItem.labelKey) : undefined"
          class="group relative flex items-center rounded-lg text-sm font-medium transition-all duration-200"
          :class="[
            config.sidebarCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2',
            isActive(documentationNavItem.to)
              ? 'bg-sidebar-accent text-sidebar-primary'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground',
          ]"
        >
          <component
            :is="documentationNavItem.icon"
            class="h-[18px] w-[18px] shrink-0"
            aria-hidden="true"
          />
          <span v-if="!config.sidebarCollapsed" class="truncate">
            {{ t(documentationNavItem.labelKey) }}
          </span>
        </RouterLink>
      </div>
    </nav>

    <!-- User Footer -->
    <div class="shrink-0 border-t border-sidebar-border p-3">
      <div
        class="flex items-center"
        :class="config.sidebarCollapsed ? 'justify-center' : 'gap-2'"
      >
        <RouterLink
          to="/profile"
          :title="config.sidebarCollapsed ? 'Aigars S. (Admin)' : undefined"
          class="flex items-center rounded-lg transition-colors hover:bg-sidebar-accent/50"
          :class="config.sidebarCollapsed ? 'p-1' : 'min-w-0 flex-1 gap-3 px-2 py-1.5'"
        >
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground"
          >
            AS
          </span>
          <div v-if="!config.sidebarCollapsed" class="min-w-0 flex-1 leading-tight">
            <p class="truncate text-sm font-medium text-sidebar-foreground">Aigars S.</p>
            <p class="truncate text-[11px] text-sidebar-foreground/45">Admin</p>
          </div>
        </RouterLink>

        <button
          v-if="!config.sidebarCollapsed"
          type="button"
          aria-label="Log out"
          title="Log out"
          class="cursor-pointer rounded-md p-1.5 text-sidebar-foreground/40 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground/80"
          @click="handleLogout"
        >
          <LogOut class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Floating Collapse Toggle Button -->
    <button
      type="button"
      :aria-label="config.sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      class="absolute -end-3 top-20 z-50 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-all hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      @click="toggleSidebar"
    >
      <ChevronRight
        v-if="config.sidebarCollapsed"
        class="h-3.5 w-3.5 rtl:rotate-180"
        aria-hidden="true"
      />
      <ChevronLeft
        v-else
        class="h-3.5 w-3.5 rtl:rotate-180"
        aria-hidden="true"
      />
    </button>
  </aside>

  <!-- Mobile Sidebar Drawer -->
  <Teleport to="body">
    <div
      v-if="isMobileSidebarOpen"
      class="fixed inset-0 z-50 flex lg:hidden"
    >
      <div
        class="fixed inset-0 bg-black/60 backdrop-blur-[2px] animate-fade-in"
        @click="closeMobile"
      />

      <aside
        class="relative z-10 flex h-full w-[272px] max-w-[82vw] flex-col border-e border-sidebar-border bg-sidebar shadow-2xl"
      >
        <div class="flex h-16 items-center justify-between border-b border-sidebar-border/60 px-4">
          <RouterLink to="/" class="flex items-center gap-3" @click="closeMobile">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <Zap class="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <div class="flex flex-col leading-tight">
              <span class="text-sm font-bold tracking-tight text-sidebar-foreground">Apex</span>
              <span class="text-[10px] font-medium uppercase tracking-widest text-sidebar-foreground/40">
                {{ t('brand.subtitle') }}
              </span>
            </div>
          </RouterLink>

          <button
            type="button"
            aria-label="Close navigation menu"
            class="cursor-pointer rounded-md p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            @click="closeMobile"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <nav class="flex-1 space-y-5 overflow-y-auto px-3 py-4">
          <div v-for="group in navigationGroups" :key="group.id" class="space-y-1">
            <p class="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/35">
              {{ t(group.labelKey) }}
            </p>
            <RouterLink
              v-for="item in group.items"
              :key="item.id"
              :to="item.to"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="
                isActive(item.to)
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              "
              @click="closeMobile"
            >
              <component :is="item.icon" class="h-[18px] w-[18px] shrink-0" />
              <span class="truncate">{{ t(item.labelKey) }}</span>
              <span
                v-if="getBadgeCount(item)"
                class="ms-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-primary/15 px-1.5 text-[11px] font-semibold text-sidebar-primary"
              >
                {{ getBadgeCount(item) }}
              </span>
            </RouterLink>
          </div>

          <div class="border-t border-sidebar-border/70 pt-3">
            <RouterLink
              :to="documentationNavItem.to"
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              @click="closeMobile"
            >
              <component :is="documentationNavItem.icon" class="h-[18px] w-[18px]" />
              <span>{{ t(documentationNavItem.labelKey) }}</span>
            </RouterLink>
          </div>
        </nav>

        <div class="border-t border-sidebar-border p-3">
          <div class="flex items-center gap-2">
            <RouterLink
              to="/profile"
              class="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-sidebar-accent/50"
              @click="closeMobile"
            >
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
                AS
              </span>
              <div class="min-w-0 leading-tight">
                <p class="truncate text-sm font-medium text-sidebar-foreground">Aigars S.</p>
                <p class="truncate text-[11px] text-sidebar-foreground/45">Admin</p>
              </div>
            </RouterLink>
            <button
              type="button"
              aria-label="Log out"
              class="cursor-pointer rounded-md p-1.5 text-sidebar-foreground/40 hover:bg-sidebar-accent hover:text-sidebar-foreground/80"
              @click="handleLogout"
            >
              <LogOut class="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </div>
  </Teleport>
</template>
