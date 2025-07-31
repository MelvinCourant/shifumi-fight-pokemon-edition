<script setup>
import '../../assets/css/components/battle/_battle-zone.scss'
import AnimatedSprite from "../sprites/AnimatedSprite.vue";
import {inject, ref} from "vue";

defineProps({
  pseudo: {
    type: String,
    default: ''
  }
})

const pokemonSprite = inject('pokemonSprite');
const battleWidth = ref(460);
const pokemonWidth = ref('auto');

function calculatePokemonRatio(width) {
  const ratio = (width / battleWidth.value) * 100;
  pokemonWidth.value = `${ratio}%`;
}
</script>

<template>
  <div class="battle-zone">
    <div class="battle-zone__sprite">
      <p class="battle-zone__pseudo" v-if="pseudo">{{ pseudo }}</p>
      <AnimatedSprite
        :style="`width: ${pokemonWidth}`"
        @imageSizeGot="calculatePokemonRatio($event)"
      />
    </div>
    <img
      class="battle-zone__image"
      :src="`src/assets/imgs/battle-zone-${pokemonSprite.side === 'front' ? '2' : '1'}.png`"
      alt="Battle Zone"
    >
  </div>
</template>