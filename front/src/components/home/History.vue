<script setup>
import '../../assets/css/components/home/_history.scss';
import Button from '../inputs/Button.vue';
import { ref } from 'vue';
import Popin from '../utils/Popin.vue';

defineProps({
  history: {
    type: Array,
    required: true,
  },
});
defineEmits(['updateInteractionSound']);

const isDisplayed = ref(false);
</script>

<template>
  <Button
    text="Historique"
    :background="'blue'"
    size="small"
    @click="isDisplayed = true"
    @updateInteractionSound="$emit('updateInteractionSound', $event)"
  />
  <Popin
    class="history"
    :isDisplayed="isDisplayed"
    @closePopin="isDisplayed = false"
    @updateInteractionSound="$emit('updateInteractionSound', $event)"
  >
    <h2>Historique</h2>
    <div>
      <table class="history__table" v-if="history.length > 0">
        <thead>
          <tr>
            <td>Résultat</td>
            <td>Adversaire</td>
            <td>Vos PV</td>
            <td>PV adverse</td>
          </tr>
        </thead>
        <tbody>
          <template v-for="fight in history" :key="fight.id">
            <tr
              :class="[
                'history__fight',
                { 'history__fight--win': fight.result === 'Victoire' },
                { 'history__fight--defeat': fight.result === 'Défaite' },
                { 'history__fight--draw': fight.result === 'Egalité' },
              ]"
              v-if="!fight.inProgress"
            >
              <td>{{ fight.result }}</td>
              <td>{{ fight.enemy }}</td>
              <td>{{ fight.playerHp }}</td>
              <td>{{ fight.enemyHp }}</td>
            </tr>
          </template>
        </tbody>
      </table>
      <p v-else>Aucun historique existant</p>
    </div>
  </Popin>
</template>
