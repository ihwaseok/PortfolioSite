import { createRouter, createWebHistory, type RouteRecordRaw, type Router } from 'vue-router';
import Board from '@/components/BoardPage.vue';


const routes: RouteRecordRaw[] = [
  { path: '/', component: '' },
  { path: '/board', component: Board }
]

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
