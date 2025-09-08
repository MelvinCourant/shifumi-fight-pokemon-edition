import { ref } from 'vue';
import { defineStore } from 'pinia';

export const usePcBoxStore = defineStore('sf-pc-box', () => {
  let localStorageBox = null;

  if (localStorage.getItem('sf-pc-box')) {
    localStorageBox = JSON.parse(localStorage.getItem('sf-pc-box') || '[]');
  }

  const box = ref([]);

  if (localStorageBox) {
    box.value = localStorageBox;
  }

  function updateBox(newBox) {
    box.value = newBox;
    localStorage.setItem('sf-pc-box', JSON.stringify(box.value));
  }

  return {
    box,
    updateBox,
  };
});
