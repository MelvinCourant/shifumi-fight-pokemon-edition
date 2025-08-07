import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import PC from '../views/PC.vue';
import Fight from '../views/Fight.vue';

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
    {
      path: '/fight',
      name: 'Fight',
      component: Fight,
    },
  ],
});

export default router;
