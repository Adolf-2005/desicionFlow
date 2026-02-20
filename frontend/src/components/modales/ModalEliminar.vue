<template>
  <v-dialog v-model="show" max-width="400">
    <v-card class="pa-4 rounded-xl">
      <v-card-item class="text-center">
        <v-icon color="error" icon="mdi-alert-circle-outline" size="80" class="mb-4"></v-icon>
        <v-card-title class="text-h5 font-weight-bold">¿Estás seguro?</v-card-title>
      </v-card-item>

      <v-card-text class="text-center text-body-1">
        Esta acción eliminará a <strong>{{ itemNombre }}</strong> de forma permanente. No podrás deshacer este cambio.
      </v-card-text>

      <v-card-actions class="mt-4 px-4 pb-4 d-flex flex-column">
        <v-btn color="error" variant="elevated" block rounded="pill" :loading="loading" @click="confirmar">
          Sí, eliminar
        </v-btn>
        <v-btn variant="text" block rounded="pill" @click="cerrar">
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
const loading = ref(false)
const itemNombre = ref('')
let itemData = null

const emits = defineEmits(['confirmar'])

function abrir(nombre, data) {
  itemNombre.value = nombre
  itemData = data
  show.value = true
}

function cerrar() {
  show.value = false
  loading.value = false
}

function confirmar() {
  loading.value = true
  emits('confirmar', itemData)
}
defineExpose({ abrir, cerrar })
</script>