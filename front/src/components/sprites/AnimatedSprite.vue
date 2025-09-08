<script setup>
import { computed, provide, ref, watch } from 'vue';
import '../../assets/css/components/pokemon/_animated-sprite.scss';
import { inject } from 'vue';

const props = defineProps({
  pokemonSprite: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['imageSizeGot']);

const pokemonSprite = ref(
  Object.keys(props.pokemonSprite).length > 0
    ? props.pokemonSprite
    : inject('pokemonSprite'),
);
const imageWidth = ref(0);
let image = new Image();

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function generateImageSrc(pokemon, side, shiny) {
  const basePath = shiny
    ? `../../assets/imgs/animated-sprites/shinies/${pokemon}${side === 'front' ? '' : '-back'}.gif`
    : `../../assets/imgs/animated-sprites/${pokemon}${side === 'front' ? '' : '-back'}.gif`;

  return new URL(basePath, import.meta.url).href;
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
  <div class="animated-sprite__container">
    <img
      v-if="pokemonSprite.pokemon"
      :class="[
        `animated-sprite animated-sprite--${pokemonSprite.side}`,
        { 'animated-sprite--damaged': pokemonSprite.receiveDamage },
        { 'animated-sprite--ko': pokemonSprite.ko },
      ]"
      :src="image.src"
      :alt="`${capitalizeFirstLetter(pokemonSprite.pokemon)} sprite`"
    />
  </div>
</template>
