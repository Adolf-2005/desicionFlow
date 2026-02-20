<template>
  <v-app>
    <v-main class="">
      <Navbar v-if="$route.name === 'Login' ? false : true" />
      <router-view />
      <BotonTema />
    </v-main>
  </v-app>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import BotonTema from './components/BotonTema.vue';
//
</script>
