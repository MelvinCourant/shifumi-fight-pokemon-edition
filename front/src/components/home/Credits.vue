<script setup>
import '../../assets/css/components/home/_credits.scss';
import TextBox from '../utils/TextBox.vue';
import { ref } from 'vue';
import Popin from '../utils/Popin.vue';

defineEmits(['updateInteractionSound']);

const isDisplayed = ref(false);
</script>

<template>
  <input
    @mousedown="$emit('updateInteractionSound', false)"
    @click="
      isDisplayed = true;
      $emit('updateInteractionSound', true);
    "
    class="credits"
    type="button"
    value="Crédits"
  />
  <Popin
    :isDisplayed="isDisplayed"
    @closePopin="isDisplayed = false"
    @updateInteractionSound="$emit('updateInteractionSound', $event)"
    class="credits__popin"
  >
    <div class="credits__content">
      <h2>Crédits</h2>
      <ul>
        <li><u>Barres de vie:</u> GameMaster12 & StayPuft</li>
        <li><u>Terrains:</u> Sunday-Doneko</li>
        <li><u>PC box system:</u> Spacemotion</li>
        <li><u>Sprites animés:</u> Pokémon Database</li>
        <li><u>Sprites Pokémons PC:</u> msikma</li>
        <li><u>Soundtracks:</u> GreekWeavile (Youtube), Sound Effects Wiki</li>
      </ul>
    </div>
    <p class="credits__legal-notice">
      Tous les noms, images, marques et autres assets liés à Pokémon sont la
      propriété exclusive de The Pokémon Company, Nintendo, Game Freak et
      Creatures Inc. Ce projet est un travail non commercial et n’est en aucun
      cas affilié ou approuvé par les ayants droit. Tous les droits réservés à
      leurs propriétaires respectifs.
    </p>
  </Popin>
</template>
