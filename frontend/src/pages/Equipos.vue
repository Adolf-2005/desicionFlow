<template>
  <v-container>
    <v-card-item title="Panel de control" class="px-2 px-sm-0 mt-5 mb-4">
      <v-row class="pt-2">
        <v-col cols="12" sm="auto" align="center" justify="center">
          <v-btn text="Crear usuario" color="primary" prepend-icon="mdi-plus" @click="crearEquipo"></v-btn>
        </v-col>
      </v-row>
    </v-card-item>
    <v-row>
      <v-col cols="12" v-for="e in equipos">
        <v-card class="mx-auto" elevation="5" prepend-icon="mdi-account-group">
          <template v-slot:title>
            {{ e.nombre }}
          </template>

          <template v-slot:subtitle>
            Fecha: {{ formatDate(e.fecha) }}
          </template>

          <v-card-text>
            <p class="text-body-1">{{ e.descripcion }}</p>

            <v-divider class="my-4"></v-divider>

            <h3 class="text-h6 mb-3">Miembros del equipo ({{ e.miembros.length }})</h3>

            <v-list lines="two">
              <v-list-item v-for="miembro in e.miembros" :key="miembro.id_usu"
                :title="`${miembro.nombre} ${miembro.apellido}`">
                <template v-slot:prepend v-if="$vuetify.display.mdAndUp">
                  <v-icon>
                    {{ miembro.rol === 'Jefe' ? 'mdi-account-star-outline' : 'mdi-account-outline' }}
                  </v-icon>
                </template>
                <v-row>
                  <v-col cols="12" sm="6">
                    @{{ miembro.usuario }} | Ingresó: {{ formatDate(miembro.fecha_ingreso) }}
                    <br>
                    <v-chip size="small" class="mt-2" color="success">
                      {{ miembro.rol }}
                    </v-chip>
                  </v-col>
                  <v-col cols="12" sm="6" class="d-flex justify-center justify-sm-end">
                    <v-btn color="error" size="small" text="Eliminar" @click="abrirMiembro(miembro)"></v-btn>
                  </v-col>
                </v-row>
                <v-divider class="mt-2" thickness="5"></v-divider>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-btn text="Editar" prepend-icon="mdi-pencil" color="primary" @click="editar(e)"></v-btn>
            <v-btn text="Eliminar" prepend-icon="mdi-delete" color="error"
              @click="eliminar.abrir(e.nombre, e.id_equi)"></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <Vacio titulo="Equipos" v-if="!equipos.length" />
  </v-container>
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
        <v-btn color="error" variant="elevated" block rounded="pill" :loading="loading" @click="eliminarMiembro">
          Sí, eliminar
        </v-btn>
        <v-btn variant="text" block rounded="pill" @click="cerrarMiembro">
          Cancelar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <ModalCrearEquipos ref="formulario" :titulo="titulo" :listaUsuario="listaUsuario" @api="guardar"
    @api-editar="editarApi" />
  <ModalEliminar ref="eliminar" @confirmar="eliminarEquipo" />
  <Notificacion ref="alerta" />
</template>

<script setup>
import ModalCrearEquipos from '@/components/modales/ModalCrearEquipos.vue';
import ModalEliminar from '@/components/modales/ModalEliminar.vue';
import Notificacion from '@/components/Notificacion.vue';
import Vacio from '@/components/Vacio.vue';
import { apiCall } from '@/utils/apiCall';
import { computed, onMounted, ref } from 'vue';


const equipos = ref([])
const alerta = ref(null)
const formulario = ref(null)
const eliminar = ref(null)
const show = ref(false)
const itemNombre = ref('')
const miembroEliminar = ref(null)
const titulo = ref('Crear equipo')
const listaUsuario = ref([])
const loading = ref(false)

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

async function obtenerMiembros() {
  apiCall('usuarios')
    .then((result) => {
      listaUsuario.value = result.data.usuarios
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.data?.mensaje || 'Credenciales inválidas'
      })
    });
}

function recargar() {
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
  apiCall('usuarios')
    .then((result) => {
      listaUsuario.value = result.data.usuarios
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.data?.mensaje || 'Credenciales inválidas'
      })
    });
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function guardar(data) {
  apiCall('equipos/crear', 'POST', data)
    .then((result) => {
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || ''
      })
      formulario.value.cerrar()
      recargar()
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.data?.mensaje || 'Credenciales inválidas'
      })
    });
}

function eliminarEquipo(id) {
  const obj = {
    id_equi: id
  }
  apiCall('equipos/eliminar', 'DELETE', obj)
    .then((result) => {
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || ''
      })
      eliminar.value.cerrar()
      recargar()
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.data?.mensaje || 'Credenciales inválidas'
      })
    });
}

function abrirMiembro(miembro) {
  itemNombre.value = miembro.nombre + ' ' + miembro.apellido
  miembroEliminar.value = {
    id_equi: miembro.id_equi,
    id_usu: miembro.id_usu
  }
  show.value = true
}

function cerrarMiembro() {
  itemNombre.value = ''
  show.value = false
}

function eliminarMiembro() {
  const obj = {
    id_usu: miembroEliminar.value.id_usu,
    id_equi: miembroEliminar.value.id_equi
  }
  apiCall('equipos/eliminar/miembro', 'DELETE', obj)
    .then((result) => {
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || ''
      })
      cerrarMiembro()
      recargar()
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.data?.mensaje || 'Credenciales inválidas'
      })
    });
}

function editarApi(data) {
  apiCall('equipos/editar', 'PUT', data)
    .then((result) => {
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || ''
      })
      formulario.value.cerrar()
      recargar()
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.data?.mensaje || 'Credenciales inválidas'
      })
    });
}

function editar(datos) {
  titulo.value = 'Editar equipo'
  formulario.value.editando = true
  const record = {
    id_equi: datos.id_equi,
    nombre: datos.nombre,
    descripcion: datos.descripcion,
  }
  const miembros = datos.miembros
  formulario.value.abrir(record, miembros)
}

function crearEquipo() {
  titulo.value = 'Crear equipo'
  formulario.value.editando = false
  formulario.value.abrir({}, [])
}

onMounted(() => {
  obtenerEquipos()
  obtenerMiembros()
})

</script>