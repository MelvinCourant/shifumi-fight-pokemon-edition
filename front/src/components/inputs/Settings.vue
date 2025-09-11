<script setup>
import '../../assets/css/components/inputs/_settings.scss';
import Range from './Range.vue';
import { reactive, ref, watch } from 'vue';
import { useSettingsStore } from '../../stores/settings.js';
import Popin from '../utils/Popin.vue';

defineEmits(['updateInteractionSound']);

const settingsStore = useSettingsStore();
const { settings, updateSettings } = settingsStore;
const soundAttributes = reactive({
  min: 0,
  max: 100,
  step: 1,
  value: settings.soundVolume * 100,
});
const musicAttributes = reactive({
  min: 0,
  max: 100,
  step: 1,
  value: settings.musicVolume * 100,
});
const isDisplayed = ref(false);

function updateSound(value) {
  soundAttributes.value = value;
  updateSettings({ soundVolume: value / 100 });
}

function updateMusic(value) {
  musicAttributes.value = value;
  updateSettings({ musicVolume: value / 100 });
}

watch(settings, (value) => {
  if (value.soundVolume) {
    soundAttributes.value = value.soundVolume * 100;
  } else if (value.musicVolume) {
    musicAttributes.value = value.musicVolume * 100;
  }
});
</script>

<template>
  <button
    class="settings"
    @mousedown="$emit('updateInteractionSound', false)"
    @click="
      isDisplayed = true;
      $emit('updateInteractionSound', true);
    "
  >
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M43.7502 20.8333V18.75H41.6668V14.5833H43.7502V10.4167H41.6668V8.33333H39.5835V6.25H35.4168V8.33333H31.2502V6.25H29.1668V2.08333H20.8335V6.25H18.7502V8.33333H14.5835V6.25H10.4168V8.33333H8.3335V10.4167H6.25016V14.5833H8.3335V18.75H6.25016V20.8333H2.0835V29.1667H6.25016V31.25H8.3335V35.4167H6.25016V39.5833H8.3335V41.6667H10.4168V43.75H14.5835V41.6667H18.7502V43.75H20.8335V47.9167H29.1668V43.75H31.2502V41.6667H35.4168V43.75H39.5835V41.6667H41.6668V39.5833H43.7502V35.4167H41.6668V31.25H43.7502V29.1667H47.9168V20.8333H43.7502ZM20.8335 20.8333V18.75H29.1668V20.8333H31.2502V29.1667H29.1668V31.25H20.8335V29.1667H18.7502V20.8333H20.8335Z"
        fill="var(--white)"
      />
    </svg>
  </button>
  <Popin
    class="settings__popin"
    :isDisplayed="isDisplayed"
    @closePopin="isDisplayed = false"
    @updateInteractionSound="$emit('updateInteractionSound', $event)"
  >
    <h2>Paramètres</h2>
    <div>
      <ul class="settings__list">
        <li class="settings__range">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="35"
            viewBox="0 0 36 35"
            fill="none"
          >
            <path
              d="M20.9168 2.91675V32.0834H16.5418V30.6251H15.0835V29.1667H13.6252V27.7084H12.1668V26.2501H10.7085V24.7917H9.25016V23.3334H1.9585V11.6667H9.25016V10.2084H10.7085V8.75008H12.1668V7.29175H13.6252V5.83341H15.0835V4.37508H16.5418V2.91675H20.9168Z"
              fill="white"
            />
            <path
              d="M25.2918 21.875V20.4167H23.8335V18.9583H25.2918V16.0417H23.8335V14.5833H25.2918V13.125H26.7502V14.5833H28.2085V20.4167H26.7502V21.875H25.2918Z"
              fill="white"
            />
            <path
              d="M34.0417 14.5833V20.4167H32.5833V23.3333H31.125V24.7917H29.6667V26.25H28.2083V24.7917H26.75V23.3333H28.2083V21.875H29.6667V20.4167H31.125V14.5833H29.6667V13.125H28.2083V11.6667H26.75V10.2083H28.2083V8.75H29.6667V10.2083H31.125V11.6667H32.5833V14.5833H34.0417Z"
              fill="white"
            />
          </svg>
          <Range @input="updateSound($event)" :attributes="soundAttributes" />
        </li>
        <li class="settings__range">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="34"
            height="33"
            viewBox="0 0 34 33"
            fill="none"
          >
            <path
              d="M33.0418 0.458252V25.2499H31.5835V26.7083H30.1252V28.1666H24.2918V26.7083H22.8335V25.2499H21.3752V20.8749H22.8335V19.4166H24.2918V17.9583H28.6668V10.6666H25.7502V12.1249H21.3752V13.5833H15.5418V15.0416H12.6252V29.6249H11.1668V31.0833H9.7085V32.5416H3.87516V31.0833H2.41683V29.6249H0.958496V25.2499H2.41683V23.7916H3.87516V22.3333H8.25016V7.74992H11.1668V6.29159H15.5418V4.83325H21.3752V3.37492H25.7502V1.91659H30.1252V0.458252H33.0418Z"
              fill="white"
            />
          </svg>
          <Range @input="updateMusic($event)" :attributes="musicAttributes" />
        </li>
      </ul>
    </div>
  </Popin>
</template>
