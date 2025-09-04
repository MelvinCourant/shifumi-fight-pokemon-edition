<script setup>
import '../assets/css/views/_fight.scss';
import BattleZone from '../components/battle/BattleZone.vue';
import Moves from '../components/battle/Moves.vue';
import { useUserStore } from '../stores/user.js';
import { provide, reactive } from 'vue';

const userStore = useUserStore();
const user = userStore.user;
const playerSprite = {
  pokemon: user.pokemon.pokemonName,
  side: 'back',
  shiny: user.pokemon.shiny,
};
const moves = reactive([
  {
    id: 0,
    title: 'Pierre',
    PP: 4,
    maxPP: 4,
    image: 'pierre',
  },
  {
    id: 1,
    title: 'Feuille',
    PP: 4,
    maxPP: 4,
    image: 'feuille',
  },
  {
    id: 2,
    title: 'Ciseaux',
    PP: 4,
    maxPP: 4,
    image: 'ciseaux',
  },
  {
    id: 3,
    title: 'Puits',
    PP: 1,
    maxPP: 1,
    image: 'puits',
  },
]);

provide('moves', moves);
</script>

<template>
  <main class="fight">
    <h1 class="hidden-title">Fight</h1>
    <div class="fight__player">
      <BattleZone :pokemonSprite="playerSprite" />
      <Moves />
    </div>
  </main>
</template>
