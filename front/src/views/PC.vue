<script setup>
import '../assets/css/views/_pc.scss';
import PokemonsJson from '../data/pokemons.json';
import { useUserStore } from '../stores/user.js';
import { provide, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PCBox from '../components/pc/PCBox.vue';
import PokemonDetails from '../components/pc/PokemonDetails.vue';

const route = useRoute();
const query = route.query;
const router = useRouter();
const userStore = useUserStore();
const user = userStore.user;
const pseudo = ref(user.pseudo ? user.pseudo : 'Joueur');
const pokemonSelected = ref(user.pokemon.pokemonName || query.pokemon);
const pokemonDetails = ref(
  PokemonsJson.find((p) => p.image === pokemonSelected.value)
    ? {
        pokedexId: PokemonsJson.find((p) => p.image === pokemonSelected.value)
          .pokedexId,
        name: PokemonsJson.find((p) => p.image === pokemonSelected.value).name,
      }
    : {},
);
const pokemonSprite = ref({
  pokemon: pokemonSelected.value,
  side: 'front',
  shiny: user.pokemon.shiny || false,
});

provide('pokemonSelected', pokemonSelected.value);
provide('pokemonSprite', pokemonSprite);

async function updatePokemonSelected(pokemonName) {
  pokemonSelected.value = pokemonName;
  pokemonSprite.value.pokemon = pokemonName;
  pokemonDetails.value = {
    pokedexId: PokemonsJson.find((p) => p.image === pokemonName).pokedexId,
    name: PokemonsJson.find((p) => p.image === pokemonName).name,
  };

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
    <div class="pc__system">
      <PokemonDetails :pokemonDetails="pokemonDetails" :pseudo="pseudo" />
      <PCBox
        :pokemons="PokemonsJson"
        @pokemonSelected="updatePokemonSelected($event)"
      />
    </div>
  </main>
</template>
