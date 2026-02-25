<template>


  <Notificacion ref="alerta" />
</template>

<script setup>
import Notificacion from '@/components/Notificacion.vue';
import { apiCall } from '@/utils/apiCall';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vuetify/lib/composables/router.mjs';

const route = useRoute()
const proyecto = ref({})
const ideas = ref([])
const decisiones = ref([])
const alerta = ref(null)

function obtenerDatos() {
  console.log(route.value.params.id)
  apiCall('proyectos/uno', 'POST', { id_pro: route.value.params.id })
    .then((result) => {
      proyecto.value = result.data.proyecto[0]
      ideas.value = result.data.ideas
      decisiones.value = result.data.des
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || 'Credenciales inválidas'
      })
      console.log(proyecto.value)
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.mensaje || 'Credenciales inválidas'
      })
    });
}

onMounted(() => {
  obtenerDatos()
})
</script>