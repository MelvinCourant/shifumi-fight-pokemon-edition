<script setup>
import '../assets/css/views/_pc.scss';
import PokemonsJson from '../data/pokemons.json';
import { useUserStore } from '../stores/user.js';
import { usePcBoxStore } from '../stores/pc-box.js';
import { onMounted, provide, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PCBox from '../components/pc/PCBox.vue';
import PokemonDetails from '../components/pc/PokemonDetails.vue';
import Button from '../components/inputs/Button.vue';

const emit = defineEmits(['updateInteractionSound']);

const route = useRoute();
const query = route.query;
const router = useRouter();
const userStore = useUserStore();
const user = userStore.user;
const userPcBoxStore = usePcBoxStore();
const userPcBox = userPcBoxStore.box;
const pseudo = ref(user.pseudo ? user.pseudo : 'Joueur');
const pseudoInputAttributes = ref({
  type: 'text',
  placeholder: 'Pseudo',
  value: pseudo.value,
  maxlength: 12,
  name: 'pseudo',
  required: true,
});
const pokemonSelected = ref(user.pokemon.pokemonName || query.pokemon);
const pokemonDetails = ref(
  PokemonsJson.find((p) => p.image === pokemonSelected.value)
    ? {
        pokedexId: PokemonsJson.find((p) => p.image === pokemonSelected.value)
          .pokedexId,
        name: PokemonsJson.find((p) => p.image === pokemonSelected.value).name,
        ratio: PokemonsJson.find((p) => p.image === pokemonSelected.value)
          .ratios.pokemonDetails,
      }
    : {},
);
const pokemonSprite = ref({
  pokemon: pokemonSelected.value,
  side: 'front',
  shiny: user.pokemon.shiny || false,
});
const shinyDataInitialized = ref(!!userPcBox.length);
const basePokemonData = ref(userPcBox.length ? userPcBox : [...PokemonsJson]);
const pokemons = computed(() => {
  if (!shinyDataInitialized.value) {
    return basePokemonData.value;
  }
  return basePokemonData.value;
});

provide('pokemonSelected', pokemonSelected.value);
provide('pokemonSprite', pokemonSprite);
provide('inputAttributes', pseudoInputAttributes);

onMounted(async () => {
  if (!userPcBox.length) {
    const pokemonsWithShiny = await Promise.all(
      basePokemonData.value.map(async (pokemon) => {
        const pokemonCopy = { ...pokemon };
        if (pokemon.image === pokemonSelected.value) {
          pokemonCopy.shiny = user.pokemon.shiny;
        } else {
          pokemonCopy.shiny = await pokemonIsShinyOrNot();
        }
        return pokemonCopy;
      }),
    );

    basePokemonData.value = pokemonsWithShiny;
    shinyDataInitialized.value = true;
    userPcBoxStore.updateBox(pokemonsWithShiny);
  } else {
    const selectedPokemon = basePokemonData.value.find(
      (p) => p.image === pokemonSelected.value,
    );
    if (selectedPokemon && user.pokemon.shiny !== selectedPokemon.shiny) {
      pokemonSprite.value.shiny = selectedPokemon.shiny;
      userStore.updateUser({
        pokemon: {
          pokemonName: pokemonSelected.value,
          shiny: selectedPokemon.shiny,
        },
      });
    }
    shinyDataInitialized.value = true;
  }
});

async function pokemonIsShinyOrNot() {
  const shinyChance = Math.floor(Math.random() * (1096 - 1 + 1)) + 1;
  return shinyChance === 1096;
}

async function updatePokemonSelected(pokemonName) {
  emit('updateInteractionSound', false);

  pokemonSelected.value = pokemonName;
  const selectedPokemon = pokemons.value.find((p) => p.image === pokemonName);

  pokemonSprite.value = {
    pokemon: pokemonName,
    side: 'front',
    shiny: selectedPokemon.shiny,
  };

  pokemonDetails.value = {
    pokedexId: selectedPokemon.pokedexId,
    name: selectedPokemon.name,
    ratio: selectedPokemon.ratios.pokemonDetails,
  };

  userStore.updateUser({
    pokemon: {
      pokemonName: pokemonName,
      shiny: selectedPokemon.shiny,
    },
  });

  await router.push({
    path: '/pc',
    query: { pokemon: pokemonName },
  });

  emit('updateInteractionSound', true);
}

function updatePseudo(newPseudo) {
  pseudo.value = newPseudo;
  userStore.updateUser({ pseudo: newPseudo });
}
</script>

<template>
  <main class="pc">
    <div class="pc__system" v-if="shinyDataInitialized">
      <PokemonDetails
        :pokemonDetails="pokemonDetails"
        :pokemonList="pokemons"
        @pseudoChanged="updatePseudo($event)"
      />
      <PCBox
        :pokemons="pokemons"
        @pokemonSelected="updatePokemonSelected($event)"
        @updateInteractionSound="$emit('updateInteractionSound', $event)"
      />
      <Button
        text="CHOISIR"
        :background="'blue'"
        size="big"
        link="/"
        @updateInteractionSound="$emit('updateInteractionSound', $event)"
      />
    </div>
    <div v-else class="pc__loading">Chargement des Pokémons...</div>
  </main>
</template>
