<script setup>
import '../../assets/css/components/inputs/_range.scss';
import { ref, watch } from 'vue';

const props = defineProps({
  attributes: {
    type: Object,
    default: {
      min: 0,
      max: 100,
      value: 50,
    },
  },
});

const linearGradient = ref(
  `linear-gradient(to right, var(--bar-green) ${props.attributes.value - props.attributes.min}%, var(--bar-white) ${props.attributes.value}%)`,
);

watch(
  () => props.attributes.value,
  (value) => {
    linearGradient.value = `linear-gradient(to right, var(--bar-green) calc(${value - props.attributes.min}% + 10px), var(--bar-white) calc(${value + 10}% + 10px))`;
  },
);

defineEmits(['input']);
</script>

<template>
  <input
    type="range"
    class="range"
    v-bind="attributes"
    :style="`background: ${linearGradient};`"
    @input="$emit('input', $event.target.value)"
  />
</template>
