import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import SectionPlaceholderView from '@/views/SectionPlaceholderView.vue'
import { allNavItems } from '@/data/navigation'

const secondaryRoutes = allNavItems
  .filter((item) => item.to !== '/')
  .map((item) => ({
    path: item.to,
    name: item.id,
    component: SectionPlaceholderView,
    meta: { title: item.id.charAt(0).toUpperCase() + item.id.slice(1) },
  }))

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { title: 'Dashboard' },
    },
    ...secondaryRoutes,
    {
      path: '/profile',
      name: 'profile',
      component: SectionPlaceholderView,
      meta: { title: 'Profile' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = (to.meta.title as string) || 'Dashboard'
  document.title = `${title} — Apex`
})

export default router
