import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useHistoryStore = defineStore('sf-history', () => {
  let localStorageHistory = null;

  if (localStorage.getItem('sf-history')) {
    localStorageHistory = JSON.parse(
      localStorage.getItem('sf-history') || '[]',
    );
  }

  const history = ref([]);

  if (localStorageHistory) {
    history.value = localStorageHistory;
  }

  function addFightInHistory(fight) {
    history.value.push({
      id: fight.id,
      result: fight.result,
      player: fight.player,
      playerHp: fight.playerHp,
      enemy: fight.enemy,
      enemyHp: fight.enemyHp,
      enemyPokemon: fight.enemyPokemon,
      inProgress: fight.inProgress,
    });
    localStorage.setItem('sf-history', JSON.stringify(history.value));
  }

  function updateFightInHistory(fight) {
    history.value.forEach((item) => {
      if (item.id === fight.id) {
        for (let property in fight) {
          item[property] = fight[property];
        }
      }
    });

    localStorage.setItem('sf-history', JSON.stringify(history.value));
  }

  function lastFightInProgress() {
    return history.value[history.value.length - 1];
  }

  function displayFightsFinished() {
    return history.value.filter((fight) => !fight.inProgress);
  }

  return {
    history,
    addFightInHistory,
    updateFightInHistory,
    displayFightsFinished,
    lastFightInProgress,
  };
});
