<script setup>
import '../../assets/css/components/battle/_hud.scss';
import Moves from './Moves.vue';
import HPBar from './HPBar.vue';

defineProps({
  player: {
    type: Object,
    required: true,
  },
});
defineEmits(['moveSelected']);
</script>

<template>
  <div class="hud">
    <HPBar :player="player" />
    <Moves
      v-if="player.role === 'player'"
      @moveSelected="$emit('moveSelected', $event)"
    />
  </div>
</template>
