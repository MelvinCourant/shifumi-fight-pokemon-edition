<script setup>
import PokemonsJson from '../data/pokemons.json';
import PCSprite from "../components/pokemon/PCSprite.vue";
</script>

<template>
  <PCSprite v-for="pokemon in PokemonsJson" :key="pokemon.image" :pokemon="pokemon.image"/>
</template>