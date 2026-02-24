<template>
  <v-card class="document-container">
    <v-alert type="info" variant="tonal" :icon="false" class="ma-0 pa-2" v-if="documentUrl">
      <v-card-item class="pa-0">
        <template v-slot:prepend v-if="$vuetify.display.mdAndUp">
          <v-avatar color="primary" variant="tonal" size="40">
            <v-icon>mdi-file-document-outline</v-icon>
          </v-avatar>
        </template>
        <v-row align="center">
          <v-col cols="12" sm="6">
            <v-card-title class="text-subtitle-1 font-weight-medium text-wrap">
              {{ documentName }}.{{ displayName }}
            </v-card-title>

            <v-card-subtitle>
              <v-chip size="small" color="success" class="mt-2">
                • Documento
              </v-chip>
            </v-card-subtitle>
          </v-col>
          <v-col cols="12" sm="6" class="d-flex justify-center justify-sm-end">
            <v-btn variant="text" color="success" :href="documentUrl" :download="documentName" @click="handleDownload">
              <v-icon start>mdi-download</v-icon>
              Descargar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-item>
    </v-alert>

    <v-alert type="info" variant="tonal" :icon="false" class="ma-0" v-else>
      <v-icon start>mdi-file-remove-outline</v-icon>
      No hay documento disponible
    </v-alert>

  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  documentUrl: {
    type: String,
    default: null
  },
  documentName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['view-document', 'download-document'])

const displayName = computed(() => {
  if (!props.documentUrl) return 'Sin documento'

  const urlParts = props.documentUrl.split('/')
  const fileName = urlParts[urlParts.length - 1]
  return fileName.replace(/^[^-]+-\d+-\d+\./, '').replace(/\.\w+$/, '') || 'documento.docx'
})

const handleDownload = () => {
  emit('download-document', props.documentUrl)
}
</script>

<style scoped>
.document-container {
  transition: all 0.2s ease;
}

.document-container:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}
</style>