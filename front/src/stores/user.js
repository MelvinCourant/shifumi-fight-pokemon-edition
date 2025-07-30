import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('sf-user', () => {
  let localStorageUser = null;

  if (localStorage.getItem('sf-user')) {
    localStorageUser = JSON.parse(localStorage.getItem('sf-user') || '{}');
  }

  let pseudo = '';
  let pokemon = {
    pokemonName: '',
    shiny: false
  };
  const user = ref({});

  user.value = {
    pseudo: pseudo,
    pokemon: pokemon,
  };

  if (localStorageUser) {
    pseudo = localStorageUser.pseudo;
    pokemon = localStorageUser.pokemon;

    user.value = {
      pseudo: pseudo,
      pokemon: pokemon,
    };
  }

  function updateUser(newUser) {
    for (let key in newUser) {
      user.value[key] = newUser[key];
    }

    localStorage.setItem('sf-user', JSON.stringify(user.value));
  }

  return {
    user,
    updateUser,
  };
});
