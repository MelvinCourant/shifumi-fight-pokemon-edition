<script setup>
defineProps({
  pokemon: {
    type: String,
    required: true
  }
});

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

</script>

<template>
  <img
    class="pc-sprite"
    :src="`src/assets/imgs/pc-sprites/${pokemon}.png`"
    :alt="`${capitalizeFirstLetter(pokemon)} sprite`"
  >
</template>