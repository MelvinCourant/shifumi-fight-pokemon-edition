<script setup>
import '../../assets/css/components/battle/_battle-zone.scss';
import AnimatedSprite from '../sprites/AnimatedSprite.vue';
import { inject, provide } from 'vue';

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

if (props.pokemonSprite) {
  provide('pokemonSprite', pokemonSprite);
}

function generateImageSrc(side) {
  return `/imgs/battle-zone-${side === 'front' ? '2' : '1'}.png`;
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
