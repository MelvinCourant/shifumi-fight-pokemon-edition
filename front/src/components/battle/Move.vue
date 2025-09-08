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
  <button
    class="move"
    @click="$emit('moveSelected', move.id)"
    :disabled="move.pp === 0"
  >
    <h3 class="move__title">{{ move.name }}</h3>
    <p class="move__pp">{{ move.pp }}/{{ move.maxPp }}</p>
    <img
      class="move__background"
      :src="generateImageSrc(move.image)"
      :alt="move.title"
    />
  </button>
</template>
