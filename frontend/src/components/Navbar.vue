<template>
  <v-navigation-drawer expand-on-hover rail>
    <v-list>
      <v-list-item :title="usuario" prepend-icon="mdi-shield-account"></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item v-for="link in items" :prepend-icon="link.icon" :to="`/${link.ruta}`" :title="link.title"
        :value="link.value"></v-list-item>
      <v-list-item prepend-icon="mdi-logout"> <v-btn color="error" @click="logout">Cerrar
          sesión</v-btn></v-list-item>
    </v-list>
  </v-navigation-drawer>


  <div v-if="$vuetify.display.mobile">
    <v-app-bar>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Ventas</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'left' : undefined" temporary>
      <v-list>
        <v-list-item v-for="link in items" :prepend-icon="link.icon" :to="`/${link.ruta}`" :title="link.title"
          :value="link.value"></v-list-item>
        <v-list-item prepend-icon="mdi-logout"> <v-btn color="error" @click="logout">Cerrar
            sesión</v-btn></v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getPersonUsuario } from '../utils/authdecode'
import { useRouter } from 'vuetify/lib/composables/router.mjs'
import { removeCookie } from '@/utils/cookies'

const usuario = ref(getPersonUsuario())
const items = [
  {
    title: 'Inicio',
    value: 'inicio',
    icon: 'mdi-home',
    ruta: ''
  },
  {
    title: 'Usuarios',
    value: 'usuarios',
    icon: 'mdi-account-group',
    ruta: 'usuarios'
  },
]

const logout = () => {
  removeCookie('user_token');
  window.location.href = '/login';
};

const drawer = ref(false)
const group = ref(null)

watch(group, () => {
  drawer.value = false
})
</script>