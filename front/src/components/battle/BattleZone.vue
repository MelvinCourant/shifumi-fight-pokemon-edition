<script setup>
import '../../assets/css/components/battle/_battle-zone.scss';
import AnimatedSprite from '../sprites/AnimatedSprite.vue';
import { inject, provide, ref, useTemplateRef } from 'vue';

const props = defineProps({
  pokemonSprite: {
    type: Object,
    default: () => ({}),
  },
  pseudo: {
    type: String,
    default: '',
  },
});

const pokemonSprite =
  Object.keys(props.pokemonSprite).length > 0
    ? props.pokemonSprite
    : inject('pokemonSprite');
const isMobileOrTablet = ref(false);
const battleZone = useTemplateRef('.battle-zone__image');

if (props.pokemonSprite) {
  provide('pokemonSprite', pokemonSprite);

  if (window.innerWidth <= 1024) {
    isMobileOrTablet.value = true;
  } else {
    isMobileOrTablet.value = false;
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 1024 && isMobileOrTablet.value === false) {
      isMobileOrTablet.value = true;

      if (battleZone.value) {
        battleZone.value.src = generateImageSrc(pokemonSprite.side);
      }
    } else if (window.innerWidth > 1024 && isMobileOrTablet.value === true) {
      isMobileOrTablet.value = false;

      if (battleZone.value) {
        battleZone.value.src = generateImageSrc(pokemonSprite.side);
      }
    }
  });
}

function generateImageSrc(side) {
  if (!isMobileOrTablet.value) {
    return `/imgs/battle-zone-${side === 'front' ? '2' : '1'}.webp`;
  } else {
    return `/imgs/battle-zone-${side === 'front' ? '2' : '1'}-tablet-mobile.webp`;
  }
}
</script>

<template>
  <div :class="`battle-zone battle-zone--${pokemonSprite.side}`">
    <div class="battle-zone__sprite">
      <p class="battle-zone__pseudo" v-if="pseudo">{{ pseudo }}</p>
      <AnimatedSprite :ratio="pokemonSprite.ratio" />
    </div>
    <img
      class="battle-zone__image"
      :src="generateImageSrc(pokemonSprite.side)"
      alt="Battle Zone"
    />
  </div>
</template>
