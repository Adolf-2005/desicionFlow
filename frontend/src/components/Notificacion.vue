<template>
  <v-snackbar v-model="show" :color="color" :timeout="timeout" :location="location" :width="isMobile ? '90%' : 'auto'"
    elevation="24" style="z-index: 9999999;">
    <div class="d-flex align-center">
      <v-icon :icon="icon" :size="isMobile ? 'small' : 'default'" class="me-3"></v-icon>
      <div class="overflow-hidden">
        <div class="text-subtitle-2 font-weight-bold text-truncate">{{ title }}</div>
        <div class="text-caption text-wrap">{{ message }}</div>
      </div>
    </div>

    <template v-slot:actions>
      <v-btn variant="text" :size="isMobile ? 'small' : 'default'" icon="mdi-close" @click="show = false"></v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'

// Herramientas de visualización de Vuetify
const { xs } = useDisplay()

const show = ref(false)
const message = ref('')
const title = ref('')
const color = ref('success')
const icon = ref('mdi-check-circle')
const timeout = ref(5000)

// Lógica responsive
const isMobile = computed(() => xs.value)
const location = computed(() => isMobile.value ? 'top center' : 'top right')

const notify = (config) => {
  message.value = config.message || ''
  title.value = config.title || (config.type === 'error' ? 'Error' : 'Éxito')
  color.value = config.type === 'error' ? 'error' : 'success'
  icon.value = config.type === 'error' ? 'mdi-alert-circle' : 'mdi-check-circle'
  timeout.value = config.timeout || 5000
  show.value = true
}

defineExpose({ notify })
</script>

<style scoped>
.text-wrap {
  word-break: break-word;
}
</style>