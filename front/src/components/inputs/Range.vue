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

if (props.attributes.value < 7) {
  linearGradient.value = `linear-gradient(to right, var(--bar-green) calc(${props.attributes.value - props.attributes.min}% + 10px), var(--bar-white) calc(${props.attributes.value}% + 10px))`;
} else if (props.attributes.value > 90) {
  linearGradient.value = `linear-gradient(to right, var(--bar-green) calc(${props.attributes.value - props.attributes.min}% - 10px), var(--bar-white) calc(${props.attributes.value}% - 10px))`;
}

watch(
  () => props.attributes.value,
  (value) => {
    if (value < 7) {
      linearGradient.value = `linear-gradient(to right, var(--bar-green) calc(${value - props.attributes.min}% + 10px), var(--bar-white) calc(${value}% + 10px))`;
    } else if (value > 90) {
      linearGradient.value = `linear-gradient(to right, var(--bar-green) calc(${value - props.attributes.min}% - 10px), var(--bar-white) calc(${value}% - 10px))`;
    } else {
      linearGradient.value = `linear-gradient(to right, var(--bar-green) ${value - props.attributes.min}%, var(--bar-white) ${value}%)`;
    }
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
