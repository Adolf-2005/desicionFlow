<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12 mt-5" rounded="lg">
          <v-toolbar color="primary">
            <v-toolbar-title class="text-center w-100">
              Bienvenido de nuevo
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pa-8">
            <v-form ref="form" v-model="formLogin" @submit.prevent="login">
              <v-text-field v-model="record.usuario" label="Nombre de usuario" prepend-inner-icon="mdi-account-key"
                variant="underlined" class="mb-2" :rules="[rules.empty, rules.required]"></v-text-field>
              <div class="d-flex gap-2">
                <v-text-field v-model="record.clave" label="Contraseña" prepend-inner-icon="mdi-lock-outline"
                  :type="password" variant="underlined" class="mb-2"
                  :rules="[rules.empty, rules.required]"></v-text-field>
                <v-btn icon="mdi-eye" @mousedown="password = 'text'" @mouseup="password = 'password'"></v-btn>
              </div>

              <v-btn color="primary" size="large" variant="elevated" @click="login" block rounded="pill"
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
import { setCookie } from '@/utils/cookies';
import { rules } from '@/utils/rules';
import { ref } from 'vue';
import { apiCall } from '@/utils/apiCall';
import Notificacion from '@/components/Notificacion.vue';
import { useRouter } from 'vuetify/lib/composables/router.mjs';

const router = useRouter()
const formLogin = ref(null)
const password = ref('password')
const record = ref({
  usuario: '',
  clave: ''
})
const alerta = ref(null)

function login() {
  apiCall('usuarios/login', 'POST', record.value)
    .then((result) => {
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || 'Credenciales inválidas'
      })
      setCookie('user_token', result.data.token, result.data.expiresIn)
      console.log(result.data.cambio_clave)
      setTimeout(() => {
        if (!result.data.cambio_clave) {
          router.push('/')
        } else {
          router.push('/password')
        }
      }, 1000);
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: 'Fallo de acceso',
        message: err?.mensaje || 'Credenciales inválidas'
      })
    });
}


</script>