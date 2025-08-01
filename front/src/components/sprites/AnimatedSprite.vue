<script setup>
import { ref, watch } from 'vue';
import '../../assets/css/components/pokemon/_animated-sprite.scss';
import { inject } from 'vue';

const emit = defineEmits(['imageSizeGot']);

const pokemonSprite = ref(inject('pokemonSprite'));
const imageWidth = ref(0);
let image = new Image();

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function generateImageSrc(pokemon, side, shiny) {
  return `src/assets/imgs/animated-sprites/${shiny ? 'shinies/' : ''}${pokemon}${side === 'front' ? '' : '-back'}.gif`;
}

if (pokemonSprite.value.pokemon) {
  image.src = generateImageSrc(
    pokemonSprite.value.pokemon,
    pokemonSprite.value.side,
    pokemonSprite.value.shiny,
  );
  image.onload = () => {
    imageWidth.value = image.width;
    emit('imageSizeGot', imageWidth.value);
  };
}

watch(
  () => pokemonSprite.value,
  (newValue) => {
    image.src = generateImageSrc(
      newValue.pokemon,
      newValue.side,
      newValue.shiny,
    );
    image.onload = () => {
      imageWidth.value = image.width;
      emit('imageSizeGot', imageWidth.value);
    };
  },
  { deep: true },
);
</script>

<template>
  <img
    v-if="pokemonSprite.pokemon"
    class="animated-sprite"
    :src="image.src"
    :alt="`${capitalizeFirstLetter(pokemonSprite.pokemon)} sprite`"
  />
</template>
