import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PromptDetail from '../views/PromptDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/prompt/:id',
    name: 'PromptDetail',
    component: PromptDetail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router