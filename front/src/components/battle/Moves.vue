<script setup>
import { inject, ref } from 'vue';
import Move from './Move.vue';

const moves = ref(inject('moves'));
</script>

<template>
  <ul class="moves">
    <li class="moves__move" v-for="move in moves" :key="move.id">
      <Move :move="move" />
    </li>
  </ul>
</template>
