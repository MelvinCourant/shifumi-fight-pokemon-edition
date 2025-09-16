<script setup>
import { computed, inject, ref, onMounted } from 'vue';
import '../../assets/css/components/pokemon/_animated-sprite.scss';

const props = defineProps({
  pokemonList: {
    type: Array,
    required: true,
  },
  ratio: {
    type: Number,
    default: 0,
  },
});

const pokemonSprite = ref(inject('pokemonSprite'));
const preloadedImages = ref(new Map());
const loadedImages = ref(new Set());

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function generateImageSrc(pokemon, side, shiny) {
  const basePath = shiny
    ? `/imgs/animated-sprites/shinies/${pokemon}${side === 'front' ? '' : '-back'}.gif`
    : `/imgs/animated-sprites/${pokemon}${side === 'front' ? '' : '-back'}.gif`;

  return new URL(basePath, import.meta.url).href;
}

const currentPokemonKey = computed(() => {
  if (!pokemonSprite.value?.pokemon) return null;
  return `${pokemonSprite.value.pokemon}-${pokemonSprite.value.side}-${pokemonSprite.value.shiny}`;
});

const isCurrentPokemonLoaded = computed(() => {
  return currentPokemonKey.value
    ? loadedImages.value.has(currentPokemonKey.value)
    : false;
});

onMounted(async () => {
  const imagePromises = [];

  props.pokemonList.forEach((pokemon) => {
    const frontSrc = generateImageSrc(pokemon.image, 'front', false);
    const frontImg = new Image();
    frontImg.src = frontSrc;
    const frontKey = `${pokemon.image}-front-false`;
    imagePromises.push(
      new Promise((resolve) => {
        frontImg.onload = () => {
          loadedImages.value.add(frontKey);
          resolve();
        };
        frontImg.onerror = () => resolve();
      }),
    );
    preloadedImages.value.set(frontKey, frontImg);

    if (pokemon.shiny !== undefined) {
      const shinyFrontSrc = generateImageSrc(pokemon.image, 'front', true);
      const shinyFrontImg = new Image();
      shinyFrontImg.src = shinyFrontSrc;
      const shinyFrontKey = `${pokemon.image}-front-true`;
      imagePromises.push(
        new Promise((resolve) => {
          shinyFrontImg.onload = () => {
            loadedImages.value.add(shinyFrontKey);
            resolve();
          };
          shinyFrontImg.onerror = () => resolve();
        }),
      );
      preloadedImages.value.set(shinyFrontKey, shinyFrontImg);
    }

    const backSrc = generateImageSrc(pokemon.image, 'back', false);
    const backImg = new Image();
    backImg.src = backSrc;
    const backKey = `${pokemon.image}-back-false`;
    imagePromises.push(
      new Promise((resolve) => {
        backImg.onload = () => {
          loadedImages.value.add(backKey);
          resolve();
        };
        backImg.onerror = () => resolve();
      }),
    );
    preloadedImages.value.set(backKey, backImg);

    if (pokemon.shiny !== undefined) {
      const shinyBackSrc = generateImageSrc(pokemon.image, 'back', true);
      const shinyBackImg = new Image();
      shinyBackImg.src = shinyBackSrc;
      const shinyBackKey = `${pokemon.image}-back-true`;
      imagePromises.push(
        new Promise((resolve) => {
          shinyBackImg.onload = () => {
            loadedImages.value.add(shinyBackKey);
            resolve();
          };
          shinyBackImg.onerror = () => resolve();
        }),
      );
      preloadedImages.value.set(shinyBackKey, shinyBackImg);
    }
  });

  await Promise.all(imagePromises);
});
</script>

<template>
  <div class="animated-sprite__container" :style="{ width: `${ratio}%` }">
    <div
      v-if="!isCurrentPokemonLoaded && pokemonSprite?.pokemon"
      class="animated-sprite__skeleton"
    ></div>
    <template v-else v-for="[key, img] in preloadedImages" :key="key">
      <img
        :class="[
          `animated-sprite animated-sprite--${pokemonSprite?.side}`,
          { 'animated-sprite--damaged': pokemonSprite?.receiveDamage },
          { 'animated-sprite--ko': pokemonSprite?.ko },
        ]"
        :src="img.src"
        :alt="`${capitalizeFirstLetter(key.split('-')[0])} sprite`"
        :style="{
          display: currentPokemonKey === key ? 'block' : 'none',
        }"
      />
    </template>
  </div>
</template>
