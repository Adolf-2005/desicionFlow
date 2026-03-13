<template>
  <div class="position-fixed right-0 ma-4 boton pa-2">
    <v-btn class="" @click="theme.toggle()"
    :icon="theme.name.value === 'dark' ? 'mdi-weather-sunny' : 'mdi-moon-waning-crescent'"></v-btn>
  </div>
</template>

<script setup>
import { useTheme } from 'vuetify';
const theme = useTheme()
</script>

<style scoped>
.boton {
  top: 0;
  z-index: 9999;
}

@media (max-width: 1250px) {
  .boton {
    top: 60px !important;
    z-index: 9999;
  }
}
</style>