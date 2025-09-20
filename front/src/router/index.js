import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import PC from '../views/PC.vue';
import Fight from '../views/Fight.vue';
import { useUserStore } from '../stores/user.js';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        sound: 'musics/battle-tower',
      },
    },
    {
      path: '/pc',
      name: 'PC',
      component: PC,
      meta: {
        sound: 'musics/pokemon-center',
      },
    },
    {
      path: '/fight',
      name: 'Fight',
      component: Fight,
      meta: {
        sound: 'musics/cynthia-theme',
      },
      beforeEnter: (to, from, next) => {
        const userStore = useUserStore();
        if (!userStore.user.pseudo || !userStore.user.pokemon.pokemonName) {
          next('/');
        } else {
          next();
        }
      },
    },
    {
      path: '/:pathMatch(.*)*',
      component: Home,
      beforeEnter: (to, from, next) => {
        next('/');
      },
    },
  ],
});

export default router;
