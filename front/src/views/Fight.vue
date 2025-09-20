<script setup>
import '../assets/css/views/_fight.scss';
import BattleZone from '../components/battle/BattleZone.vue';
import HUD from '../components/battle/HUD.vue';
import Moves from '../components/battle/Moves.vue';
import { useUserStore } from '../stores/user.js';
import { useHistoryStore } from '../stores/history.js';
import { onUnmounted, onMounted, provide, reactive, ref, watch } from 'vue';
import CharactersJson from '../data/characters.json';
import PokemonsJson from '../data/pokemons.json';
import TextBox from '../components/utils/TextBox.vue';
import Button from '../components/inputs/Button.vue';
import Sound from '../components/utils/Sound.vue';
import { v4 as uuidv4 } from 'uuid';
import router from '../router/index.js';
import Settings from '../components/inputs/Settings.vue';
import { useSettingsStore } from '../stores/settings.js';

defineEmits(['updateInteractionSound']);

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
    pp: 6,
    maxPp: 6,
    image: 'pierre',
    highlyEffective: [2],
  },
  {
    id: 1,
    name: 'Feuille',
    pp: 6,
    maxPp: 6,
    image: 'feuille',
    highlyEffective: [0, 3],
  },
  {
    id: 2,
    name: 'Ciseaux',
    pp: 6,
    maxPp: 6,
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
const ppAI = reactive([
  {
    id: 0,
    pp: 6,
    maxPp: 6,
  },
  {
    id: 1,
    pp: 6,
    maxPp: 6,
  },
  {
    id: 2,
    pp: 6,
    maxPp: 6,
  },
  {
    id: 3,
    pp: 1,
    maxPp: 1,
  },
]);
const maxHp = 300;
const playerSprite = ref({
  pokemon: user.pokemon.pokemonName,
  side: 'back',
  shiny: user.pokemon.shiny,
  receiveDamage: false,
  ko: false,
  ratio: PokemonsJson.find(
    (pokemon) => pokemon.image === user.pokemon.pokemonName,
  ).ratios.battleBack,
});
const enemySprite = ref({
  pokemon: '',
  side: 'front',
  shiny: false,
  receiveDamage: false,
  ko: false,
  ratio: 0,
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
const settingsStore = useSettingsStore();
const { settings } = settingsStore;
const soundsAttributes = reactive([
  {
    controls: true,
    volume: settings.soundVolume,
    id: 'super-effective-player',
  },
  {
    controls: true,
    volume: settings.soundVolume,
    id: 'super-effective-enemy',
  },
  {
    controls: true,
    volume: settings.soundVolume,
    id: 'normal',
  },
  {
    controls: true,
    volume: settings.soundVolume,
    id: 'faint-player',
  },
  {
    controls: true,
    volume: settings.soundVolume,
    id: 'faint-enemy',
  },
  {
    controls: true,
    volume: settings.soundVolume,
    id: 'faint-both',
  },
  {
    controls: true,
    volume: settings.soundVolume,
    id: 'restore',
  },
]);
const soundsPlay = reactive([
  {
    id: 'super-effective-player',
    play: false,
  },
  {
    id: 'super-effective-enemy',
    play: false,
  },
  {
    id: 'normal',
    play: false,
  },
  {
    id: 'faint-player',
    play: false,
  },
  {
    id: 'faint-enemy',
    play: false,
  },
  {
    id: 'faint-both',
    play: false,
  },
  {
    id: 'restore',
    play: false,
  },
]);

const playerAnimationEnd = ref(false);
const enemyAnimationEnd = ref(false);

provide('moves', moves);
provide('maxHp', maxHp);
provide('step', step);

if (!user.pokemon.pokemonName) {
  router.push('/');
}

if (lastFight && lastFight.inProgress) {
  fightUuid.value = lastFight.id;
  player.hp = lastFight.playerHp;
  enemySprite.value.pokemon = lastFight.enemyPokemon;
  enemySprite.value.ratio = PokemonsJson.find(
    (pokemon) => pokemon.image === lastFight.enemyPokemon,
  ).ratios.battleFront;
  enemy.pseudo = lastFight.enemy;
  enemy.hp = lastFight.enemyHp;
  lastFight.playerPp.forEach((lastFightMove) => {
    moves.forEach((move) => {
      if (lastFightMove.id === move.id) {
        move.pp = lastFightMove.pp;
      }
    });
  });
  lastFight.enemyPp.forEach((lastFightMove) => {
    ppAI.forEach((move) => {
      if (lastFightMove.id === move.id) {
        move.pp = lastFightMove.pp;
      }
    });
  });
} else {
  generateRandomPokemon(user.pokemon.pokemonName);
  generateEnemy();
  fightUuid.value = uuidv4();
  addFightInHistory({
    id: fightUuid.value,
    player: player.pseudo,
    playerHp: player.hp,
    playerPp: filterPpForHistory(moves),
    enemy: enemy.pseudo,
    enemyHp: enemy.hp,
    enemyPokemon: enemySprite.value.pokemon,
    enemyPp: filterPpForHistory(ppAI),
    inProgress: true,
    datetime: new Date(),
  });
}

function filterPpForHistory(moves) {
  return moves.map(({ id, pp }) => ({ id, pp }));
}

function generateEnemy() {
  enemy.pseudo =
    CharactersJson[Math.floor(Math.random() * CharactersJson.length)].name;
}

function generateRandomPokemon(playerPokemon) {
  const availablePokemons = PokemonsJson.filter(
    (pokemon) => pokemon.image !== playerPokemon,
  );
  const generatedPokemon =
    availablePokemons[Math.floor(Math.random() * availablePokemons.length)];
  enemySprite.value.pokemon = generatedPokemon.image;
  enemySprite.value.ratio = PokemonsJson.find(
    (pokemon) => pokemon.image === generatedPokemon.image,
  ).ratios.battleFront;
}

function attack(moveId) {
  if (step.value !== 'choice') return;

  const playerMove = moves.find((move) => move.id === moveId);

  if (playerMove.pp === 0) return;

  playerMove.pp -= 1;

  soundsPlay.forEach((sound) => {
    if (sound.play === true) {
      sound.play = false;
    }
  });

  const enemyMove = AIAttack();
  const dmgInfliged = 100;

  if (playerMove.highlyEffective.includes(enemyMove.id)) {
    if (!criticalHitOrNot()) {
      enemy.hp -= dmgInfliged;
      dialog.value = `${enemy.pseudo} utilise ${enemyMove.name}... mais vous utilisez ${playerMove.name}, c’est super
        efficace!`;
    } else {
      if (enemy.hp - dmgInfliged * 2 < 0) {
        enemy.hp = 0;
      } else {
        enemy.hp -= dmgInfliged * 2;
      }
      dialog.value = `${enemy.pseudo} utilise ${enemyMove.name}... mais vous utilisez ${playerMove.name}, c’est super
        efficace! Coup critique!`;
    }

    sendFightInHistory();

    soundsPlay.forEach((sound) => {
      if (sound.id === 'super-effective-enemy') {
        sound.play = true;
      }
    });

    enemySprite.value.receiveDamage = true;

    setTimeout(() => {
      enemySprite.value.receiveDamage = false;
    }, 1000);
  } else if (enemyMove.highlyEffective.includes(playerMove.id)) {
    if (!criticalHitOrNot()) {
      player.hp -= dmgInfliged;
      dialog.value = `Vous utilisez ${playerMove.name}... mais ${enemy.pseudo} utilise ${enemyMove.name}, c’est super
        efficace!`;
    } else {
      if (player.hp - dmgInfliged * 2 < 0) {
        player.hp = 0;
      } else {
        player.hp -= dmgInfliged * 2;
      }

      dialog.value = `Vous utilisez ${playerMove.name}... mais ${enemy.pseudo} utilise ${enemyMove.name}, c’est super
        efficace! Coup critique!`;
    }

    sendFightInHistory();

    soundsPlay.forEach((sound) => {
      if (sound.id === 'super-effective-player') {
        sound.play = true;
      }
    });

    playerSprite.value.receiveDamage = true;

    setTimeout(() => {
      playerSprite.value.receiveDamage = false;
    }, 1000);
  } else {
    player.hp -= dmgInfliged;
    enemy.hp -= dmgInfliged;
    dialog.value = `Vous et ${enemy.pseudo} utilisez ${playerMove.name}, le choc vous infligent des dégâts...`;
    sendFightInHistory();

    soundsPlay.forEach((sound) => {
      if (sound.id === 'normal') {
        sound.play = true;
      }
    });

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
        playerPp: filterPpForHistory(moves),
        enemyHp: enemy.hp,
        enemyPp: filterPpForHistory(ppAI),
        inProgress: false,
      });
    } else if (player.hp === 0) {
      updateFightInHistory({
        id: fightUuid.value,
        result: 'Défaite',
        playerHp: player.hp,
        playerPp: filterPpForHistory(moves),
        enemyHp: enemy.hp,
        enemyPp: filterPpForHistory(ppAI),
        inProgress: false,
      });
    } else if (enemy.hp === 0) {
      updateFightInHistory({
        id: fightUuid.value,
        result: 'Victoire',
        playerHp: player.hp,
        playerPp: filterPpForHistory(moves),
        enemyHp: enemy.hp,
        enemyPp: filterPpForHistory(ppAI),
        inProgress: false,
      });
    } else {
      updateFightInHistory({
        id: fightUuid.value,
        playerHp: player.hp,
        playerPp: filterPpForHistory(moves),
        enemyHp: enemy.hp,
        enemyPp: filterPpForHistory(ppAI),
      });
    }
  }

  step.value = 'attack';
}

