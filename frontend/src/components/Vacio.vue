<template>
  <v-empty-state headline="Está un poco vacío por aquí" title="No se encontraron elementos"
    :text="`Parece que no hay ${titulo} que mostrar en este momento. Intenta ajustar tus filtros o agregar un nuevo registro.`"
    image="https://cdn.vuetifyjs.com/docs/images/components/v-empty-state/teamwork.png" icon="mdi-magnify-scan">
  </v-empty-state>
</template>

<script setup>

const props = defineProps({
  titulo: { type: String, default: '' }
})
</script>