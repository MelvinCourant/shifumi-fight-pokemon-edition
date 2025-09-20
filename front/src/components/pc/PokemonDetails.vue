<script setup>
import '../../assets/css/components/pc/_pokemon-details.scss';
import PreloadedAnimatedSprite from '../sprites/PreloadedAnimatedSprite.vue';
import Input from '../inputs/Input.vue';

defineProps({
  pokemonDetails: {
    type: Object,
    required: true,
  },
  pokemonList: {
    type: Array,
    required: true,
  },
  pseudo: {
    type: String,
    default: 'Joueur',
  },
});
defineEmits(['pseudoChanged']);
</script>

<template>
  <div class="pokemon-details">
    <h2 v-if="pokemonDetails.name" class="pokemon-details__name">
      {{ pokemonDetails.name }}
    </h2>
    <div v-if="pokemonDetails.pokedexId" class="pokemon-details__pokedex-id">
      <img width="50" src="../../assets/imgs/pc/number.webp" alt="N°" />
      <p>{{ pokemonDetails.pokedexId }}</p>
    </div>
    <div class="pokemon-details__preview">
      <PreloadedAnimatedSprite
        :pokemonList="pokemonList"
        :ratio="pokemonDetails.ratio"
      />
    </div>
    <Input @input="$emit('pseudoChanged', $event)" />
    <div class="pokemon-details__level">
      <img width="36" src="../../assets/imgs/pc/niveau.webp" alt="N." />
      <p>100</p>
    </div>
    <img
      width="509"
      class="pokemon-details__background"
      src="../../assets/imgs/pc/pokemon-details.webp"
      alt="Pokemon details background"
    />
  </div>
</template>
