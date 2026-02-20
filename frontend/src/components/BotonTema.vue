<template>
  <v-btn class="position-fixed top-0 right-0 ma-5" @click="theme.toggle()"
    :icon="theme.name.value === 'dark' ? 'mdi-weather-sunny' : 'mdi-moon-waning-crescent'"></v-btn>
</template>

<script setup>
import { useTheme } from 'vuetify';
const theme = useTheme()
</script>