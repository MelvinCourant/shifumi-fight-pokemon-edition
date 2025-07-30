<script setup>
import { ref } from 'vue';
import '../../assets/css/components/pokemon/_animated-sprite.scss'
import { inject } from 'vue';
import PokemonsJson from '../../data/pokemons.json';

const emit = defineEmits(['imageSizeGot']);

const pokemonSprite = inject('pokemonSprite');
const pokemon = pokemonSprite.pokemon
  ? pokemonSprite.pokemon
  : PokemonsJson[Math.floor(Math.random() * PokemonsJson.length)].image;
const imageWidth = ref(0);

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const image = new Image();
image.src = `src/assets/imgs/animated-sprites/${pokemonSprite.shiny ? 'shinies/' : ''}${pokemon}${pokemonSprite.side === 'front' ? '' : '-back'}.gif`;
image.onload = () => {
  imageWidth.value = image.width;
  emit('imageSizeGot', imageWidth.value);
}
</script>

<template>
  <img
    class="animated-sprite"
    :src="image.src"
    :alt="`${capitalizeFirstLetter(pokemon)} sprite`"
  >
</template>