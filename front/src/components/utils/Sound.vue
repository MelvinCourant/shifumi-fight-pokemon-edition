<script setup>
import '../../assets/css/components/utils/_sound.scss';
import { watch } from 'vue';

const props = defineProps({
  sound: {
    type: String,
    required: true,
  },
  attributes: {
    type: Object,
    default: () => ({}),
  },
  play: {
    type: Boolean,
    default: false,
  },
});

function generateSoundUrl(sound) {
  return `/audios/${sound}.mp3`;
}

watch(
  () => props.play,
  (value) => {
    if (value) {
      const audio = document.querySelector(`#${props.attributes.id}`);
      audio.currentTime = 0;
      audio.play();
    }
  },
);
</script>

<template>
  <audio
    class="sound"
    :src="generateSoundUrl(sound)"
    v-bind="attributes"
  ></audio>
</template>
