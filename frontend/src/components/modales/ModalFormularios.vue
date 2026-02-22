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
          <template v-for="field in fields">
            <v-col v-if="(field.type === 'text' || field.type === 'password') && (field.row === false) && !field.edit"
              :class="[field.type === 'password' ? 'd-flex' : '']">
              <v-text-field v-model="record[field.key]" :label="field.title" variant="outlined"
                :rules="[rules.required, rules.empty]" :type="field.type" autocomplete="off" :readonly="field.readonly">
              </v-text-field>
            </v-col>

            <v-col v-if="field.type === 'textarea'">
              <v-textarea v-model="record[field.key]" :label="field.title" variant="outlined"
                :rules="[rules.required, rules.empty]" rows="2" :type="field.type" autocomplete="off">
              </v-textarea>
            </v-col>

            <v-row class="px-2" v-if="(field.type === 'text' || field.type === 'password') && field.row === true">
              <v-col cols="12" sm="6">
                <v-text-field v-model="record[field.key]" :label="field.title" variant="outlined"
                  :rules="[rules.required, rules.empty]" :type="field.type" autocomplete="off"
                  :readonly="field.readonly">
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="record[field.subKey]" :label="field.subTitle" variant="outlined"
                  :rules="[rules.required, rules.empty]" :type="field.subType" autocomplete="off"
                  :readonly="field.readonly">
                </v-text-field>
              </v-col>
            </v-row>

            <v-row class="pa-2" v-if="(field.type === 'select') && field.row === true">
              <v-col cols="5" sm="3">
                <v-select v-model="record[field.key]" :label="field.title" variant="outlined"
                  :rules="[rules.required, rules.empty]" :items="field.items" autocomplete="off"
                  :readonly="field.readonly">
                </v-select>
              </v-col>
              <v-col cols="7" sm="9">
                <v-text-field v-model="record[field.subKey]" :label="field.subTitle" variant="outlined"
                  :rules="[rules.required, rules.empty]" :type="field.subType" autocomplete="off"
                  :readonly="field.readonly">
                </v-text-field>
              </v-col>
            </v-row>

            <v-col v-if="(field.type === 'select') && (field.row === false) && field.object ">
              <v-select v-model="record[field.key]" :label="field.title" variant="outlined"
                :rules="[rules.required]" :items="field.items" :item-title="field.titleItem" :item-value="field.valueItem" :return-object="field.object">
              </v-select>
            </v-col>
          
            <v-col v-if="(field.type === 'select') && field.row === false">
              <v-select v-model="record[field.key]" :label="field.title" variant="outlined"
                :rules="[rules.required]" :items="field.items">
              </v-select>
            </v-col>
          </template>
          <v-btn color="primary" size="large" variant="elevated" block rounded="pill" :disabled="!valido"
            @click="enviarApi" v-if="!editBtn">
            {{ titulo }}
          </v-btn>
          <v-btn color="primary" size="large" variant="elevated" block rounded="pill" :disabled="!valido"
            @click="enviarApiEditar" v-else>
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
const editBtn = ref(false)
const valido = ref(null)
const record = ref({})
const props = defineProps({
  fields: { type: Object, required: true },
  titulo: { type: String, required: true }
})

const emits = defineEmits(['api', 'apiEditar', 'limpiar'])

function enviarApi() {
  emits('api', record.value)
}

function enviarApiEditar() {
  emits('apiEditar', record.value)
}

function abrir(datos = {}, edit = false) {
  record.value = { ...datos };
  show.value = true;
  editBtn.value = edit
}

function cerrar() {
  show.value = false
  emits('limpiar')
}

defineExpose({ abrir, cerrar, record })

</script>