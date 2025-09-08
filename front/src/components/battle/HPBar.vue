<script setup>
import '../../assets/css/components/battle/_hp-bars.scss';
import { computed, inject, ref, watch } from 'vue';

const props = defineProps({
  player: {
    type: Object,
    required: true,
  },
});

const maxHP = inject('maxHP');
const HPLevel = ref(100);
const background = computed(() => {
  if (HPLevel.value < 50) {
    return 'red';
  } else {
    return 'green';
  }
});

function generateImageSrc(role) {
  return new URL(
    `../../assets/imgs/hp-bars/hp-bar${role === 'enemy' ? '-enemy' : ''}.png`,
    import.meta.url,
  ).href;
}

watch(props.player, () => {
  HPLevel.value = (props.player.hp * 100) / maxHP;
});
</script>

<template>
  <div :class="['hp-bar', `hp-bar--${player.role}`]">
    <h2 class="hp-bar__pseudo">{{ player.pseudo }}</h2>
    <div class="hp-bar__hp-number" v-if="player.role === 'player'">
      <span>{{ player.hp }}</span
      ><span>{{ maxHP }}</span>
    </div>
    <p class="hp-bar__level">100</p>
    <div class="hp-bar__gauge">
      <span
        :class="['hp-bar__gauge-level', `hp-bar__gauge-level--${background}`]"
        :style="{ transform: `scaleX(${HPLevel / 100})` }"
      ></span>
    </div>
    <img :src="generateImageSrc(player.role)" alt="HP bar" />
  </div>
</template>
