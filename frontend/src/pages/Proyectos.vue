<template>
  <v-container class="pa-0 pa-sm-4">
    <v-card-item title="Panel de control" class="px-2 px-sm-0 mt-5 mb-4">
      <v-row class="pt-2">
        <v-col cols="12" sm="auto" align="center" justify="center">
          <v-btn text="Nuevo proyecto" color="primary" prepend-icon="mdi-plus" @click="formulario.abrir()"></v-btn>
        </v-col>
      </v-row>
    </v-card-item>
    <v-col v-for="(p, index) in proyectos" :key="p.id_pro">
      <v-card elevation="5" :title="p.nombre" prepend-icon="mdi-package">
        <template v-slot:subtitle>
          <p class="text-wrap">
            Fecha de creación: {{ formatDate(p.fecha_creacion) }}
          </p>
        </template>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="7" class="text-subtitle-1 d-flex flex-column ga-2">
              <v-list>
                <v-list-item>
                  <template v-slot:prepend v-if="$vuetify.display.mdAndUp">
                    <v-avatar color="primary" variant="tonal" size="40">
                      <v-icon>mdi-text-box</v-icon>
                    </v-avatar>
                  </template>
                  {{ p.descripcion }}
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
                  <span class="font-italic font-weight-bold">
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
                  <span class="font-italic font-weight-bold">
                    Sin fecha establecida
                  </span>
                </v-list-item>
                <v-list-item>
                  <template v-slot:prepend v-if="$vuetify.display.mdAndUp">
                    <v-avatar color="primary" variant="tonal" size="40">
                      <v-icon>mdi-list-status</v-icon>
                    </v-avatar>
                  </template>
                  Estado <v-chip :color="estadoColor(p.estado)">{{ p.estado }}</v-chip> </v-list-item>
                <v-list-item>
                  <DocumentoBox :document-url="p.documento" :document-name="p.nombre" />
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
  </v-container>

  <Notificacion ref="alerta" />
  <ModalCrearProyecto ref="formulario" @api="guardar" @api-editar="editarApi" @limpiar="limpiar" :titulo="titulo"
    :listaEquipos="equipos" />
</template>

<script setup>
import DocumentoBox from '@/components/DocumentoBox.vue';
import ImagenBox from '@/components/ImagenBox.vue';
import ModalCrearProyecto from '@/components/modales/ModalCrearProyecto.vue';
import { apiCall, uploadFilesWithFetch } from '@/utils/apiCall';
import { computed, onMounted, ref } from 'vue';


const proyectos = ref([])
const alerta = ref([])
const formulario = ref(null)
const titulo = ref('Crear proyecto')
const equipos = ref([])

async function obtenerProyectos() {
  apiCall('proyectos')
    .then((result) => {
      proyectos.value = result.data.proyectos
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || 'Credenciales inválidas'
      })
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.data?.mensaje || 'Credenciales inválidas'
      })
    });
}

function recargar() {
  apiCall('proyectos')
    .then((result) => {
      proyectos.value = result.data.proyectos
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.data?.mensaje || 'Credenciales inválidas'
      })
    });
}

async function obtenerEquipos() {
  apiCall('equipos')
    .then((result) => {
      equipos.value = result.data.equipos
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || ''
      })
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.data?.mensaje || 'Credenciales inválidas'
      })
    });
}

async function guardar(formData) {
  await uploadFilesWithFetch('proyectos/crear', formData)
    .then((result) => {
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || 'Credenciales inválidas'
      })
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.data?.mensaje || 'Credenciales inválidas'
      })
    });
  formulario.value.cerrar()
  await recargar()
}

async function editarApi() {
  apiCall('proyectos')
    .then((result) => {
      proyectos.value = result.data.proyectos
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || 'Credenciales inválidas'
      })
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.data?.mensaje || 'Credenciales inválidas'
      })
    });
}

function limpiar() {
  titulo.value = 'Crear proyecto'
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
    'Inactivo': 'error',
    'Pendiente': 'warning'
  }[status] || 'status-default'
}


onMounted(() => {
  obtenerProyectos()
  obtenerEquipos()
})

</script>