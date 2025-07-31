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
  link: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <button
    v-if="!link"
    :class="`button button--${background} button--${size}`"
  >
    {{ text }}
  </button>
  <router-link
    v-else
    :to="link"
    :class="`button button--${background} button--${size}`"
  >
    {{ text }}
  </router-link>
</template>