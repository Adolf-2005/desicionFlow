<template>
  <v-container class="pa-0 pa-sm-4">
    <v-card-title>
      Lista de proyectos
    </v-card-title>
    <div v-if="proyectos.length && !carga">
      <v-col v-for="(p, index) in proyectos" :key="p.id_pro">
        <v-card elevation="5" prepend-icon="mdi-package">
          <template #title>
            <v-row class="pa-1">
              <v-col cols="12" sm="6">
                <span class="text-capitalize">
                  {{ p.nom_pro }}
                </span>
              </v-col>
              <v-col cols="12" sm="6" class="d-flex justify-sm-end">
                <v-btn color="secondary" @click="$router.push(`detallesProyecto/${p.id_pro}`)" text="Ver detalles"
                  class="rounded-pill" prepend-icon="mdi-eye">
                </v-btn>
              </v-col>
            </v-row>
          </template>
          <template v-slot:subtitle>
            <p class="text-wrap">
              Fecha de creación: {{ formatDate(p.fecha_creacion) }}
            </p>
          </template>
          <v-card-text style="max-height: 500px; overflow: auto;">
            <v-row>
              <v-col cols="12" md="7" class="text-subtitle-1 d-flex flex-column ga-2">
                <v-list>
                  <v-list-item>
                    <template v-slot:prepend v-if="$vuetify.display.mdAndUp">
                      <v-avatar color="primary" variant="tonal" size="40">
                        <v-icon>mdi-text-box</v-icon>
                      </v-avatar>
                    </template>
                    {{ p.des_pro }}
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend v-if="$vuetify.display.mdAndUp">
                      <v-avatar color="primary" variant="tonal" size="40">
                        <v-icon>mdi-calendar-import</v-icon>
                      </v-avatar>
                    </template>
                    Fecha de inicio
                    <span v-if="p.fecha_inicio">
                      {{ formatDate(p.fecha_inicio) }}
                    </span>
                    <span v-else class="font-italic font-weight-bold">
                      Sin fecha establecida
                    </span>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend v-if="$vuetify.display.mdAndUp">
                      <v-avatar color="primary" variant="tonal" size="40">
                        <v-icon>mdi-sort-calendar-ascending</v-icon>
                      </v-avatar>
                    </template>
                    Fecha de cierre
                    <span v-if="p.fecha_cierre">
                      {{ formatDate(p.fecha_cierre) }}
                    </span>
                    <span v-else class="font-italic font-weight-bold">
                      Sin fecha establecida
                    </span>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend v-if="$vuetify.display.mdAndUp">
                      <v-avatar color="primary" variant="tonal" size="40">
                        <v-icon>mdi-list-status</v-icon>
                      </v-avatar>
                    </template>
                    Estado <v-chip :color="estadoColor(p.estado)">{{ p.estado }}</v-chip>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend v-if="$vuetify.display.mdAndUp">
                      <v-avatar color="primary" variant="tonal" size="40">
                        <v-icon>mdi-microsoft-teams</v-icon>
                      </v-avatar>
                    </template>
                    <div class="d-flex flex-column justify-start align-start">
                      <span>
                        Equipo asignado
                        <v-chip :color="p.nom_equi ? 'success' : 'warning'" tonal>
                          {{ p.nom_equi ? p.nom_equi : 'Sin equipo asignado' }}
                        </v-chip>
                      </span>
                      <small>{{ p.des_equi ? p.des_equi : '' }}</small>
                    </div>
                  </v-list-item>
                  <v-list-item :title="p.nom_lider" :subtitle="'@' + p.usuario" v-if="p.id_responsable">
                    <template v-slot:prepend v-if="$vuetify.display.mdAndUp">
                      <v-avatar color="primary" variant="tonal" size="40">
                        <v-icon>mdi-account-tie-hat</v-icon>
                      </v-avatar>
                    </template>
                  </v-list-item>
                  <v-list-item>
                    <DocumentoBox :document-url="p.documento" :documentName="p.nom_pro" />
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="5" align-self="center">
                <ImagenBox :imageUrl="p.imagen" :alt="p.nombre" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </div>
    <Vacio v-else-if="!carga && !proyectos.length" :titulo="'Proyectos'" />
    <Cargando v-else-if="carga" />
  </v-container>
  <Notificacion ref="alerta" />

</template>

<script setup>
import Cargando from '@/components/Cargando.vue';
import DocumentoBox from '@/components/DocumentoBox.vue';
import ImagenBox from '@/components/ImagenBox.vue';
import Notificacion from '@/components/Notificacion.vue';
import { apiCall } from '@/utils/apiCall';
import { onMounted, ref } from 'vue';

const proyectos = ref([])
const alerta = ref([])
const carga = ref(false)

async function obtenerProyectos() {
  carga.value = true
  apiCall('proyectos/asignados')
    .then((result) => {
      proyectos.value = result.data.proyectos
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || 'Credenciales inválidas'
      })
      carga.value = false
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.mensaje || 'Credenciales inválidas'
      })
      carga.value = false
    });
}

// Utilidades
const formatDate = (dateString) => {
  if (!dateString) return 'No disponible'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const estadoColor = (status) => {
  return {
    'Activo': 'success',
    'Cancelado': 'error',
    'Completado': 'primary'
  }[status] || 'status-default'
}


onMounted(() => {
  obtenerProyectos()
})

</script>