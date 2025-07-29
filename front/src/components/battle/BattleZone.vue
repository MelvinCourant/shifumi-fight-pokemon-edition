<script setup lang="ts">
import '../../assets/css/components/battle/_battle-zone.scss'
import AnimatedSprite from "../pokemon/AnimatedSprite.vue";
import {inject} from "vue";

const pokemonSprite = inject('pokemonSprite');

defineProps({
  pseudo: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="battle-zone">
    <div class="battle-zone__sprite">
      <p class="battle-zone__pseudo" v-if="pseudo">{{ pseudo }}</p>
      <AnimatedSprite/>
    </div>
    <img
      class="battle-zone__image"
      :src="`src/assets/imgs/battle-zone-${pokemonSprite.side === 'front' ? '2' : '1'}.png`"
      alt="Battle Zone"
    >
  </div>
</template>