import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/components/Header.vue'

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
