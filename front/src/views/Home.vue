<script setup>
import '../assets/css/views/_home.scss';
import BattleZone from '../components/battle/BattleZone.vue';
import { provide, ref } from 'vue';
import Button from '../components/inputs/Button.vue';
import { useUserStore } from '../stores/user.js';
import { useHistoryStore } from '../stores/history.js';
import { useRouter } from 'vue-router';
import Rules from '../components/home/Rules.vue';
import PokemonsJson from '../data/pokemons.json';
import Settings from '../components/inputs/Settings.vue';
import Credits from '../components/home/Credits.vue';
import History from '../components/home/History.vue';

defineEmits(['updateInteractionSound']);

const userStore = useUserStore();
const user = userStore.user;
const { displayFightsFinished, lastFightInProgress } = useHistoryStore();
const history = displayFightsFinished();
const lastFight = lastFightInProgress();
const router = useRouter();
const pseudo = ref(user.pseudo ? user.pseudo : 'Joueur');
const pokemonSprite = ref({
  pokemon: user.pokemon.pokemonName || '',
  side: 'front',
  shiny: user.pokemon.shiny || false,
});

provide('pokemonSprite', pokemonSprite);

if (!user.pokemon.pokemonName) {
  generateRandomPokemon();
}

async function generateRandomPokemon() {
  const generatedPokemon =
    PokemonsJson[Math.floor(Math.random() * PokemonsJson.length)].image;

  pokemonSprite.value = {
    pokemon: generatedPokemon,
    side: 'front',
    shiny: await pokemonIsShinyOrNot(generatedPokemon),
  };
}

async function pokemonIsShinyOrNot(pokemon) {
  const shinyChance = Math.floor(Math.random() * (1096 - 1 + 1)) + 1;

  if (shinyChance === 1096) {
    userStore.updateUser({
      pseudo: pseudo.value,
      pokemon: {
        pokemonName: pokemon,
        shiny: true,
      },
    });
  }

  return shinyChance === 1096;
}

async function newGame() {
  if (!user.pseudo || !user.pokemon.pokemonName) {
    userStore.updateUser({
      pseudo: pseudo.value,
      pokemon: {
        pokemonName: pokemonSprite.value.pokemon,
        shiny: pokemonSprite.value.shiny,
      },
    });
  }

  await router.push({
    name: 'Fight',
  });
}
</script>

<template>
  <main class="home">
    <header class="home__header">
      <Rules @updateInteractionSound="$emit('updateInteractionSound', $event)">
        <h2>Règles du jeu</h2>
        <div>
          <p>
            Ce jeu est un tour par tour inspiré du Shifumi (aussi connu sous le
            nom de Pierre Feuille Ciseaux) ... mais dans un combat Pokémon !
          </p>
          <p>
            Au début de chaque tour vous avez le choix entre 4 attaques: Pierre,
            Feuille, Ciseaux ou Puits (oui il est autorisé ici), pour rappel:
          </p>
          <ul>
            <li>
              L’attaque Pierre est super efficace contre l’attaque Ciseaux
            </li>
            <li>
              L’attaque Feuille est super efficace contre l’attaque Pierre et
              Puits
            </li>
            <li>
              L’attaque Ciseaux est super efficace contre l’attaque Feuille
            </li>
            <li>
              L’attaque Puits est super efficace contre les attaques Pierre et
              Ciseaux
            </li>
          </ul>
          <p>
            Une attaque super efficace inflige des dégâts au Pokémon adverse.
            L’attaque Puits est limitée à une seule utilisation par combat. En
            cas d’égalité les deux joueurs perdent tout les deux des PV.
          </p>
          <p>
            Le premier à mettre les PV du Pokémon adverse à 0 gagne le combat !
          </p>
          <p>
            PS: si vous avez la chance d’infliger un coup critique, les dégâts
            sont multipliés par deux.
          </p>
        </div>
      </Rules>
      <h1 class="home__title">Shifumi Fight <span>Pokémon Edition</span></h1>
      <Settings
        @updateInteractionSound="$emit('updateInteractionSound', $event)"
      />
    </header>
    <section class="home__party">
      <div class="home__left">
        <BattleZone :pseudo="pseudo" />
        <History
          :history="history"
          @updateInteractionSound="$emit('updateInteractionSound', $event)"
        />
      </div>
      <div class="home__right">
        <Button
          :text="
            lastFight && lastFight.inProgress ? 'Reprendre' : 'Nouvelle partie'
          "
          :background="'red'"
          size="big"
          @click="newGame"
          @updateInteractionSound="$emit('updateInteractionSound', $event)"
        />
        <Button
          text="Boîte PC"
          :background="'green'"
          size="big"
          :link="`/pc?pokemon=${pokemonSprite.pokemon}`"
          @updateInteractionSound="$emit('updateInteractionSound', $event)"
        />
      </div>
    </section>
    <a
      class="developer"
      href="https://melvincourant.fr"
      target="_blank"
      title="Aller sur le site du développeur: Melvin Courant"
    >
      <img src="../assets/imgs/logo.jpg" alt="Logo Melvin Courant" />
    </a>
    <Credits
      @updateInteractionSound="$emit('updateInteractionSound', $event)"
    />
  </main>
</template>
