<script setup>
import '../../assets/css/components/battle/_move.scss';
defineProps({
  move: {
    type: Array,
    required: true,
  },
});
defineEmits(['moveSelected']);

function generateImageSrc(move) {
  return new URL(`../../assets/imgs/moves/${move}.svg`, import.meta.url).href;
}
</script>

<template>
  <div class="move" @click="$emit('moveSelected', move.id)">
    <h3 class="move__title">{{ move.title }}</h3>
    <p class="move__pp">{{ move.PP }}/{{ move.maxPP }}</p>
    <img
      class="move__background"
      :src="generateImageSrc(move.image)"
      :alt="move.title"
    />
  </div>
</template>
