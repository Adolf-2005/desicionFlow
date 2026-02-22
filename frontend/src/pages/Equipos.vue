<template>
  <v-container>
    <v-row class="pt-2">
      <v-col cols="12" sm="auto" align="center" justify="center">
        <v-btn text="Crear usuario" color="primary" prepend-icon="mdi-plus" @click="formulario.abrir()"></v-btn>
      </v-col>
    </v-row>
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
                    <v-btn color="error" size="small" text="Eliminar"></v-btn>
                  </v-col>
                </v-row>
                <v-divider class="mt-2" thickness="5"></v-divider>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <ModalFormularios ref="formulario" :titulo="titulo" :fields="fields" @api="guardar" @apiEditar="editarApi" />
  <Notificacion ref="alerta" />
</template>

<script setup>
import Notificacion from '@/components/Notificacion.vue';
import { apiCall } from '@/utils/apiCall';
import { computed, onMounted, ref } from 'vue';


const equipos = ref([])
const alerta = ref(null)
const formulario = ref(null)
const titulo = ref('Crear equipo')
const fields = computed(() => {
  return [
    { title: 'Nombre', type: 'text', row: true, key: 'nombre', subTitle: 'Apellido', subType: 'text', subKey: 'apellido' },
    { title: 'Prefijo', type: 'select', row: true, items: [], key: 'prefijo', subTitle: 'Cedula', subType: 'number', subKey: 'cedula' },
    { title: 'Usuario', type: 'text', row: false, key: 'usuario' },
    { title: 'Contraseña', type: 'password', row: false, key: 'clave' },
    { title: 'Rol del usuario', type: 'select', row: false, key: 'rol', items: [], object: false },
  ]
})

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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function guardar() {

}

function editarApi() {

}

onMounted(() => {
  obtenerEquipos()
})

</script>