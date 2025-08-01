<script setup>
import '../../assets/css/components/inputs/_input.scss';
import { inject } from 'vue';

defineEmits(['input']);

const attributes = inject('inputAttributes');
</script>

<template>
  <div class="input">
    <input
      v-bind="attributes"
      class="input__field"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>
