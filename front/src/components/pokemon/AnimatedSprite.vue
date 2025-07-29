<script setup>
import '../../assets/css/components/pokemon/_animated-sprite.scss'
import { inject } from 'vue';
import PokemonsJson from '../../data/pokemons.json';

const pokemonSprite = inject('pokemonSprite');
const pokemon = pokemonSprite.pokemon
  ? pokemonSprite.pokemon
  : PokemonsJson[Math.floor(Math.random() * PokemonsJson.length)].image;

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
</script>

<template>
<img
  class="animated-sprite"
  :src="`src/assets/imgs/animated-sprites/${pokemonSprite.shiny ? 'shinies/' : ''}${pokemon}${pokemonSprite.side === 'front' ? '' : '-back'}.gif`"
  :alt="`${capitalizeFirstLetter(pokemon)} sprite`">
</template>