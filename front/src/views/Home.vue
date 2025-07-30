<script setup>
import '../assets/css/views/_home.scss';
import BattleZone from "../components/battle/BattleZone.vue";
import {provide, ref} from "vue";
import Button from "../components/inputs/Button.vue";

const pokemonSelected = ref('');
const pokemonSprite = {
  pokemon: pokemonSelected.value,
  side: 'front',
  shiny: false,
};
const pseudo = ref('Joueur');

provide('pokemonSprite', pokemonSprite);
</script>

<template>
  <main class="home">
    <header class="home__header">
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_193_410)">
          <path d="M45.8335 18.75V14.5833H43.7502V10.4167H41.6668V8.33333H39.5835V6.25H35.4168V4.16667H31.2502V2.08333H18.7502V4.16667H14.5835V6.25H10.4168V8.33333H8.3335V10.4167H6.25016V14.5833H4.16683V18.75H2.0835V31.25H4.16683V35.4167H6.25016V39.5833H8.3335V41.6667H10.4168V43.75H14.5835V45.8333H18.7502V47.9167H31.2502V45.8333H35.4168V43.75H39.5835V41.6667H41.6668V39.5833H43.7502V35.4167H45.8335V31.25H47.9168V18.75H45.8335ZM22.9168 12.5H27.0835V16.6667H22.9168V12.5ZM20.8335 31.25H22.9168V20.8333H20.8335V18.75H27.0835V31.25H29.1668V35.4167H20.8335V31.25Z" fill="var(--white)"/>
        </g>
        <defs>
          <clipPath id="clip0_193_410">
            <rect width="50" height="50" fill="var(--white)"/>
          </clipPath>
        </defs>
      </svg>
      <h1 class="home__title">Shifumi Fight <span>Pokémon Edition</span></h1>
      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M43.7502 20.8333V18.75H41.6668V14.5833H43.7502V10.4167H41.6668V8.33333H39.5835V6.25H35.4168V8.33333H31.2502V6.25H29.1668V2.08333H20.8335V6.25H18.7502V8.33333H14.5835V6.25H10.4168V8.33333H8.3335V10.4167H6.25016V14.5833H8.3335V18.75H6.25016V20.8333H2.0835V29.1667H6.25016V31.25H8.3335V35.4167H6.25016V39.5833H8.3335V41.6667H10.4168V43.75H14.5835V41.6667H18.7502V43.75H20.8335V47.9167H29.1668V43.75H31.2502V41.6667H35.4168V43.75H39.5835V41.6667H41.6668V39.5833H43.7502V35.4167H41.6668V31.25H43.7502V29.1667H47.9168V20.8333H43.7502ZM20.8335 20.8333V18.75H29.1668V20.8333H31.2502V29.1667H29.1668V31.25H20.8335V29.1667H18.7502V20.8333H20.8335Z" fill="var(--white)"/>
      </svg>
    </header>
    <section class="home__party">
      <div class="home__left">
        <BattleZone :pseudo="pseudo"/>
        <Button text="Historique" :background="'blue'" size="small"/>
      </div>
      <div class="home__right">
        <Button text="Nouvelle partie" :background="'red'" size="big"/>
        <Button text="Boîte PC" :background="'green'" size="big"/>
      </div>
    </section>
  </main>
</template>