<template>
  <v-dialog v-model="show" :width="$vuetify.display.smAndDown ? '95%' : '40%'" persistent="">
    <v-card>
      <v-card-title>
        <v-row class="pa-2">
          <v-col>
            {{ titulo }}
          </v-col>
          <v-col align="end">
            <v-btn icon="mdi-close" @click="cerrar"></v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valido">
          <v-col v-if="estado">
            <v-select v-model="record.estado" label="Estado del proyecto" :items="['Activo', 'Completado', 'Cancelado']"
              variant="outlined" density="compact" :rules="[rules.required]">
            </v-select>
          </v-col>
          <v-col v-if="equipo">
            <v-select v-model="record.id_equipo" label="Equipo" variant="outlined" :items="listaEquipos"
              item-title="nombre" item-value="id_equi" :item-props="nombresEquipo" autocomplete="off" density="compact">
            </v-select>
          </v-col>
          <v-col v-if="lider">
            <v-select v-model="record.id_responsable" label="Equipo" variant="outlined" :items="listaUsuarios"
              item-title="nombre" item-value="id_usu" :item-props="nombresUsuarios" autocomplete="off"
              density="compact">
            </v-select>
          </v-col>
          <v-col v-if="fechas">
            <v-text-field v-model="record.inicio" label="Fecha de inicio" variant="outlined" density="compact"
              type="date"></v-text-field>
            <v-text-field v-model="record.cierre" label="Fecha de cierre" variant="outlined" density="compact"
              type="date"></v-text-field>
          </v-col>
          <v-btn color="primary" size="large" variant="elevated" block rounded="pill" :loading="cargando"
            :disabled="!valido" @click="enviarApi">
            {{ titulo }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
  <Notificacion ref="alerta" />
</template>

<script setup>
import { rules } from '@/utils/rules';
import { ref } from 'vue';
import Notificacion from '../Notificacion.vue';
import { apiCall } from '@/utils/apiCall';

const show = ref(false)
const valido = ref(null)
const record = ref({})
const titulo = ref('')
const cargando = ref(false)
const alerta = ref(null)
const estado = ref(false)
const fechas = ref(false)
const equipo = ref(false)
const lider = ref(false)

const props = defineProps({
  listaEquipos: { type: Array },
  listaUsuarios: { type: Array },
})

const emit = defineEmits(['recargar'])

function enviarApi() {
  cargando.value = true
  if (estado.value) {
    apiCall('proyectos/estado', 'PUT', record.value)
      .then((result) => {
        alerta.value.notify({
          type: 'success',
          title: '',
          message: result.data?.mensaje || 'Credenciales inválidas'
        })
        emit('recargar')
        cerrar()
      }).catch((err) => {
        alerta.value.notify({
          type: 'error',
          title: '',
          message: err.mensaje || 'Credenciales inválidas'
        })
        cargando.value = true
      });
  } else if (fechas.value) {
    apiCall('proyectos/fechas', 'PUT', record.value)
      .then((result) => {
        alerta.value.notify({
          type: 'success',
          title: '',
          message: result.data?.mensaje || 'Credenciales inválidas'
        })
        emit('recargar')
        cerrar()
      }).catch((err) => {
        alerta.value.notify({
          type: 'error',
          title: '',
          message: err.mensaje || 'Credenciales inválidas'
        })
        cargando.value = true
      });
  } else if (lider.value) {
    apiCall('proyectos/lider', 'PUT', record.value)
      .then((result) => {
        alerta.value.notify({
          type: 'success',
          title: '',
          message: result.data?.mensaje || 'Credenciales inválidas'
        })
        emit('recargar')
        cerrar()
      }).catch((err) => {
        alerta.value.notify({
          type: 'error',
          title: '',
          message: err.mensaje || 'Credenciales inválidas'
        })
        cargando.value = true
      });
  } else if (equipo.value) {
    apiCall('proyectos/cambiarEquipo', 'PUT', record.value)
      .then((result) => {
        alerta.value.notify({
          type: 'success',
          title: '',
          message: result.data?.mensaje || 'Credenciales inválidas'
        })
        emit('recargar')
        cerrar()
      }).catch((err) => {
        alerta.value.notify({
          type: 'error',
          title: '',
          message: err.mensaje || 'Credenciales inválidas'
        })
        cargando.value = true
      });
  }
}

const nombresEquipo = (item) => {
  return {
    title: item.nombre,
    prependIcon: 'mdi-microsoft-teams',
    value: item.id_equi
  }
}

const nombresUsuarios = (item) => {
  return {
    title: item.nombre + ' ' + item.apellido,
    prependIcon: item.rol == 'Admin' ? 'mdi-account-tie' : 'mdi-account',
    subtitle: '@' + item.usuario,
    value: item.id_usu
  }
}

function abrirEstado(datos = {}) {
  record.value = { ...datos };
  show.value = true;
  titulo.value = 'Cambiar estado'
  estado.value = true
}

function abrirFechas(datos = {}) {
  record.value = { ...datos };
  show.value = true;
  titulo.value = 'Agregar fechas'
  fechas.value = true
}

function abrirEquipo(datos = {}) {
  record.value = { ...datos };
  show.value = true;
  titulo.value = 'Cambiar equipo'
  equipo.value = true
}

function abrirLider(datos = {}) {
  record.value = { ...datos };
  show.value = true;
  titulo.value = 'Cambiar líder'
  lider.value = true
}


function cerrar() {
  cargando.value = false
  show.value = false
  fechas.value = false
  estado.value = false
  equipo.value = false
  lider.value = false
}

defineExpose({ abrirFechas, abrirEstado, abrirEquipo, abrirLider, cerrar })

</script>