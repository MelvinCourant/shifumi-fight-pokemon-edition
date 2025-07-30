<script setup>
import '../../assets/css/components/utils/_text-box.scss'

defineProps({
  side: {
    type: String,
    default: 'bottom'
  },
})
</script>

<template>
  <div :class="`text-box text-box--${side}`">
    <slot></slot>
  </div>
</template>