<template>
  <v-snackbar v-model="show" :color="color" :timeout="timeout" location="top right" elevation="24" style="z-index: 9999999;">
    <div class="d-flex align-center">
      <v-icon :icon="icon" class="me-3"></v-icon>
      <div>
        <div class="text-subtitle-2 font-weight-bold">{{ title }}</div>
        <div class="text-caption">{{ message }}</div>
      </div>
    </div>
    <template v-slot:actions>
      <v-btn variant="text" icon="mdi-close" @click="show = false"></v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
const message = ref('')
const title = ref('')
const color = ref('success')
const icon = ref('mdi-check-circle')
const timeout = ref(5000)

// Función para disparar la notificación
const notify = (config) => {
  message.value = config.message || ''
  title.value = config.title || (config.type === 'error' ? 'Error' : 'Éxito')
  color.value = config.type === 'error' ? 'error' : 'success'
  icon.value = config.type === 'error' ? 'mdi-alert-circle' : 'mdi-check-circle'
  timeout.value = config.timeout || 5000
  show.value = true
}

// Exponemos la función para que el padre pueda usarla con una ref
defineExpose({ notify })
</script>