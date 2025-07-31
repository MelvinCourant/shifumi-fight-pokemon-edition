<script setup>
import '../../assets/css/components/pc/_pc-box.scss';
import PCSprite from '../sprites/PCSprite.vue';
import { inject, nextTick, onMounted, ref } from 'vue';

defineProps({
  pokemons: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['pokemonSelected']);

const imagesLoaded = ref(false);
const pokemonSelected = ref(inject('pokemonSelected'));
const pokemonsPosition = ref([]);
const handPosition = ref({
  x: 0,
  y: 0,
});

function calculatePositions() {
  const grid = document.querySelector('.pc-box__grid');
  const gridRect = grid.getBoundingClientRect();
  const pokemons = document.querySelectorAll('.pc-box__pokemon');

  pokemons.forEach((pokemon) => {
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
  });
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

  // Verify if images are loaded before calculating positions
  const images = document.querySelectorAll('.pc-box__pokemon img');
  const imagePromises = Array.from(images).map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  });

  await Promise.all(imagePromises);
  imagesLoaded.value = true;

  calculatePositions();
});
</script>

<template>
  <div class="pc-box">
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
          v-if="imagesLoaded"
          class="pc-box__hand"
          :style="`top: ${handPosition.y}%; left: ${handPosition.x}%;`"
        >
          <img src="../../assets/imgs/pc/hand.png" alt="Hand" />
        </div>

        <div
          v-if="imagesLoaded"
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
