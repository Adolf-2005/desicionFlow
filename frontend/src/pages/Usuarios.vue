<template>
  <v-container>
    <v-card-item title="Panel de control" class="px-0 mt-5 mb-4">
      <v-row class="pt-2">
        <v-col cols="12" sm="auto" align="center" justify="center">
          <v-btn text="Crear usuario" color="primary" prepend-icon="mdi-plus" @click="formulario.abrir()"></v-btn>
        </v-col>
      </v-row>
    </v-card-item>
    <v-row>
      <v-col v-for="(u, index) in usuarios" :key="u.id_usu" cols="12" sm="6" md="4">
        <v-card elevation="2" border>
          <v-card-item class="text-center py-6 pb-0">
            <v-avatar size="80" color="primary" class="mb-3">
              <span class="text-h4 text-white">
                {{ u.nombre.charAt(0) }}{{ u.apellido.charAt(0) }}
              </span>
            </v-avatar>
            <v-card-title class="text-h6">
              {{ u.nombre }} {{ u.apellido }}
            </v-card-title>
            <v-card-subtitle>@{{ u.usuario }}</v-card-subtitle>
          </v-card-item>
          <v-card-text class="pt-4">
            <v-list density="compact">
              <v-list-item prepend-icon="mdi-id-card">
                <v-list-item-title class="text-body-2">
                  Cédula: {{ u.cedula }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item prepend-icon="mdi-shield-account">
                <v-list-item-title class="text-body-2">
                  Rol:
                  <v-chip :color="u.rol ? 'primary' : 'warning'" variant="tonal" class="ml-1">
                    {{ u.rol || 'Sin asignar' }}
                  </v-chip>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="justify-end">
            <v-btn variant="text" text="Editar" color="secondary" prepend-icon="mdi-pencil-outline"
              @click="editarUsuario(u)"></v-btn>
            <v-btn variant="text" text="Eliminar" color="error" prepend-icon="mdi-trash-can-outline"
              @click="eliminar.abrir(u.usuario, u.id_usu)"></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <ModalFormularios ref="formulario" :titulo="titulo" :fields="fields" @api="guardar" @apiEditar="editarApi"
    @limpiar="limpiar" />
  <Notificacion ref="alerta" />
  <ModalEliminar ref="eliminar" @confirmar="eliminarUsuario" />
</template>

<script setup>
import ModalEliminar from '@/components/modales/ModalEliminar.vue';
import ModalFormularios from '@/components/modales/ModalFormularios.vue';
import Notificacion from '@/components/Notificacion.vue';
import { apiCall } from '@/utils/apiCall';
import { constantes } from '@/utils/constantes';
import { capitalizeObject } from '@/utils/funciones';
import { computed, onMounted, ref } from 'vue';

const usuarios = ref([])
const alerta = ref(null)
const formulario = ref(null)
const eliminar = ref(null)
const titulo = ref('Crear usuarios')
const usuarioEdit = ref(false)
const formularioUsuarios = ref('usuarios')
const fields = computed(() => {
  return [
    { title: 'Nombre', type: 'text', row: true, key: 'nombre', subTitle: 'Apellido', subType: 'text', subKey: 'apellido' },
    { title: 'Prefijo', type: 'select', row: true, items: constantes.indentificacion, key: 'prefijo', subTitle: 'Cedula', subType: 'number', subKey: 'cedula' },
    { title: 'Usuario', type: 'text', row: false, key: 'usuario', readonly: usuarioEdit.value },
    { title: 'Contraseña', type: 'password', row: false, key: 'clave', edit: usuarioEdit.value },
    { title: 'Rol del usuario', type: 'select', row: false, key: 'rol', items: constantes.roles, object: false },
  ]
})

function limpiar() {
  usuarioEdit.value = false
  titulo.value = 'Crear usuario'
  formularioUsuarios.value = 'usuarios'
}


async function obtenerDatos() {
  await apiCall('usuarios')
    .then((result) => {
      usuarios.value = result.data.usuarios
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || 'Credenciales inválidas'
      })
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: 'Error',
        message: err.mensaje
      })
    });
}

async function recargar() {
  await apiCall('usuarios')
    .then((result) => {
      usuarios.value = result.data.usuarios
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: 'Error',
        message: err.mensaje
      })
    });
}

async function guardar(data) {
  const datos = capitalizeObject(data)
  datos.cedula = datos.prefijo + datos.cedula
  await apiCall('usuarios/crear', 'POST', datos)
    .then((result) => {
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || 'Credenciales inválidas'
      })
      recargar()
      formulario.value.cerrar()
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: 'Error',
        message: err.mensaje
      })
    });
}

async function editarApi(data) {
  const id_usu = data.id_usu
  const datos = capitalizeObject(data)
  datos.cedula = datos.prefijo + datos.cedula
  datos.id_usu = id_usu
  await apiCall('usuarios/editar', 'PUT', datos)
    .then((result) => {
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || 'Credenciales inválidas'
      })
      recargar()
      formulario.value.cerrar()
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: 'Error',
        message: err.mensaje
      })

    });
}

function editarUsuario(datos) {
  const record = {
    id_usu: datos.id_usu,
    nombre: datos.nombre,
    apellido: datos.apellido,
    usuario: datos.usuario,
    prefijo: datos.cedula.split('-')[0] + '-',
    cedula: datos.cedula.split('-')[1],
    rol: datos.rol,
    clave: null,
  }
  usuarioEdit.value = true
  formulario.value.abrir(record, true)
  titulo.value = 'Editar usuario'
}

async function eliminarUsuario(id) {
  await apiCall('usuarios/eliminar', 'DELETE', { id_usu: id })
    .then((result) => {
      alerta.value.notify({
        type: result.data?.status == 200 ? 'success' : 'error',
        title: '',
        message: result.data?.mensaje || 'Credenciales inválidas'
      })
      recargar()
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: 'Error',
        message: err.mensaje
      })
    });
  eliminar.value.cerrar()
}

onMounted(() => {
  obtenerDatos()
})

</script>