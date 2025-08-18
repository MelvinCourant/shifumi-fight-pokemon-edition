<script setup>
import '../../assets/css/components/battle/_battle-zone.scss';
import AnimatedSprite from '../sprites/AnimatedSprite.vue';
import { inject, provide, ref } from 'vue';

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
const battleWidth = ref(pokemonSprite.side === 'back' ? 1000 : 460);
const pokemonWidth = ref('auto');

if (props.pokemonSprite) {
  provide('pokemonSprite', pokemonSprite);
}

function calculatePokemonRatio(width) {
  const ratio = (width / battleWidth.value) * 100;
  pokemonWidth.value = `${ratio}%`;
}

function generateImageSrc(side) {
  return new URL(
    `../../assets/imgs/battle-zone-${side === 'front' ? '2' : '1'}.png`,
    import.meta.url,
  ).href;
}
</script>

<template>
  <div :class="`battle-zone battle-zone--${pokemonSprite.side}`">
    <div class="battle-zone__sprite">
      <p class="battle-zone__pseudo" v-if="pseudo">{{ pseudo }}</p>
      <AnimatedSprite
        :style="`width: ${pokemonWidth}`"
        @imageSizeGot="calculatePokemonRatio($event)"
      />
    </div>
    <img
      class="battle-zone__image"
      :src="generateImageSrc(pokemonSprite.side)"
      alt="Battle Zone"
    />
  </div>
</template>
