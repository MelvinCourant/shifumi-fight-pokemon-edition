<script setup>
import '../assets/css/views/_fight.scss';
import BattleZone from '../components/battle/BattleZone.vue';
import HUD from '../components/battle/HUD.vue';
import { useUserStore } from '../stores/user.js';
import { useHistoryStore } from '../stores/history.js';
import { provide, reactive, ref } from 'vue';
import CharactersJson from '../data/characters.json';
import PokemonsJson from '../data/pokemons.json';
import TextBox from '../components/utils/TextBox.vue';
import Button from '../components/inputs/Button.vue';
import { v4 as uuidv4 } from 'uuid';

const userStore = useUserStore();
const user = userStore.user;
const { addFightInHistory, updateFightInHistory, lastFightInProgress } =
  useHistoryStore();
const lastFight = lastFightInProgress();
const fightUuid = ref('');
const moves = reactive([
  {
    id: 0,
    name: 'Pierre',
    pp: 4,
    maxPp: 4,
    image: 'pierre',
    highlyEffective: [2],
  },
  {
    id: 1,
    name: 'Feuille',
    pp: 4,
    maxPp: 4,
    image: 'feuille',
    highlyEffective: [0, 3],
  },
  {
    id: 2,
    name: 'Ciseaux',
    pp: 4,
    maxPp: 4,
    image: 'ciseaux',
    highlyEffective: [1],
  },
  {
    id: 3,
    name: 'Puits',
    pp: 1,
    maxPp: 1,
    image: 'puits',
    highlyEffective: [0, 2],
  },
]);
const maxHp = 300;
const playerSprite = ref({
  pokemon: user.pokemon.pokemonName,
  side: 'back',
  shiny: user.pokemon.shiny,
  receiveDamage: false,
  ko: false,
});
const enemySprite = ref({
  pokemon: '',
  side: 'front',
  shiny: false,
  receiveDamage: false,
  ko: false,
});
const player = reactive({
  role: 'player',
  pseudo: user.pseudo,
  hp: maxHp,
});
const enemy = reactive({
  role: 'enemy',
  pseudo: '',
  hp: maxHp,
});
const step = ref('choice');
const dialog = ref('');

provide('moves', moves);
provide('maxHp', maxHp);
provide('step', step);

if (lastFight && lastFight.inProgress) {
  fightUuid.value = lastFight.id;
  player.hp = lastFight.playerHp;
  enemySprite.value.pokemon = lastFight.enemyPokemon;
  enemy.pseudo = lastFight.enemy;
  enemy.hp = lastFight.enemyHp;
} else {
  generateRandomPokemon(user.pokemon.pokemonName);
  generateEnemy();
  fightUuid.value = uuidv4();
  addFightInHistory({
    id: fightUuid.value,
    player: player.pseudo,
    playerHp: player.hp,
    enemy: enemy.pseudo,
    enemyHp: enemy.hp,
    enemyPokemon: enemySprite.value.pokemon,
    inProgress: true,
  });
}

function generateEnemy() {
  enemy.pseudo =
    CharactersJson[Math.floor(Math.random() * CharactersJson.length)].name;
}

function generateRandomPokemon(playerPokemon) {
  const availablePokemons = PokemonsJson.filter(
    (pokemon) => pokemon.image !== playerPokemon,
  );
  enemySprite.value.pokemon =
    availablePokemons[
      Math.floor(Math.random() * availablePokemons.length)
    ].image;
}

