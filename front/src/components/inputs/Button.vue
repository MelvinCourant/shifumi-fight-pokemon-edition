<script setup >
import '../../assets/css/components/inputs/_button.scss';

defineProps({
  text: {
    type: String,
    default: 'Button'
  },
  background: {
    type: String,
    default: 'red'
  },
  size: {
    type: String,
    default: 'big'
  },
})
</script>

<template>
  <button
    :class="`button button--${background} button--${size}`"
  >
    {{ text }}
  </button>
</template>