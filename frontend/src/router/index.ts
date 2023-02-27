import { createRouter, createWebHistory, type RouteRecordRaw, type Router } from 'vue-router';
import Index from '@/components/Header.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    component: Index
  }
]

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
