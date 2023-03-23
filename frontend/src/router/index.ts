import { createRouter, createWebHistory, type RouteRecordRaw, type Router } from 'vue-router';
import BoardPage from '@/components/BoardPage.vue';
import BoardWrite from '@/components/BoardWrite.vue';


const routes: RouteRecordRaw[] = [
  { path: '/', component: {} },
  { path: '/board', component: BoardPage },
  { path: '/board/write', component: BoardWrite }
]

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
