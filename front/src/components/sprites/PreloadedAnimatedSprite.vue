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
const preloadedVideos = ref(new Map());
const loadedVideos = ref(new Set());

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function generateImageSrc(pokemon, side, shiny) {
  const basePath = shiny
    ? `/imgs/animated-sprites/shinies/${pokemon}${side === 'front' ? '' : '-back'}.webm`
    : `/imgs/animated-sprites/${pokemon}${side === 'front' ? '' : '-back'}.webm`;

  return new URL(basePath, import.meta.url).href;
}

const currentPokemonKey = computed(() => {
  if (!pokemonSprite.value?.pokemon) return null;
  return `${pokemonSprite.value.pokemon}-${pokemonSprite.value.side}-${pokemonSprite.value.shiny}`;
});

const isCurrentPokemonLoaded = computed(() => {
  return currentPokemonKey.value
    ? loadedVideos.value.has(currentPokemonKey.value)
    : false;
});

onMounted(async () => {
  const videoPromises = [];

  props.pokemonList.forEach((pokemon) => {
    const frontSrc = generateImageSrc(pokemon.image, 'front', false);
    const frontVideo = document.createElement('video');
    frontVideo.src = frontSrc;
    frontVideo.loop = true;
    frontVideo.muted = true;
    frontVideo.preload = 'metadata';
    const frontKey = `${pokemon.image}-front-false`;
    videoPromises.push(
      new Promise((resolve) => {
        frontVideo.oncanplaythrough = () => {
          loadedVideos.value.add(frontKey);
          resolve();
        };
        frontVideo.onerror = () => resolve();
      }),
    );
    preloadedVideos.value.set(frontKey, frontVideo);

    if (pokemon.shiny !== undefined) {
      const shinyFrontSrc = generateImageSrc(pokemon.image, 'front', true);
      const shinyFrontVideo = document.createElement('video');
      shinyFrontVideo.src = shinyFrontSrc;
      shinyFrontVideo.loop = true;
      shinyFrontVideo.muted = true;
      shinyFrontVideo.preload = 'metadata';
      const shinyFrontKey = `${pokemon.image}-front-true`;
      videoPromises.push(
        new Promise((resolve) => {
          shinyFrontVideo.oncanplaythrough = () => {
            loadedVideos.value.add(shinyFrontKey);
            resolve();
          };
          shinyFrontVideo.onerror = () => resolve();
        }),
      );
      preloadedVideos.value.set(shinyFrontKey, shinyFrontVideo);
    }

    const backSrc = generateImageSrc(pokemon.image, 'back', false);
    const backVideo = document.createElement('video');
    backVideo.src = backSrc;
    backVideo.loop = true;
    backVideo.muted = true;
    backVideo.preload = 'metadata';
    const backKey = `${pokemon.image}-back-false`;
    videoPromises.push(
      new Promise((resolve) => {
        backVideo.oncanplaythrough = () => {
          loadedVideos.value.add(backKey);
          resolve();
        };
        backVideo.onerror = () => resolve();
      }),
    );
    preloadedVideos.value.set(backKey, backVideo);

    if (pokemon.shiny !== undefined) {
      const shinyBackSrc = generateImageSrc(pokemon.image, 'back', true);
      const shinyBackVideo = document.createElement('video');
      shinyBackVideo.src = shinyBackSrc;
      shinyBackVideo.loop = true;
      shinyBackVideo.muted = true;
      shinyBackVideo.preload = 'metadata';
      const shinyBackKey = `${pokemon.image}-back-true`;
      videoPromises.push(
        new Promise((resolve) => {
          shinyBackVideo.oncanplaythrough = () => {
            loadedVideos.value.add(shinyBackKey);
            resolve();
          };
          shinyBackVideo.onerror = () => resolve();
        }),
      );
      preloadedVideos.value.set(shinyBackKey, shinyBackVideo);
    }
  });

  await Promise.all(videoPromises);
});
</script>

<template>
  <div class="animated-sprite__container" :style="{ width: `${ratio}%` }">
    <div
      v-if="!isCurrentPokemonLoaded && pokemonSprite?.pokemon"
      class="animated-sprite__skeleton"
    ></div>
    <template v-else v-for="[key, video] in preloadedVideos" :key="key">
      <video
        ref="videoEl"
        loop
        autoplay
        muted
        :class="[
          `animated-sprite animated-sprite--${pokemonSprite?.side}`,
          { 'animated-sprite--damaged': pokemonSprite?.receiveDamage },
          { 'animated-sprite--ko': pokemonSprite?.ko },
        ]"
        :src="video.src"
        :style="{
          display: currentPokemonKey === key ? 'block' : 'none',
        }"
      />
    </template>
  </div>
</template>