function attack(moveId) {
  if (step.value !== 'choice') return;

  const playerMove = moves.find((move) => move.id === moveId);

  if (playerMove.pp === 0) return;

  playerMove.pp -= 1;

  const enemyMove = AIAttack();
  const dmgInfliged = 100;

  if (playerMove.highlyEffective.includes(enemyMove.id)) {
    if (!criticalHitOrNot()) {
      enemy.hp -= dmgInfliged;
      dialog.value = `${enemy.pseudo} utilise ${enemyMove.name} ... mais vous utilisez ${playerMove.name}, c’est super
        efficace !`;
    } else {
      if (enemy.hp - dmgInfliged * 2 < 0) {
        enemy.hp = 0;
      } else {
        enemy.hp -= dmgInfliged * 2;
      }
      dialog.value = `${enemy.pseudo} utilise ${enemyMove.name} ... mais vous utilisez ${playerMove.name}, c’est super
        efficace ! Coup critique !`;
    }

    sendFightInHistory();
    enemySprite.value.receiveDamage = true;

    setTimeout(() => {
      enemySprite.value.receiveDamage = false;
    }, 1000);
  } else if (enemyMove.highlyEffective.includes(playerMove.id)) {
    if (!criticalHitOrNot()) {
      player.hp -= dmgInfliged;
      dialog.value = `Vous utilisez ${playerMove.name} ... mais ${enemy.pseudo} utilise ${enemyMove.name}, c’est super
        efficace !`;
    } else {
      if (player.hp - dmgInfliged * 2 < 0) {
        player.hp = 0;
      } else {
        player.hp -= dmgInfliged * 2;
      }

      dialog.value = `Vous utilisez ${playerMove.name} ... mais ${enemy.pseudo} utilise ${enemyMove.name}, c’est super
        efficace ! Coup critique !`;
    }

    sendFightInHistory();
    playerSprite.value.receiveDamage = true;

    setTimeout(() => {
      playerSprite.value.receiveDamage = false;
    }, 1000);
  } else {
    player.hp -= dmgInfliged;
    enemy.hp -= dmgInfliged;
    dialog.value = `Vous et ${enemy.pseudo} utilisez ${playerMove.name}, le choc vous infligent des dégâts ...`;
    sendFightInHistory();
    playerSprite.value.receiveDamage = true;
    enemySprite.value.receiveDamage = true;

    setTimeout(() => {
      playerSprite.value.receiveDamage = false;
      enemySprite.value.receiveDamage = false;
    }, 1000);
  }

  function sendFightInHistory() {
    if (player.hp === 0 && enemy.hp === 0) {
      updateFightInHistory({
        id: fightUuid.value,
        result: 'Egalité',
        playerHp: player.hp,
        enemyHp: enemy.hp,
        inProgress: false,
      });
    } else if (player.hp === 0) {
      updateFightInHistory({
        id: fightUuid.value,
        result: 'Défaite',
        playerHp: player.hp,
        enemyHp: enemy.hp,
        inProgress: false,
      });
    } else if (enemy.hp === 0) {
      updateFightInHistory({
        id: fightUuid.value,
        result: 'Victoire',
        playerHp: player.hp,
        enemyHp: enemy.hp,
        inProgress: false,
      });
    } else {
      updateFightInHistory({
        id: fightUuid.value,
        playerHp: player.hp,
        enemyHp: enemy.hp,
      });
    }
  }

  step.value = 'attack';
}

function AIAttack() {
  return moves[Math.floor(Math.random() * moves.length)];
}

function criticalHitOrNot() {
  return Math.random() < 0.0417;
}

function nextStep() {
  if (step.value === 'choice') return;

  if (player.hp > 0 && enemy.hp > 0) {
    step.value = 'choice';
  } else if (player.hp === 0 && enemy.hp === 0) {
    playerSprite.value.ko = true;
    enemySprite.value.ko = true;
    step.value = 'fight-finished';
    dialog.value = `Vous et ${enemy.pseudo} êtes K.O. ! Match nul`;
  } else if (player.hp === 0) {
    playerSprite.value.ko = true;
    step.value = 'fight-finished';
    dialog.value = `Vous êtes K.O ! ${enemy.pseudo} a gagné !`;
  } else if (enemy.hp === 0) {
    enemySprite.value.ko = true;
    step.value = 'fight-finished';
    dialog.value = `${enemy.pseudo} est K.O. ! Vous avez gagné !`;
  }

  if (step.value === 'fight-finished') {
    step.value = 'end';
  }
}

function restart() {
  fightUuid.value = uuidv4();
  moves.forEach((move) => {
    move.pp = move.maxPp;
  });
  player.hp = maxHp;
  enemy.hp = maxHp;
  playerSprite.value.ko = false;
  enemySprite.value.ko = false;
  addFightInHistory({
    id: fightUuid.value,
    player: player.pseudo,
    playerHp: player.hp,
    enemy: enemy.pseudo,
    enemyHp: enemy.hp,
    enemyPokemon: enemySprite.value.pokemon,
    inProgress: true,
  });
  step.value = 'choice';
}
</script>

<template>
  <main class="fight">
    <h1 class="hidden-title">Fight</h1>
    <div class="fight__enemy">
      <BattleZone :pokemonSprite="enemySprite" />
      <HUD :player="enemy" />
    </div>
    <div class="fight__player">
      <BattleZone :pokemonSprite="playerSprite" />
      <HUD :player="player" @moveSelected="attack($event)" />
    </div>
    <div
      class="fight__overlay"
      v-show="step === 'attack'"
      @click="nextStep"
    ></div>
    <TextBox v-show="step !== 'choice'">
      <div>
        {{ dialog }}
      </div>
    </TextBox>
    <div class="fight__buttons" v-if="step === 'end'">
      <Button text="Rejouer" :background="'green'" @click="restart" />
      <Button text="Quitter" :background="'red'" link="/" />
    </div>
  </main>
</template>
