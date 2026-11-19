import { reactive, watch, computed } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'
export type AccentColor = 'emerald' | 'blue' | 'violet' | 'rose' | 'orange' | 'slate'
export type DensityMode = 'compact' | 'comfortable' | 'spacious'
export type LayoutMode = 'sidebar' | 'topnav'
export type ContainerMode = 'fluid' | 'boxed'
export type DirectionMode = 'ltr' | 'rtl'
export type LocaleCode = 'en' | 'de' | 'fr'

export interface AccentPreset {
  id: AccentColor
  label: string
  swatch: string
  light: string
  dark: string
}

export const ACCENT_PRESETS: AccentPreset[] = [
  { id: 'emerald', label: 'Emerald', swatch: 'oklch(0.55 0.19 160)', light: 'oklch(0.55 0.175 160)', dark: 'oklch(0.65 0.19 160)' },
  { id: 'blue', label: 'Blue', swatch: 'oklch(0.55 0.19 240)', light: 'oklch(0.55 0.19 240)', dark: 'oklch(0.65 0.19 240)' },
  { id: 'violet', label: 'Violet', swatch: 'oklch(0.55 0.19 280)', light: 'oklch(0.55 0.19 280)', dark: 'oklch(0.65 0.19 280)' },
  { id: 'rose', label: 'Rose', swatch: 'oklch(0.55 0.19 350)', light: 'oklch(0.55 0.19 350)', dark: 'oklch(0.65 0.19 350)' },
  { id: 'orange', label: 'Orange', swatch: 'oklch(0.55 0.19 50)', light: 'oklch(0.55 0.19 50)', dark: 'oklch(0.65 0.19 50)' },
  { id: 'slate', label: 'Slate', swatch: 'oklch(0.55 0.02 260)', light: 'oklch(0.45 0.02 260)', dark: 'oklch(0.70 0.02 260)' },
]

interface ThemeConfigState {
  theme: ThemeMode
  accent: AccentColor
  density: DensityMode
  layout: LayoutMode
  container: ContainerMode
  direction: DirectionMode
  locale: LocaleCode
  sidebarCollapsed: boolean
}

const STORAGE_KEY = 'apex-dashboard-theme-config'

const DEFAULT_CONFIG: ThemeConfigState = {
  theme: 'light',
  accent: 'emerald',
  density: 'comfortable',
  layout: 'sidebar',
  container: 'fluid',
  direction: 'ltr',
  locale: 'en',
  sidebarCollapsed: false,
}

function loadConfig(): ThemeConfigState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_CONFIG }
    const parsed = JSON.parse(raw) as Partial<ThemeConfigState>
    return { ...DEFAULT_CONFIG, ...parsed }
  } catch {
    return { ...DEFAULT_CONFIG }
  }
}

const config = reactive<ThemeConfigState>(loadConfig())

let initialized = false

function resolveIsDark(mode: ThemeMode): boolean {
  if (mode === 'dark') return true
  if (mode === 'light') return false
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

export function applyThemeToDom() {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const dark = resolveIsDark(config.theme)

  root.classList.toggle('dark', dark)
  root.classList.toggle('light', !dark)

  root.classList.remove('density-compact', 'density-comfortable', 'density-spacious')
  root.classList.add(`density-${config.density}`)

  root.classList.toggle('container-boxed', config.container === 'boxed')

  root.setAttribute('dir', config.direction)
  root.setAttribute('lang', config.locale)

  const preset = ACCENT_PRESETS.find((p) => p.id === config.accent) ?? ACCENT_PRESETS[0]
  if (config.accent === 'emerald') {
    root.style.removeProperty('--primary')
    root.style.removeProperty('--primary-foreground')
    root.style.removeProperty('--sidebar-primary')
    root.style.removeProperty('--chart-1')
    root.style.removeProperty('--ring')
    root.style.removeProperty('--sidebar-ring')
  } else {
    const value = dark ? preset.dark : preset.light
    const fg = dark ? 'oklch(7.5% 0 0)' : 'oklch(98.5% 0.002 230)'
    root.style.setProperty('--primary', value)
    root.style.setProperty('--primary-foreground', fg)
    root.style.setProperty('--sidebar-primary', value)
    root.style.setProperty('--chart-1', value)
    root.style.setProperty('--ring', value)
    root.style.setProperty('--sidebar-ring', value)
  }
}

export function useThemeConfig() {
  if (!initialized && typeof window !== 'undefined') {
    initialized = true
    applyThemeToDom()

    watch(
      config,
      () => {
        applyThemeToDom()
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
        } catch {
          // ignore storage quota errors
        }
      },
      { deep: true },
    )

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', () => {
      if (config.theme === 'system') applyThemeToDom()
    })
  }

  const isDark = computed(() => resolveIsDark(config.theme))

  function toggleDarkMode() {
    config.theme = isDark.value ? 'light' : 'dark'
  }

  function toggleSidebar() {
    config.sidebarCollapsed = !config.sidebarCollapsed
  }

  function resetToDefaults() {
    Object.assign(config, DEFAULT_CONFIG)
  }

  return {
    config,
    isDark,
    toggleDarkMode,
    toggleSidebar,
    resetToDefaults,
  }
}
