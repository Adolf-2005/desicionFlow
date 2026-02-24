<template>
  <v-dialog v-model="show" :width="$vuetify.display.smAndDown ? '90%' : '40%'" persistent="">
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
            <v-select v-model="record.id_equipo" label="Equipo" variant="outlined" :items="listaEquipos"
              item-title="nombre" item-value="id_equi" return-object autocomplete="off" density="compact">
            </v-select>
          </v-col>
          <v-col>
            <v-file-input v-model="record.imagen" label="Imagen" variant="outlined" density="compact"
              prepend-icon="mdi-camera-plus-outline" accept="image/png, image/jpeg"></v-file-input>
          </v-col>
          <v-col>
            <v-file-input v-model="record.documento" label="Documento" variant="outlined" density="compact"
              prepend-icon="mdi-file-document-plus"
              accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"></v-file-input>
          </v-col>
          <v-btn v-if="!editar" color="primary" size="large" variant="elevated" block rounded="pill" :loading="cargando"
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

</template>

<script setup>
import { rules } from '@/utils/rules';
import { ref } from 'vue';

const show = ref(false)
const editar = ref(false)
const valido = ref(null)
const record = ref({})
const cargando = ref(false)
const props = defineProps({
  titulo: { type: String, required: true },
  listaEquipos: { type: Object, required: true }
})

const emits = defineEmits(['api', 'apiEditar', 'limpiar'])

function enviarApi() {
  cargando.value = true
  const dataFile = new FormData()
  if (record.value.nombre) dataFile.append('nombre', record.value.nombre)
  if (record.value.descripcion) dataFile.append('descripcion', record.value.descripcion)
  if (record.value.id_equipo) dataFile.append('id_equipo', record.value.id_equipo.id_equi)
  if (record.value.id_equipo) dataFile.append('id_responsable', record.value.id_equipo.id_responsable || null)
  dataFile.append('imagen', record.value.imagen || null)
  dataFile.append('documento', record.value.documento || null)
  emits('api', dataFile)
}

function enviarApiEditar() {
  const dataFile = new FormData()
  if (editar.value) dataFile.append('id_pro', record.value.id_pro)
  if (record.value.nombre) dataFile.append('nombre', record.value.nombre)
  if (record.value.descripcion) dataFile.append('descripcion', record.value.descripcion)
  if (record.value.id_equipo) dataFile.append('id_equipo', record.value.id_equipo.id_equi)
  if (record.value.id_equipo) dataFile.append('id_responsable', record.value.id_equipo.id_responsable || null)
  dataFile.append('imagen', record.value.imagen || null)
  dataFile.append('documento', record.value.documento || null)
  emits('apiEditar', dataFile)
}

function abrir(datos = {}) {
  record.value = { ...datos };
  show.value = true;
}

function cerrar() {
  cargando.value = false
  show.value = false
  emits('limpiar')
}

defineExpose({ abrir, cerrar, record, editar })

</script>