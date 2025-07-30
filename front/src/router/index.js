import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import PC from '../views/PC.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/pc',
      component: PC,
    }
  ],
});

export default router;
