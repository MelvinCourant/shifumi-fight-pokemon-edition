<script setup>
import '../../assets/css/components/utils/_popin.scss';
import TextBox from './TextBox.vue';
import { nextTick } from 'vue';

defineProps({
  isDisplayed: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['closePopin', 'updateInteractionSound']);

window.addEventListener('keydown', async (event) => {
  if (event.key === 'Escape') {
    emit('updateInteractionSound', false);
    await nextTick();
    emit('closePopin');
    emit('updateInteractionSound', true);
  }
});
</script>

<template>
  <div class="popin" v-show="isDisplayed">
    <button
      class="popin__button"
      @mousedown="$emit('updateInteractionSound', false)"
      @click="
        $emit('closePopin');
        $emit('updateInteractionSound', true);
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
      >
        <path
          d="M31.2501 27.0834H33.3334V29.1667H35.4167V31.2501H37.5001V33.3334H39.5834V35.4167H41.6667V37.5001H43.7501V39.5834H45.8334V41.6667H43.7501V43.7501H41.6667V45.8334H39.5834V43.7501H37.5001V41.6667H35.4167V39.5834H33.3334V37.5001H31.2501V35.4167H29.1667V33.3334H27.0834V31.2501H22.9167V33.3334H20.8334V35.4167H18.7501V37.5001H16.6667V39.5834H14.5834V41.6667H12.5001V43.7501H10.4167V45.8334H8.33341V43.7501H6.25008V41.6667H4.16675V39.5834H6.25008V37.5001H8.33341V35.4167H10.4167V33.3334H12.5001V31.2501H14.5834V29.1667H16.6667V27.0834H18.7501V22.9167H16.6667V20.8334H14.5834V18.7501H12.5001V16.6667H10.4167V14.5834H8.33341V12.5001H6.25008V10.4167H4.16675V8.33341H6.25008V6.25008H8.33341V4.16675H10.4167V6.25008H12.5001V8.33341H14.5834V10.4167H16.6667V12.5001H18.7501V14.5834H20.8334V16.6667H22.9167V18.7501H27.0834V16.6667H29.1667V14.5834H31.2501V12.5001H33.3334V10.4167H35.4167V8.33341H37.5001V6.25008H39.5834V4.16675H41.6667V6.25008H43.7501V8.33341H45.8334V10.4167H43.7501V12.5001H41.6667V14.5834H39.5834V16.6667H37.5001V18.7501H35.4167V20.8334H33.3334V22.9167H31.2501V27.0834Z"
          fill="white"
        />
      </svg>
    </button>
    <TextBox side="middle">
      <slot></slot>
    </TextBox>
  </div>
</template>
