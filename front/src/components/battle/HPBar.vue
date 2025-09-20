<script setup>
import '../../assets/css/components/battle/_hp-bars.scss';
import { computed, inject, ref, watch } from 'vue';

const props = defineProps({
  player: {
    type: Object,
    required: true,
  },
});

const maxHp = inject('maxHp');
const HPLevel = ref((props.player.hp * 100) / maxHp);
const background = computed(() => {
  if (HPLevel.value < 50) {
    return 'red';
  } else {
    return 'green';
  }
});

function generateImageSrc(role) {
  return `/imgs/hp-bars/hp-bar${role === 'enemy' ? '-enemy' : ''}.webp`;
}

watch(props.player, () => {
  HPLevel.value = (props.player.hp * 100) / maxHp;
});
</script>

<template>
  <div :class="['hp-bar', `hp-bar--${player.role}`]">
    <h2 class="hp-bar__pseudo">{{ player.pseudo }}</h2>
    <div class="hp-bar__hp-number" v-if="player.role === 'player'">
      <span>{{ player.hp }}</span
      ><span>{{ maxHp }}</span>
    </div>
    <p class="hp-bar__level">100</p>
    <div class="hp-bar__gauge">
      <span
        :class="['hp-bar__gauge-level', `hp-bar__gauge-level--${background}`]"
        :style="{ transform: `scaleX(${HPLevel / 100})` }"
      ></span>
    </div>
    <img
      :width="player.role === 'enemy' ? 477 : 500"
      :src="generateImageSrc(player.role)"
      alt="HP bar"
    />
  </div>
</template>
