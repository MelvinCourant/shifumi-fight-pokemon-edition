<script setup>
defineProps({
  pokemon: {
    type: String,
    required: true,
  },
});

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function generateImageSrc(pokemon) {
  return new URL(
    `../../assets/imgs/pc/pc-sprites/${pokemon}.png`,
    import.meta.url,
  ).href;
}
</script>

<template>
  <img
    class="pc-sprite"
    :src="generateImageSrc(pokemon)"
    loading="lazy"
    :alt="`${capitalizeFirstLetter(pokemon)} sprite`"
  />
</template>
