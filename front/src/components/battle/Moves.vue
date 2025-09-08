<script setup>
import '../../assets/css/components/battle/_moves.scss';
import { inject, ref } from 'vue';
import Move from './Move.vue';

const moves = ref(inject('moves'));
const step = ref(inject('step'));
defineEmits(['moveSelected']);
</script>

<template>
  <ul :class="['moves', { 'moves--hidden': step !== 'choice' }]">
    <li class="moves__move" v-for="move in moves" :key="move.id">
      <Move :move="move" @moveSelected="$emit('moveSelected', $event)" />
    </li>
  </ul>
</template>
