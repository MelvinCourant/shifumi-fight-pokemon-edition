<script setup>
import '../assets/css/views/_fight.scss';
import BattleZone from '../components/battle/BattleZone.vue';
import HUD from '../components/battle/HUD.vue';
import { useUserStore } from '../stores/user.js';
import { provide, reactive, ref } from 'vue';
import CharactersJson from '../data/characters.json';
import PokemonsJson from '../data/pokemons.json';

const userStore = useUserStore();
const user = userStore.user;
const playerSprite = {
  pokemon: user.pokemon.pokemonName,
  side: 'back',
  shiny: user.pokemon.shiny,
};
const enemySprite = ref({
  pokemon: '',
  side: 'front',
  shiny: false,
});
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
const maxHP = 300;
const player = reactive({
  role: 'player',
  pseudo: user.pseudo,
  hp: maxHP,
});
const enemy = reactive({
  role: 'enemy',
  pseudo: generateEnemy(),
});

provide('moves', moves);
provide('maxHP', maxHP);

if (!enemySprite.pokemon) {
  generateRandomPokemon(user.pokemon.pokemonName);
}

function generateEnemy() {
  return CharactersJson[Math.floor(Math.random() * CharactersJson.length)].name;
}

function generateRandomPokemon(playerPokemon) {
  const availablePokemons = PokemonsJson.filter(
    (pokemon) => pokemon.image !== playerPokemon,
  );
  enemySprite.value.pokemon =
    availablePokemons[
      Math.floor(Math.random() * availablePokemons.length)
    ].image;
}
</script>

<template>
  <main class="fight">
    <h1 class="hidden-title">Fight</h1>
    <div class="fight__enemy">
      <BattleZone :pokemonSprite="enemySprite" />
      <HUD :player="enemy" />
    </div>
    <div class="fight__player">
      <BattleZone :pokemonSprite="playerSprite" />
      <HUD :player="player" />
    </div>
  </main>
</template>
