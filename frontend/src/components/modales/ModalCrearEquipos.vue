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
          <v-col>
            <v-text-field v-model="record.nombre" label="Nombre" variant="outlined"
              :rules="[rules.required, rules.empty]" type="text" autocomplete="off" density="compact">
            </v-text-field>
          </v-col>
          <v-col>
            <v-textarea v-model="record.descripcion" label="Descripcion" variant="outlined"
              :rules="[rules.required, rules.empty]" rows="2" autocomplete="off" density="compact" no-resize>
            </v-textarea>
          </v-col>
          <v-col>
            <v-row>
              <v-col cols="12" sm="5">
                <v-autocomplete v-model="participante" label="Miembro" variant="outlined" :items="listaUsuario"
                  item-title="nombre" item-value="id_usu" :item-props="nombresUsuarios" return-object autocomplete="off"
                  density="compact">
                </v-autocomplete>
              </v-col>
              <v-col cols="12" sm="5">
                <v-select v-model="rol" label="Rol en el equipo" :items="['Asistente', 'Jefe', 'Miembro']"
                  variant="outlined" density="compact">
                </v-select>
              </v-col>
              <v-col cols="12" sm="auto">
                <v-btn color="primary" icon="mdi-plus" class="mb-4" size="small" title="Agregar miembro"
                  @click="agregarMiembro">
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" v-if="listaMiembros.length" class="pa-0">
            <v-list>
              <v-list-item v-for="(m, index) in listaMiembros">
                <v-row>
                  <v-col cols="12" sm="10">
                    <p>
                      {{ m.nombre }} {{ m.apellido }} <v-chip color="success" variant="tonal" size="small">{{ m.rol
                      }}</v-chip> <br>
                      <small class="font-weight-bold">
                        @{{ m.usuario }}
                      </small>
                    </p>
                  </v-col>
                  <v-col cols="12" sm="2" class="d-flex justify-sm-end">
                    <v-btn icon="mdi-delete" color="error" size="small" @click="eliminarMiembro(index)">
                    </v-btn>
                  </v-col>
                </v-row>
                <v-divider class="mt-1" thickness="2"></v-divider>
              </v-list-item>
            </v-list>
          </v-col>
          <v-btn v-if="!editando" color="primary" size="large" variant="elevated" block rounded="pill" :loading="cargando"
            :disabled="!valido" @click="enviarApi">
            {{ titulo }}
          </v-btn>
          <v-btn v-else color="primary" size="large" variant="elevated" block rounded="pill" :loading="cargando"
            :disabled="!valido" @click="enviarApiEditar">
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
import { computed, ref } from 'vue';
import Notificacion from '../Notificacion.vue';

const show = ref(false)
const valido = ref(null)
const record = ref({})
const listaMiembros = ref([])
const participante = ref(null)
const rol = ref(null)
const cargando = ref(false)
const alerta = ref(null)
const editando = ref(false)
const props = defineProps({
  titulo: { type: String, required: true },
  listaUsuario: { type: Object, required: true }
})

const nombresUsuarios = (item) => {
  return {
    title: item.nombre + ' ' + item.apellido,
    prependIcon: item.rol == 'Admin' ? 'mdi-account-tie' : 'mdi-account',
    subtitle: '@' + item.usuario,
    value: item
  }
}

const agregarMiembro = () => {
  const existente = listaMiembros.value.filter(u => u.id_usu === participante.value.id_usu)
  if (existente.length > 0) {
    alerta.value.notify({
      type: 'error',
      title: '',
      message: 'Ya es parte del equipo'
    })
    return
  }
  if (!participante.value || !rol.value) {
    alerta.value.notify({
      type: 'error',
      title: '',
      message: 'Debes llenar los datos'
    })
    return
  }
  const jefe = listaMiembros.value.filter(u => u.rol === 'Jefe')
  if (jefe.length > 0 && rol.value == 'Jefe') {
    alerta.value.notify({
      type: 'error',
      title: '',
      message: 'Ya hay un jefe asignado'
    })
    return
  }
  listaMiembros.value.push({ ...participante.value, rol: rol.value })
  participante.value = null
  rol.value = null
}

const eliminarMiembro = (index) => {
  listaMiembros.value.splice(index, 1)
}

const emits = defineEmits(['api', 'apiEditar', 'limpiar'])

function enviarApi() {
  cargando.value = true
  const resp = listaMiembros.value.filter(u => u.rol === 'Jefe')
  if (resp.length == 0) {
    alerta.value.notify({
      type: 'error',
      title: '',
      message: 'No hay un jefe asignado'
    })
    return
  }
  const obj = {
    nombre: record.value.nombre,
    descripcion: record.value.descripcion,
    id_responsable: resp[0].id_usu,
    miembros: listaMiembros.value,
  }
  emits('api', obj)
}

function enviarApiEditar() {
  cargando.value = true
  const resp = listaMiembros.value.filter(u => u.rol === 'Jefe')
  if (resp.length == 0) {
    alerta.value.notify({
      type: 'error',
      title: '',
      message: 'No hay un jefe asignado'
    })
    return
  }
  const obj = {
    id_equi:record.value.id_equi,
    nombre: record.value.nombre,
    descripcion: record.value.descripcion,
    id_responsable: resp[0].id_usu,
    miembros: listaMiembros.value,
  }
  emits('apiEditar', obj)
}

function abrir(datos = {}, miembros = []) {
  record.value = { ...datos };
  listaMiembros.value = JSON.parse(JSON.stringify(miembros))
  show.value = true;
}

function cerrar() {
  cargando.value = false
  show.value = false
}

defineExpose({ abrir, cerrar, editando })

</script>