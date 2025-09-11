<script setup>
import '../../assets/css/components/inputs/_button.scss';

defineProps({
  text: {
    type: String,
    default: 'Button',
  },
  background: {
    type: String,
    default: 'red',
  },
  size: {
    type: String,
    default: 'big',
  },
  link: {
    type: String,
    default: '',
  },
});

defineEmits(['updateInteractionSound']);
</script>

<template>
  <button
    v-if="!link"
    :class="`button button--${background} button--${size}`"
    @mousedown="$emit('updateInteractionSound', false)"
    @click="$emit('updateInteractionSound', true)"
  >
    {{ text }}
  </button>
  <router-link
    v-else
    :to="link"
    :class="`button button--${background} button--${size}`"
    @mousedown="$emit('updateInteractionSound', false)"
    @click="$emit('updateInteractionSound', true)"
  >
    {{ text }}
  </router-link>
</template>
