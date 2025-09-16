<script setup>
import '../../assets/css/components/pc/_pokemon-details.scss';
import AnimatedSprite from '../sprites/AnimatedSprite.vue';
import Input from '../inputs/Input.vue';

defineProps({
  pokemonDetails: {
    type: Object,
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
      <img src="../../assets/imgs/pc/number.png" alt="N°" />
      <p>{{ pokemonDetails.pokedexId }}</p>
    </div>
    <div class="pokemon-details__preview">
      <AnimatedSprite :ratio="pokemonDetails.ratio" />
    </div>
    <Input @input="$emit('pseudoChanged', $event)" />
    <div class="pokemon-details__level">
      <img src="../../assets/imgs/pc/niveau.png" alt="N." />
      <p>100</p>
    </div>
    <img
      class="pokemon-details__background"
      src="../../assets/imgs/pc/pokemon-details.png"
      alt="Pokemon details background"
    />
  </div>
</template>
