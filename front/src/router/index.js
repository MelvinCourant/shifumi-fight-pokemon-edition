import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import PC from '../views/PC.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/pc',
      name: 'PC',
      component: PC,
    },
  ],
});

export default router;
