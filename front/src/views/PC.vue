<script setup>
import '../assets/css/views/_pc.scss';
import PokemonsJson from '../data/pokemons.json';
import { useUserStore } from '../stores/user.js';
import { provide, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PCBox from '../components/pc/PCBox.vue';

const route = useRoute();
const query = route.query;
const router = useRouter();
const userStore = useUserStore();
const user = userStore.user;
const pseudo = ref(user.pseudo ? user.pseudo : 'Joueur');
const pokemonSelected = ref(user.pokemon.pokemonName || query.pokemon);

provide('pokemonSelected', pokemonSelected.value);

async function updatePokemonSelected(pokemonName) {
  pokemonSelected.value = pokemonName;
  userStore.updateUser({
    pseudo: pseudo.value,
    pokemon: {
      pokemonName: pokemonName,
      shiny: false,
    },
  });
  await router.push({
    path: '/pc',
    query: { pokemon: pokemonName },
  });
}
</script>

<template>
  <main class="pc">
    <PCBox
      :pokemons="PokemonsJson"
      @pokemonSelected="updatePokemonSelected($event)"
    />
  </main>
</template>
