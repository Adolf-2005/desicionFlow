<template>

  <v-container class="pa-0 pa-sm-4">
    <v-card rounded="lg" elevation="5">
      <template #title>
        <h2>
          {{ capitalizar(proyecto.nom_pro) }}
        </h2>
      </template>
      <template v-slot:prepend v-if="$vuetify.display.mdAndUp">
        <v-avatar color="primary" variant="tonal" size="40">
          <v-icon>mdi-package</v-icon>
        </v-avatar>
      </template>
      <v-card-text>
        <v-row>
          <v-col cols="12" class="rounded-lg">
            <ImagenBox :image-url="proyecto.imagen" :alt="proyecto.nombre" />
          </v-col>
          <v-col cols="12">
            <v-list>
              <v-list-item>
                <template v-slot:prepend v-if="$vuetify.display.mdAndUp">
                  <v-avatar color="primary" variant="tonal" size="40">
                    <v-icon>mdi-text-box</v-icon>
                  </v-avatar>
                </template>
                <p>
                  {{ capitalizar(proyecto.des_pro) }}
                </p>
              </v-list-item>
              <v-list-item>
                <v-row>
                  <v-col cols="12" sm="6" class="d-flex flex-column ga-2">
                    <div>
                      <h2>
                        <v-icon>
                          mdi-account-multiple
                        </v-icon>
                        <span>
                          Equipo Responsable
                        </span>
                      </h2>
                    </div>
                    <v-card color="carta" elevation="0" rounded="lg">
                      <div v-if="equipo">
                        <v-list class="bg-carta">
                          <v-list-item class="bg-carta" :title="equipo.nombre" :subtitle="equipo.descripcion">
                            <v-divider thickness="1" class="mt-2"></v-divider>
                          </v-list-item>
                          <v-list-item class="bg-carta" title="Líder de equipo">
                            <div class="d-flex ga-2 align-center mt-2">
                              <v-avatar size="50" variant="tonal">
                                <v-icon>
                                  mdi-account-tie-hat
                                </v-icon>
                              </v-avatar>
                              <div>
                                <p class="font-weight-bold">
                                  {{ proyecto.nom_lider }}
                                </p>
                                <span class="text-medium-emphasis">
                                  @{{ proyecto.usuario }}
                                </span>
                              </div>
                            </div>
                          </v-list-item>
                          <!-- <v-list-item title="Miembros del equipo">
                            <v-expansion-panels color="carta">
                              <v-expansion-panel title="Lista de usuarios">
                                <v-expansion-panel-text class="bg-carta">
                                  <template v-for="m in equipo.miembros">
                                    <v-list class="bg-carta">
                                      <v-list-item class="bg-carta"
                                        :title="m.nombre + ' ' + m.apellido + ' ' + m.cedula"
                                        :subtitle="'@' + m.usuario">
                                        <template v-slot:prepend>
                                          <v-avatar size="40" variant="tonal">
                                            <v-icon>
                                              mdi-microsoft-teams
                                            </v-icon>
                                          </v-avatar>
                                        </template>
                                      </v-list-item>
                                    </v-list>
                                  </template>
                                </v-expansion-panel-text>
                              </v-expansion-panel>
                            </v-expansion-panels>
                          </v-list-item> -->
                        </v-list>
                      </div>
                      <div v-else>
                        <v-list class="bg-carta">
                          <v-list-item class="bg-carta" title="Aún no se asgina un equipo"
                            prepend-icon="mdi-audio-input-xlr">
                          </v-list-item>
                        </v-list>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="6" class="d-flex flex-column ga-2">
                    <div>
                      <h2>
                        <v-icon>
                          mdi-calendar-blank
                        </v-icon>
                        <span>
                          Cronograma
                        </span>
                      </h2>
                    </div>
                    <v-card color="carta" elevation="0" rounded="lg">
                      <v-list class="bg-carta">
                        <v-list-item class="bg-carta" title="Fecha de creación">
                          {{ formatDate(proyecto.fecha_creacion) }}
                        </v-list-item>
                        <v-list-item class="bg-carta" title="Fecha de inicio">
                          {{ proyecto.fecha_inicio ? formatDate(proyecto.fecha_inicio) : 'Sin asignar' }}
                        </v-list-item>
                        <v-list-item class="bg-carta" title="Fecha de cierre">
                          {{ proyecto.fecha_cierre ? formatDate(proyecto.fecha_cierre) : 'Sin asignar' }}
                        </v-list-item>
                      </v-list>
                    </v-card>
                  </v-col>
                </v-row>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12">
            <DocumentoBox :document-url="proyecto.documento" :documentName="proyecto.nom_pro" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>

  <Notificacion ref="alerta" />
</template>

<script setup>
import ImagenBox from '@/components/ImagenBox.vue';
import ImagenBoxCard from '@/components/ImagenBoxCard.vue';
import Notificacion from '@/components/Notificacion.vue';
import { apiCall } from '@/utils/apiCall';
import { capitalize, onMounted, ref } from 'vue';
import { useRoute } from 'vuetify/lib/composables/router.mjs';

const route = useRoute()
const proyecto = ref({})
const ideas = ref([])
const equipo = ref([])
const decisiones = ref([])
const alerta = ref(null)

function obtenerDatos() {
  console.log(route.value.params.id)
  apiCall('proyectos/uno', 'POST', { id_pro: route.value.params.id })
    .then((result) => {
      proyecto.value = result.data.proyecto[0]
      equipo.value = result.data.proyecto[0].equipo[0]
      ideas.value = result.data.ideas
      decisiones.value = result.data.des
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || 'Credenciales inválidas'
      })
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.mensaje || 'Credenciales inválidas'
      })
    });
}

const formatDate = (dateString) => {
  if (!dateString) return 'No disponible'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const estadoColor = (status) => {
  return {
    'Activo': 'success',
    'Cancelado': 'error',
    'Completado': 'primary'
  }[status] || 'status-default'
}

const capitalizar = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

onMounted(() => {
  obtenerDatos()
})
</script>

<style scoped>
.contenido {
  flex-direction: column-reverse;
}
</style>