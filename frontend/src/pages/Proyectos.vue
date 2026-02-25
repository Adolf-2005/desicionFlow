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
    <div v-if="proyectos.length">
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
                <v-btn color="secondary" @click="$router.push(`detallesProyecto/${p.id_pro}`)" text="Ver detalles" class="rounded-pill" prepend-icon="mdi-eye">
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
          <v-card-actions>
            <v-row class="pt-2">
              <v-col cols="auto" align="center" justify="center">
                <v-btn text="Editar proyecto" color="primary" prepend-icon="mdi-plus"
                  @click="editarProyecto(p)"></v-btn>
              </v-col>
              <v-col cols="auto" align="center" justify="center">
                <v-btn text="Cambiar estado" color="primary" prepend-icon="mdi-reload" @click="estado(p)"></v-btn>
              </v-col>
              <v-col cols="auto" align="center" justify="center">
                <v-btn text="Cambiar lider" color="primary" prepend-icon="mdi-account-convert"
                  @click="lideres(p)"></v-btn>
              </v-col>
              <v-col cols="auto" align="center" justify="center">
                <v-btn text="Cambiar equipo" color="primary" prepend-icon="mdi-account-group-outline"
                  @click="equipoModal(p)"></v-btn>
              </v-col>
              <v-col cols="auto" align="center" justify="center">
                <v-btn text="Inicio/Cierre" color="primary" prepend-icon="mdi-clipboard-text-clock"
                  @click="fechas(p)"></v-btn>
              </v-col>
              <v-col cols="auto" align="center" justify="center">
                <v-btn text="Eliminar" color="error" prepend-icon="mdi-delete-empty"
                  @click="eliminar.abrir(p.nombre, { id_pro: p.id_pro, imagen: p.imagen, documento: p.documento })"></v-btn>
              </v-col>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-col>
    </div>
    <Vacio v-else :titulo="'Proyectos'"/>
  </v-container>

  <ModalEliminar ref="eliminar" @confirmar="eliminarProyecto" />
  <ModalStatusFechas ref="statusFecha" :listaEquipos="equipos" :listaUsuarios="usuarios" @recargar="recargar" />
  <Notificacion ref="alerta" />
  <ModalCrearProyecto ref="formulario" @api="guardar" @api-editar="editarApi" @limpiar="limpiar" :titulo="titulo"
    :listaEquipos="equipos" />
</template>

<script setup>
import DocumentoBox from '@/components/DocumentoBox.vue';
import ImagenBox from '@/components/ImagenBox.vue';
import ModalCrearProyecto from '@/components/modales/ModalCrearProyecto.vue';
import ModalEliminar from '@/components/modales/ModalEliminar.vue';
import ModalStatusFechas from '@/components/modales/ModalStatusFechas.vue';
import { apiCall, apiCallFiles, uploadFilesWithFetch } from '@/utils/apiCall';
import { onMounted, ref } from 'vue';


const proyectos = ref([])
const alerta = ref([])
const formulario = ref(null)
const statusFecha = ref(null)
const eliminar = ref(null)
const titulo = ref('Crear proyecto')
const equipos = ref([])
const usuarios = ref([])

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
        message: err.mensaje || 'Credenciales inválidas'
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
        message: err.mensaje || 'Credenciales inválidas'
      })
    });
  apiCall('equipos')
    .then((result) => {
      equipos.value = result.data.equipos
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.mensaje || 'Credenciales inválidas'
      })
    });
  apiCall('usuarios')
    .then((result) => {
      usuarios.value = result.data.usuarios
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.mensaje || 'Credenciales inválidas'
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
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.mensaje || 'Credenciales inválidas'
      })
    });
}

async function obtenerUsuarios() {
  apiCall('usuarios')
    .then((result) => {
      usuarios.value = result.data.usuarios
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.mensaje || 'Credenciales inválidas'
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
        message: err.mensaje || 'Credenciales inválidas'
      })
    });
  formulario.value.cerrar()
  await recargar()
}

function eliminarProyecto(datos) {
  let urlDoc = null
  let urlImg = null
  if (datos.documento) {
    urlDoc = datos.documento.split('/')
  }

  if (datos.imagen) {
    urlImg = datos.imagen.split('/')
  }
  const obj = {
    imagen: urlImg ? urlImg.pop() : null,
    documento: urlDoc ? urlDoc.pop() : null,
    id_pro: datos.id_pro
  }
  apiCall('proyectos/eliminar', 'DELETE', obj)
    .then((result) => {
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || 'Credenciales inválidas'
      })
      recargar()
      eliminar.value.cerrar()
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.mensaje || 'Credenciales inválidas'
      })
    });
}

function editarProyecto(data) {
  const record = {
    id_pro: data.id_pro,
    nombre: data.nom_pro,
    descripcion: data.des_pro,
    id_equipo: equipos.value.find(e => e.id_equi == data.id_equipo),
  }
  formulario.value.editar = true
  titulo.value = 'Editar proyecto'
  formulario.value.abrir(record)
}

async function editarApi(formData) {
  uploadFilesWithFetch('proyectos/editar', formData)
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
        message: err.mensaje || 'Credenciales inválidas'
      })
    });
  formulario.value.cerrar()
  await recargar()
}

function limpiar() {
  titulo.value = 'Crear proyecto'
}

function equipoModal(data) {
  const record = {
    id_pro: data.id_pro,
    id_equipo: equipos.value.find(e => e.id_equi === data.id_equipo)
  }
  statusFecha.value.abrirEquipo(record)
}

function estado(data) {
  const record = {
    id_pro: data.id_pro,
    estado: data.estado || null,
  }
  statusFecha.value.abrirEstado(record)
}

function fechas(data) {
  const aFormatoInput = (fecha) => {
    if (!fecha) return null;
    const d = new Date(fecha);
    return d.toISOString().split('T')[0];
  };
  const record = {
    id_pro: data.id_pro,
    inicio: aFormatoInput(data.fecha_inicio),
    cierre: aFormatoInput(data.fecha_cierre)
  };
  statusFecha.value.abrirFechas(record)
}

function lideres(data) {
  const record = {
    id_pro: data.id_pro,
    id_responsable: usuarios.value.find(e => e.id_usu === data.id_responsable) || null,
  }
  statusFecha.value.abrirLider(record)
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
  obtenerEquipos()
  obtenerUsuarios()
})

</script>