function AIAttack() {
  const availableMoves = ppAI.filter((pp) => pp.pp > 0);

  if (availableMoves.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  const selectedMoveId = availableMoves[randomIndex].id;

  ppAI.find((pp) => pp.id === selectedMoveId).pp -= 1;

  return moves.find((move) => move.id === selectedMoveId);
}

function criticalHitOrNot() {
  return Math.random() < 0.0417;
}

function nextStep() {
  soundsPlay.forEach((sound) => {
    if (sound.play === true) {
      sound.play = false;
    }
  });

  if (step.value === 'choice') return;

  if (player.hp > 0 && enemy.hp > 0) {
    step.value = 'choice';
  } else if (player.hp === 0 && enemy.hp === 0) {
    playerSprite.value.ko = true;
    enemySprite.value.ko = true;
    dialog.value = `Vous et ${enemy.pseudo} êtes K.O.! Match nul`;
  } else if (player.hp === 0) {
    playerSprite.value.ko = true;
    dialog.value = `Vous êtes K.O! ${enemy.pseudo} a gagné!`;
  } else if (enemy.hp === 0) {
    enemySprite.value.ko = true;
    dialog.value = `${enemy.pseudo} est K.O.! Vous avez gagné!`;
  }

  if (player.hp === 0 && enemy.hp === 0) {
    soundsPlay.forEach((sound) => {
      if (sound.id === 'faint-both') {
        sound.play = true;
      }
    });

    step.value = 'fight-finished';
  } else if (player.hp === 0) {
    soundsPlay.forEach((sound) => {
      if (sound.id === 'faint-player') {
        sound.play = true;
      }
    });

    step.value = 'fight-finished';
  } else if (enemy.hp === 0) {
    soundsPlay.forEach((sound) => {
      if (sound.id === 'faint-enemy') {
        sound.play = true;
      }
    });

    step.value = 'fight-finished';
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
  ppAI.forEach((pp) => {
    pp.pp = pp.maxPp;
  });
  player.hp = maxHp;
  enemy.hp = maxHp;
  playerSprite.value.ko = false;
  enemySprite.value.ko = false;
  addFightInHistory({
    id: fightUuid.value,
    player: player.pseudo,
    playerHp: player.hp,
    playerPp: filterPpForHistory(moves),
    enemy: enemy.pseudo,
    enemyHp: enemy.hp,
    enemyPp: filterPpForHistory(ppAI),
    enemyPokemon: enemySprite.value.pokemon,
    inProgress: true,
    datetime: new Date(),
  });
  soundsPlay.forEach((sound) => {
    if (sound.id === 'restore') {
      sound.play = true;
    } else {
      sound.play = false;
    }
  });
  step.value = 'choice';
}

onMounted(() => {
  const isDesktop = window.innerWidth >= 1024;

  let playerElement, enemyElement;

  if (isDesktop) {
    playerElement = document.querySelector('.fight__player .hud');
    enemyElement = document.querySelector('.fight__enemy .hud');
  } else {
    playerElement = document.querySelector('.fight__player .hp_bar');
    enemyElement = document.querySelector('.fight__enemy .hp-bar');
  }

  playerElement.addEventListener(
    'animationend',
    () => {
      playerAnimationEnd.value = true;
    },
    { once: true },
  );
  enemyElement.addEventListener(
    'animationend',
    () => {
      enemyAnimationEnd.value = true;
    },
    { once: true },
  );
});

watch([playerAnimationEnd, enemyAnimationEnd], ([playerEnd, enemyEnd]) => {
  if (playerEnd && enemyEnd) {
    const fightPage = document.querySelector('.fight');
    fightPage.classList.remove('fight--entering-animation');
  }
});

onUnmounted(() => {
  soundsPlay.forEach((sound) => {
    if (sound.play === true) {
      sound.play = false;
    }
  });
});
</script>

<template>
  <main class="fight fight--entering-animation">
    <h1 class="hidden-title">Fight</h1>
    <div class="fight__container">
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
      <Settings />
    </div>
    <div class="fight__buttons" v-if="step === 'end'">
      <Button
        text="Rejouer"
        :background="'green'"
        @click="restart"
        @updateInteractionSound="$emit('updateInteractionSound', $event)"
      />
      <Button
        text="Quitter"
        :background="'red'"
        link="/"
        @updateInteractionSound="$emit('updateInteractionSound', $event)"
      />
    </div>
    <div class="fight__moves-mobile">
      <Moves @moveSelected="attack($event)" />
    </div>
    <Sound
      sound="fight/super-effective-player"
      :attributes="soundsAttributes[0]"
      :play="soundsPlay[0].play"
    />
    <Sound
      sound="fight/super-effective-enemy"
      :attributes="soundsAttributes[1]"
      :play="soundsPlay[1].play"
    />
    <Sound
      sound="fight/normal"
      :attributes="soundsAttributes[2]"
      :play="soundsPlay[2].play"
    />
    <Sound
      sound="fight/faint-player"
      :attributes="soundsAttributes[3]"
      :play="soundsPlay[3].play"
    />
    <Sound
      sound="fight/faint-enemy"
      :attributes="soundsAttributes[4]"
      :play="soundsPlay[4].play"
    />
    <Sound
      sound="fight/faint-both"
      :attributes="soundsAttributes[5]"
      :play="soundsPlay[5].play"
    />
    <Sound
      sound="fight/restore"
      :attributes="soundsAttributes[6]"
      :play="soundsPlay[6].play"
    />
  </main>
</template>
