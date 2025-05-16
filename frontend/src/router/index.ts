import { createRouter, createWebHistory } from 'vue-router'
import MainBoard from '@/components/MainBoard.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainBoard,
    },
  ],
})

export default router
