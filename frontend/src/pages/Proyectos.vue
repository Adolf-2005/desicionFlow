<template>
  <v-container class="pa-0 pa-sm-4">
    <v-card-item title="Panel de control" class="px-2 px-sm-0 mt-5 mb-4">
      <v-row class="pt-2">
        <v-col cols="12" sm="auto" align="center" justify="center">
          <v-btn text="Nuevo proyecto" color="primary" prepend-icon="mdi-plus" @click="formulario.abrir()"></v-btn>
        </v-col>
      </v-row>
    </v-card-item>
    <v-card-title>
      Lista de proyectos
    </v-card-title>
    <v-col v-for="(p, index) in proyectos" :key="p.id_pro">
      <v-card elevation="5" prepend-icon="mdi-package">
        <template #title>
          <span class="text-capitalize">
            {{ p.nom_pro }}
          </span>
        </template>
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
                  <DocumentoBox :document-url="p.documento" :document-name="p.nombre" />
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" md="5" align-self="center">
              <ImagenBox :imageUrl="p.imagen" :alt="p.nombre" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row class="pt-2">
            <v-col cols="auto" align="center" justify="center">
              <v-btn text="Editar proyecto" color="primary" prepend-icon="mdi-plus" @click="formulario.abrir()"></v-btn>
            </v-col>
            <v-col cols="auto" align="center" justify="center">
              <v-btn text="Cambiar estado" color="primary" prepend-icon="mdi-reload" @click=""></v-btn>
            </v-col>
            <v-col cols="auto" align="center" justify="center">
              <v-btn text="Cambiar lider" color="primary" prepend-icon="mdi-account-convert" @click=""></v-btn>
            </v-col>
            <v-col cols="auto" align="center" justify="center">
              <v-btn text="Cambiar equipo" color="primary" prepend-icon="mdi-account-group-outline" @click=""></v-btn>
            </v-col>
            <v-col cols="auto" align="center" justify="center">
              <v-btn text="Inicio/Cierre" color="primary" prepend-icon="mdi-clipboard-text-clock" @click=""></v-btn>
            </v-col>
            <v-col cols="auto" align="center" justify="center">
              <v-btn text="Eliminar" color="error" prepend-icon="mdi-delete-empty" @click="eliminar.abrir(p.nombre, p.id_pro)"></v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-container>

  <ModalEliminar ref="eliminar" @confirmar=""/>
  <Notificacion ref="alerta" />
  <ModalCrearProyecto ref="formulario" @api="guardar" @api-editar="editarApi" @limpiar="limpiar" :titulo="titulo"
    :listaEquipos="equipos" />
</template>

<script setup>
import DocumentoBox from '@/components/DocumentoBox.vue';
import ImagenBox from '@/components/ImagenBox.vue';
import ModalCrearProyecto from '@/components/modales/ModalCrearProyecto.vue';
import ModalEliminar from '@/components/modales/ModalEliminar.vue';
import { apiCall, uploadFilesWithFetch } from '@/utils/apiCall';
import { computed, onMounted, ref } from 'vue';


const proyectos = ref([])
const alerta = ref([])
const formulario = ref(null)
const eliminar = ref(null)
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
  apiCall('equipos')
    .then((result) => {
      equipos.value = result.data.equipos
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
      if (proyectos.value.length > 0) {
        proyectos.value.forEach(p => {
          proyectos.value.equipo = equipos.value.filter(e => e.id_equi === p.id_equipo)
        })
      }
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