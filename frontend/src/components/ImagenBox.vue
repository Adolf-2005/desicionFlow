<template>
  <v-card class="image-container" flat>
    <v-img v-if="imageUrl" :src="imageUrl" :alt="alt"  class="project-image" max-height="300px"
      @error="handleImageError">
      <template v-slot:error>
        <v-alert type="error" variant="tonal" class="ma-4">
          Error al cargar la imagen
        </v-alert>
      </template>
    </v-img>

    <v-sheet v-else class="no-image d-flex align-center justify-center" color="grey-lighten-3" height="200">
      <v-icon size="48" color="grey-darken-1">mdi-image-off</v-icon>
      <span class="text-grey-darken-1 mt-2">No hay imagen disponible</span>
    </v-sheet>
  </v-card>
</template>

<script setup>
const props = defineProps({
  imageUrl: {
    type: String,
    default: null
  },
  alt: {
    type: String,
    default: 'Imagen del proyecto'
  }
})

const emit = defineEmits(['image-error'])

const handleImageError = () => {
  emit('image-error', 'Error al cargar la imagen')
}
</script>

<style scoped>
.image-container {
  border-radius: 8px;
  overflow: hidden;
}

.no-image {
  flex-direction: column;
  min-height: 200px;
}
</style>