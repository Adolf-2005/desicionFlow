<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 mt-5" rounded="lg">
          <v-toolbar color="primary">
            <v-toolbar-title class="text-center w-100">
              ¡Cambia la clave por una mas segura!
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-8">
            <v-form ref="form" v-model="formLogin">
              <v-text-field v-model="record.actual" label="Contraseña" prepend-inner-icon="mdi-lock-outline"
                :type="password" variant="underlined" class="mb-2" :rules="[rules.empty, rules.required]">
              </v-text-field>
              <v-text-field v-model="record.clave" label="Contraseña" prepend-inner-icon="mdi-lock-outline"
                :type="password" variant="underlined" class="mb-2" :rules="[rules.empty, rules.required]">
              </v-text-field>
              <v-text-field v-model="record.repetido" label="Repite la contraseña" prepend-inner-icon="mdi-lock-outline"
                :type="password" variant="underlined" class="mb-2" :rules="[rules.empty, rules.required]">
              </v-text-field>
              <div class="d-flex justify-end pa-2">
                <v-btn icon="mdi-eye" @mousedown="password = 'text'" @mouseup="password = 'password'"></v-btn>
              </div>
              <v-btn color="primary" size="large" variant="elevated" @click="change" block rounded="pill"
                :disabled="!formLogin">
                Iniciar Sesión
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <Notificacion ref="alerta" />
</template>

<script setup>
import { rules } from '@/utils/rules';
import { ref } from 'vue';
import { apiCall } from '@/utils/apiCall';
import Notificacion from '@/components/Notificacion.vue';
import { useRouter } from 'vuetify/lib/composables/router.mjs';
import { getPersonUsuario } from '@/utils/authdecode';

const router = useRouter()
const formLogin = ref(null)
const password = ref('password')
const record = ref({
  actual: '',
  clave: '',
  repetido: '',
})
const alerta = ref(null)

function change() {
  const obj = {
    usuario: getPersonUsuario(),
    actual: record.value.actual,
    clave: record.value.clave
  }
  apiCall('usuarios/cambio', 'POST', obj)
    .then((result) => {
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || 'Credenciales inválidas'
      })
      setTimeout(() => {
        router.push('/')
      }, 1000);
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: 'Fallo de acceso',
        message: err.response?.data?.mensaje || 'Credenciales inválidas'
      })
    });
}


</script>