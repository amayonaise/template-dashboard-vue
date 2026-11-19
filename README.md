# Apex Dashboard — Vue 3 Clone

Clean Vue 3 + Vite + TypeScript + Tailwind CSS v4 implementation cloned from `https://demo.dashboardpack.com/apex-vue/`.

## Features

- **Core Dashboard**:
  - 4 KPI stat cards with colored icon badges, trend indicators, and SVG area sparklines
  - Interactive **Overview** chart with `Revenue` (smooth area), `Orders` (rounded bar), and `Profit` (smooth area) tabs plus hover crosshair & tooltips
  - Interactive **Traffic Sources** donut chart with segment hover & synced legend
  - **Monthly Goals** progress bars
  - **Recent Orders** table with gradient initial avatars, status pills, row action menu, order detail modal, and live `+ New Order` creation
  - **Recent Activity** event feed synced with live order creation
- **Full Layout Shell**:
  - Collapsible dark **Sidebar** (260px expanded / 68px icon-only collapsed / mobile slide-over drawer) with collapsible nav groups & live badges
  - **Top Nav** layout mode switchable from the Theme Customizer
  - Sticky frosted **Header** with `⌘K` search trigger, `+ New Order` modal, dark/light toggle, theme customizer, notifications popover (`Mark all read`), and user dropdown
  - **Command Palette (`⌘K` / `Ctrl+K`)** with keyboard navigation and live filtering across Pages, Actions, and Quick Links
  - **Theme Customizer** with Theme (`Light` / `Dark` / `System`), 6 OKLCH Accent Colors (`Emerald`, `Blue`, `Violet`, `Rose`, `Orange`, `Slate`), Density (`Compact` / `Comfortable` / `Spacious`), Layout (`Sidebar` / `Top Nav`), Container (`Fluid` / `Boxed`), Direction (`LTR` / `RTL`), and Language (`English` / `Deutsch` / `Français`), persisted in `localStorage`

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```
