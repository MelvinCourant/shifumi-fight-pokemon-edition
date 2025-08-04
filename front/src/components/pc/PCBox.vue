<script setup>
import '../../assets/css/components/pc/_pc-box.scss';
import PCSprite from '../sprites/PCSprite.vue';
import { inject, nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

defineProps({
  pokemons: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['pokemonSelected']);

const router = useRouter();
const pokemonSelected = ref(inject('pokemonSelected'));
const pokemonsPosition = ref([]);
const handPositionInitialized = ref(false);
const handPosition = ref({
  x: 0,
  y: 0,
});

function calculatePositions() {
  const pokemons = document.querySelectorAll('.pc-box__pokemon');
  const grid = document.querySelector('.pc-box__grid');
  const gridRect = grid.getBoundingClientRect();

  for (let pokemon of pokemons) {
    const rect = pokemon.getBoundingClientRect();

    const relativePosition = {
      x: ((rect.left - gridRect.left + rect.width / 2) / gridRect.width) * 100,
      y: ((rect.top - gridRect.top + rect.height) / gridRect.height) * 100,
    };

    pokemonsPosition.value.push({
      pokemonName: pokemon.dataset.pokemonName,
      position: relativePosition,
    });

    if (pokemonSelected.value === pokemon.dataset.pokemonName) {
      handPosition.value = relativePosition;
    }
  }

  handPositionInitialized.value = true;
}

function updatePokemonSelected(pokemonName) {
  pokemonSelected.value = pokemonName;
  emit('pokemonSelected', pokemonName);

  const selectedPokemon = pokemonsPosition.value.find(
    (pokemon) => pokemon.pokemonName === pokemonName,
  );

  handPosition.value = selectedPokemon.position;
}

onMounted(async () => {
  await nextTick();

  // Verify if images loaded before calculating positions
  const images = document.querySelectorAll('.pc-box__pokemon img');
  const imagePromises = Array.from(images).map((img) => {
    return new Promise((resolve) => {
      const checkDimensions = () => {
        const rect = img.getBoundingClientRect();

        if (rect.width > 0 && rect.height > 0) {
          resolve();
        } else {
          setTimeout(checkDimensions, 10);
        }
      };

      if (img.complete) {
        checkDimensions();
      } else {
        img.onload = checkDimensions;
        img.onerror = resolve;
      }
    });
  });

  await Promise.all(imagePromises);

  calculatePositions();
});

async function moveInBox(event) {
  const pokemons = document.querySelectorAll('.pc-box__pokemon');
  const columnCount = 6;
  const currentIndex = pokemonsPosition.value.findIndex(
    (pokemon) => pokemon.pokemonName === pokemonSelected.value,
  );
  let newIndex = currentIndex;

  if (event.key === 'ArrowUp' && currentIndex > columnCount - 1) {
    newIndex = currentIndex - columnCount;
  } else if (
    event.key === 'ArrowDown' &&
    currentIndex < pokemons.length - columnCount
  ) {
    newIndex = currentIndex + columnCount;
  } else if (event.key === 'ArrowLeft' && currentIndex > 0) {
    newIndex = currentIndex - 1;
  } else if (event.key === 'ArrowRight' && currentIndex < pokemons.length - 1) {
    newIndex = currentIndex + 1;
  } else if (event.key === 'Enter') {
    window.removeEventListener('keydown', moveInBox);

    await router.push({
      name: 'Home',
    });
  }

  if (newIndex !== currentIndex) {
    pokemons.forEach((pokemon) => {
      if (
        pokemon.dataset.pokemonName ===
        pokemonsPosition.value[newIndex].pokemonName
      ) {
        pokemon.focus();
      }
    });
  }
}

window.addEventListener('keydown', moveInBox);
</script>

<template>
  <div class="pc-box">
    <h2 class="pc-box__title">Pokémons</h2>
    <div class="pc-box__pokemons">
      <div class="pc-box__grid">
        <button
          v-for="pokemon in pokemons"
          :key="pokemon.pokedexId"
          :data-pokemon-name="pokemon.image"
          :class="[
            'pc-box__pokemon',
            { 'pc-box__pokemon--selected': pokemonSelected === pokemon.image },
          ]"
          @focus="updatePokemonSelected(pokemon.image)"
        >
          <PCSprite :pokemon="pokemon.image" />
        </button>

        <div
          v-if="handPositionInitialized"
          class="pc-box__hand"
          :style="`top: ${handPosition.y}%; left: ${handPosition.x}%;`"
        >
          <img src="../../assets/imgs/pc/hand.png" alt="Hand" />
        </div>

        <div
          v-if="handPositionInitialized"
          class="pc-box__hand-shadow"
          :style="`top: ${handPosition.y}%; left: ${handPosition.x}%;`"
        >
          <img src="../../assets/imgs/pc/hand-shadow.png" alt="Hand Shadow" />
        </div>
      </div>
    </div>
    <img
      class="pc-box__background"
      src="../../assets/imgs/pc/pc-box.png"
      alt="PC Box Background"
    />
  </div>
</template>
