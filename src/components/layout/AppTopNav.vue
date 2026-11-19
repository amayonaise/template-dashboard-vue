<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ChevronDown } from 'lucide-vue-next'
import { navigationGroups, documentationNavItem, type NavGroup } from '@/data/navigation'
import { useI18n } from '@/composables/useI18n'

const route = useRoute()
const { t } = useI18n()

const openGroupId = ref<string | null>(null)

const primaryGroups = navigationGroups.filter((g) => g.id !== 'system')
const systemGroup = navigationGroups.find((g) => g.id === 'system')

function isGroupActive(group: NavGroup): boolean {
  return group.items.some((item) => item.to === route.path)
}

function toggleDropdown(id: string) {
  openGroupId.value = openGroupId.value === id ? null : id
}

function onClickOutside(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest('[data-topnav-menu]')) {
    openGroupId.value = null
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <nav
    aria-label="Top navigation"
    class="hidden border-b border-border bg-card/80 px-6 backdrop-blur-sm lg:block"
  >
    <div class="flex h-11 items-center justify-between">
      <div class="flex items-center gap-1">
        <div
          v-for="group in primaryGroups"
          :key="group.id"
          class="relative"
          data-topnav-menu
        >
          <button
            type="button"
            class="flex cursor-pointer items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            :class="
              isGroupActive(group)
                ? 'text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            "
            @click.stop="toggleDropdown(group.id)"
          >
            <span>{{ t(group.labelKey) }}</span>
            <ChevronDown
              class="h-3.5 w-3.5 transition-transform duration-150"
              :class="{ 'rotate-180': openGroupId === group.id }"
            />
          </button>

          <div
            v-if="openGroupId === group.id"
            class="absolute start-0 top-10 z-40 w-48 rounded-lg border border-border bg-popover p-1.5 text-popover-foreground shadow-lg animate-scale-in"
          >
            <RouterLink
              v-for="item in group.items"
              :key="item.id"
              :to="item.to"
              class="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors"
              :class="
                route.path === item.to
                  ? 'bg-primary/10 text-primary'
                  : 'text-popover-foreground hover:bg-accent'
              "
              @click="openGroupId = null"
            >
              <component :is="item.icon" class="h-4 w-4 text-muted-foreground" />
              <span>{{ t(item.labelKey) }}</span>
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-1">
        <div v-if="systemGroup" class="relative" data-topnav-menu>
          <button
            type="button"
            class="flex cursor-pointer items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
            :class="
              isGroupActive(systemGroup)
                ? 'text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            "
            @click.stop="toggleDropdown(systemGroup.id)"
          >
            <span>{{ t(systemGroup.labelKey) }}</span>
            <ChevronDown
              class="h-3.5 w-3.5 transition-transform duration-150"
              :class="{ 'rotate-180': openGroupId === systemGroup.id }"
            />
          </button>

          <div
            v-if="openGroupId === systemGroup.id"
            class="absolute end-0 top-10 z-40 w-48 rounded-lg border border-border bg-popover p-1.5 text-popover-foreground shadow-lg animate-scale-in"
          >
            <RouterLink
              v-for="item in systemGroup.items"
              :key="item.id"
              :to="item.to"
              class="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium transition-colors"
              :class="
                route.path === item.to
                  ? 'bg-primary/10 text-primary'
                  : 'text-popover-foreground hover:bg-accent'
              "
              @click="openGroupId = null"
            >
              <component :is="item.icon" class="h-4 w-4 text-muted-foreground" />
              <span>{{ t(item.labelKey) }}</span>
            </RouterLink>
          </div>
        </div>

        <RouterLink
          :to="documentationNavItem.to"
          class="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {{ t(documentationNavItem.labelKey) }}
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
