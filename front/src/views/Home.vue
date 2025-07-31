<script setup>
import '../assets/css/views/_home.scss';
import BattleZone from "../components/battle/BattleZone.vue";
import {provide, reactive, ref} from "vue";
import Button from "../components/inputs/Button.vue";
import {useUserStore} from "../stores/user.js";
import Rules from "../components/home/Rules.vue";
import PokemonsJson from '../data/pokemons.json';

const userStore = useUserStore();
const user = userStore.user;
const pseudo = ref(user.pseudo ? user.pseudo : 'Joueur');
const pokemonSprite = ref({
  pokemon: user.pokemon.pokemonName || '',
  side: 'front',
  shiny: user.pokemon.shiny || false,
});

provide('pokemonSprite', pokemonSprite);

if(!user.pokemon.pokemonName) {
  generateRandomPokemon();
}

async function generateRandomPokemon() {
  const generatedPokemon = PokemonsJson[Math.floor(Math.random() * PokemonsJson.length)].image;

  pokemonSprite.value = {
    pokemon: generatedPokemon,
    side: 'front',
    shiny: await pokemonIsShinyOrNot(generatedPokemon)
  };
}

async function pokemonIsShinyOrNot(pokemon) {
  const shinyChance = Math.floor(Math.random() * (1096 - 1 + 1)) + 1;

  if(shinyChance=== 1096) {
    userStore.updateUser({
      pseudo: pseudo.value,
      pokemon: {
        pokemonName: pokemon,
        shiny: true
      }
    });
  }

  return shinyChance === 1096;
}
</script>

<template>
  <main class="home">
    <header class="home__header">
      <Rules>
        <h2>Règles du jeu</h2>
        <div>
          <p>Ce jeu est un tour par tour inspiré du Shifumi (aussi connu sous le nom de Pierre Feuille Ciseaux) ... mais dans un combat Pokémon !</p>
          <p>Au début de chaque tour vous avez le choix entre 4 attaques: Pierre, Feuille, Ciseaux ou Puits (oui il est autorisé ici), pour rappel:</p>
          <ul>
            <li>L’attaque Pierre est super efficace contre l’attaque Ciseaux</li>
            <li>L’attaque Feuille est super efficace contre l’attaque Pierre et Puits</li>
            <li>L’attaque Ciseaux est super efficace contre l’attaque Feuille</li>
            <li>L’attaque Puits est super efficace contre les attaques Pierre et Ciseaux</li>
          </ul>
          <p>Une attaque super efficace inflige des dégâts au Pokémon adverse. L’attaque Puits est limitée à une seule utilisation par combat. En cas d’égalité les deux joueurs perdent tout les deux des PV.</p>
          <p>Le premier à mettre les PV du Pokémon adverse à 0 gagne le combat !</p>
          <p>PS: si vous avez la chance d’infliger un coup critique, les dégâts sont multipliés par deux.</p>
        </div>
      </Rules>
      <h1 class="home__title">Shifumi Fight <span>Pokémon Edition</span></h1>
      <svg class="settings" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M43.7502 20.8333V18.75H41.6668V14.5833H43.7502V10.4167H41.6668V8.33333H39.5835V6.25H35.4168V8.33333H31.2502V6.25H29.1668V2.08333H20.8335V6.25H18.7502V8.33333H14.5835V6.25H10.4168V8.33333H8.3335V10.4167H6.25016V14.5833H8.3335V18.75H6.25016V20.8333H2.0835V29.1667H6.25016V31.25H8.3335V35.4167H6.25016V39.5833H8.3335V41.6667H10.4168V43.75H14.5835V41.6667H18.7502V43.75H20.8335V47.9167H29.1668V43.75H31.2502V41.6667H35.4168V43.75H39.5835V41.6667H41.6668V39.5833H43.7502V35.4167H41.6668V31.25H43.7502V29.1667H47.9168V20.8333H43.7502ZM20.8335 20.8333V18.75H29.1668V20.8333H31.2502V29.1667H29.1668V31.25H20.8335V29.1667H18.7502V20.8333H20.8335Z" fill="var(--white)"/>
      </svg>
    </header>
    <section class="home__party">
      <div class="home__left">
        <BattleZone :pseudo="pseudo"/>
        <Button text="Historique" :background="'blue'" size="small"/>
      </div>
      <div class="home__right">
        <Button text="Nouvelle partie" :background="'red'" size="big"/>
        <Button text="Boîte PC" :background="'green'" size="big" link="/pc"/>
      </div>
    </section>
  </main>
</template>