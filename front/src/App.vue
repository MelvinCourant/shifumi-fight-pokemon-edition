<script setup>
import './assets/css/main.scss';
import { onMounted, reactive, ref, watch } from 'vue';
import { useSettingsStore } from './stores/settings.js';
import { useRoute } from 'vue-router';
import Sound from './components/utils/Sound.vue';

const settingsStore = useSettingsStore();
const { settings } = settingsStore;
const route = useRoute();
const musicAttributes = reactive({
  loop: true,
  controls: true,
  volume: settings.musicVolume,
  id: 'music',
});
const sound = ref(route.meta.sound);
const play = ref(false);

function activeMusic() {
  if (!play.value) {
    play.value = true;
  }

  document.body.removeEventListener('click', activeMusic);
}

watch(settings, (value) => {
  musicAttributes.volume = value.musicVolume;
});

watch(route, (value) => {
  const newSound = value.meta.sound;

  if (newSound !== sound.value) {
    sound.value = newSound;

    if (play.value && newSound) {
      play.value = false;

      setTimeout(() => {
        play.value = true;
      }, 100);
    }
  }
});

onMounted(() => {
  document.body.addEventListener('click', activeMusic);
});
</script>

<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
  <Sound :sound="sound" :attributes="musicAttributes" :play="play" />
</template>
