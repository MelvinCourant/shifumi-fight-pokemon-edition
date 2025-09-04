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
    title: 'Pierre',
    PP: 4,
    maxPP: 4,
    image: 'pierre',
  },
]);

provide('moves', moves);
</script>

<template>
  <main class="fight">
    <h1 class="hidden-title">Fight</h1>
    <div class="fight__player">
      <BattleZone :pokemonSprite="playerSprite" />
    </div>
    <Moves />
  </main>
</template>
