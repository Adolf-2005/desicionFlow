<template>
  <v-btn class="position-fixed ma-4" @click="$router.back(-1)" icon="mdi-keyboard-backspace">
  </v-btn>

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
                    <v-card color="carta" elevation="0" rounded="lg" min-height="172">
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
      <v-card-actions>
        <v-btn color="info" text="Crear decisión" prepend-icon="mdi-plus" v-if="id_logeado === id_responsable"
          @click="statusFecha.crearDecision({ id_creador: id_logeado, id_pro: proyecto.id_pro })">
        </v-btn>
        <v-btn color="info" text="Proponer ideas" prepend-icon="mdi-plus" v-if="equipo && perteneceMiembro(id_logeado)"
          @click="statusFecha.crearDecision({ id_creador: id_logeado, id_pro: proyecto.id_pro })">
        </v-btn>

      </v-card-actions>
    </v-card>

    <v-col cols="12" class="mt-2 mb-2">
      <v-row>
        <v-col cols="12" sm="10" class="pl-sm-0">
          <h2 class="font-weight-light border-titulo pl-2">Decisiones involucradas en el proyecto <v-chip
              class=" d-sm-none" color="primary" variant="elevated">{{ decisiones.length }}</v-chip></h2>
        </v-col>
        <v-col class="d-none d-sm-flex justify-end">
          <v-chip color="primary" variant="elevated">{{ decisiones.length }}</v-chip>
        </v-col>
      </v-row>
    </v-col>

    <v-col v-for="d in decisiones" class="pl-sm-0" v-if="decisiones.length">
      <v-card rounded="lg" elevation="5" class="border-titulo" :text="d.descripcion">
        <template #title>
          <v-row>
            <v-col cols="12" sm="6">
              <p class="text-h7">
                {{ d.titulo }}
              </p>
              <small class="text-medium-emphasis text-body-2">
                {{ formatDate(d.fecha) }}
              </small>
            </v-col>
            <v-col cols="12" sm="6" class="d-flex justify-sm-end align-start">
              <div class="d-flex align-center">
                <v-rating :model-value="valor(d.valoracion, d.comentarios.length)" color="warning" density="compact"
                  readonly></v-rating>
                <div>
                  <small class="text-medium-emphasis">
                    {{ valor(d.valoracion, d.comentarios.length) }}
                  </small>
                </div>
              </div>
            </v-col>
          </v-row>
        </template>
        <v-card-text class="pt-0">
          <p>
            <v-avatar variant="tonal">
              {{ d.nombre.charAt(0) }}{{ d.apellido.charAt(0) }}
            </v-avatar>
            Creador <span> {{ d.nombre + ' ' + d.apellido }}</span> <span class="text-medium-emphasis">@{{ d.usuario
            }}</span>
          </p>
          <v-col cols="12" class="d-flex ga-2">
            <v-chip :color="estadoColor(d.estado)" size="small">{{ capitalizar(d.estado) }}</v-chip>
            <v-chip :color="impactoColor(d.impacto)" size="small">Impacto: {{ d.impacto }}</v-chip>
          </v-col>
          <v-col>
            <v-list>
              <v-list-item title="Observaciones">
                {{ d.observacion || 'Sin observaciones' }}
              </v-list-item>
              <v-list-item title="Resultado">
                {{ d.resultado || 'Aún no se registran resultados' }}
              </v-list-item>
            </v-list>
          </v-col>
          <v-expansion-panels class="mt-2" v-if="d.comentarios.length">
            <v-expansion-panel>
              <v-expansion-panel-title class="d-flex ga-2">
                <v-icon>
                  mdi-comment
                </v-icon>
                Comentarios
              </v-expansion-panel-title>
              <v-expansion-panel-text class="pa-0">
                <v-list>
                  <template v-for="c in d.comentarios">
                    <v-list-item class="border-s-thin bg-carta ma-1 rounded-lg" lines="two">
                      <div class="d-flex ga-2 justify-sm-space-between">
                        <div>
                          <div class="d-flex flex-column flex-sm-row ga-2">
                            <p class="text-wrap d-flex ga-1">
                              <v-icon>
                                mdi-shield-account-outline
                              </v-icon>
                              <span>
                                <strong>{{ c.nombre }} {{ c.apellido }}</strong> - <small>@{{ c.usuario }}</small>
                              </span>
                            </p>
                            <v-rating :model-value="c.puntaje" color="warning" size="small" density="compact"
                              readonly></v-rating>
                          </div>
                          <p class="mt-2">
                            {{ c.comentario }}
                          </p>
                        </div>
                        <div v-if="id_logeado === proyecto.id_responsable || id_logeado === c.id_">
                          <v-btn color="error" icon="mdi-delete" variant="text">
                          </v-btn>
                        </div>
                      </div>
                    </v-list-item>
                  </template>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-card class="text-center" color="carta" v-else>
            <v-card-text class="d-flex flex-column justify-center align-center">
              <v-avatar variant="tonal">
                <v-icon>mdi-comment-off-outline</v-icon>
              </v-avatar>
              Sin comentarios..
            </v-card-text>
          </v-card>
          <v-col cols="12" sm="6" class="px-0" v-if="equipo && perteneceMiembro(id_logeado)">
            <v-card color="carta" class="pa-4">
              <v-form>
                <v-card-title class="px-0">
                  <div class="d-flex align-center ga-2">
                    <span class="text-subtitle-2">
                      Deja un comentario
                    </span>
                    <v-rating v-model="val_dec.puntaje" color="warning" hover density="compact"></v-rating>
                  </div>
                </v-card-title>
                <v-textarea v-model="val_dec.comentario" label="Escribe tu opinión..." rounded="lg" variant="outlined"
                  auto-grow rows="2" hide-details density="compact">
                </v-textarea>
                <v-btn color="invertida" size="small" prepend-icon="mdi-send" class="w-100 mt-4" rounded="xl"
                  variant="elevated" @click="comentarioDec(d.id_deci)" :disabled="botonDec"
                  :loading="cargandoComentario">
                  Comentar
                </v-btn>
              </v-form>
            </v-card>
          </v-col>
        </v-card-text>
        <v-card-actions v-if="(id_logeado === d.id_creador) || (id_logeado === id_responsable)">
          <v-btn color="info" text="Editar" prepend-icon="mdi-pencil"
            @click="statusFecha.editarDec(constructorIdea(d))"></v-btn>
          <v-btn color="info" text="Resultado" prepend-icon="mdi-file-chart-outline"
            @click="statusFecha.abrirResultados({ id_deci: d.id_deci, id_pro: proyecto.id_pro })"></v-btn>
          <v-btn color="info" text="Cambiar estado"
            @click="statusFecha.abrirEstadoDec({ id_deci: d.id_deci, id_pro: proyecto.id_pro })"
            prepend-icon="mdi-sync-circle" v-if="id_logeado === id_responsable"></v-btn>
          <v-btn color="error" text="Eliminar" prepend-icon="mdi-delete"
            @click="eliminar.abrir(d.titulo, { id_deci: d.id_deci, id_pro: d.id_pro })"></v-btn>
        </v-card-actions>
      </v-card>
    </v-col>

    <v-col cols="12" class="pa-0" v-else>
      <v-alert type="info" variant="tonal" border="start" icon="mdi-information-outline" class="mt-4">
        <v-alert-title>Bandeja vacía</v-alert-title>
        Actualmente no existen decisiones registradas en el sistema.
      </v-alert>
    </v-col>

    <v-col cols="12" class="mt-2 mb-2">
      <v-row>
        <v-col cols="12" sm="10" class="pl-sm-0">
          <h2 class="font-weight-light border-titulo pl-2">Ideas propuestas <v-chip class=" d-sm-none" color="primary"
              variant="elevated">{{ ideas.length }}</v-chip></h2>
        </v-col>
        <v-col class="d-none d-sm-flex justify-end">
          <v-chip color="primary" variant="elevated">{{ ideas.length }}</v-chip>
        </v-col>
      </v-row>
    </v-col>

    <v-col v-for="i in ideas" class="pl-sm-0" v-if="ideas.length">
      <v-card rounded="lg" elevation="5" class="border-titulo" :text="i.descripcion">
        <template #title>
          <v-row>
            <v-col cols="12" sm="6">
              <p class="text-h7">
                {{ i.titulo }}
              </p>
              <small class="text-medium-emphasis text-body-2">
                {{ formatDate(i.fecha) }}
              </small>
            </v-col>
            <v-col cols="12" sm="6" class="d-flex justify-sm-end align-start">
              <div class="d-flex align-center">
                <v-rating :model-value="valor(i.valoracion, i.comentarios.length)" color="warning" density="compact"
                  readonly></v-rating>
                <div>
                  <small class="text-medium-emphasis">
                    {{ valor(i.valoracion, i.comentarios.length).toFixed(1) }}
                  </small>
                </div>
              </div>
            </v-col>
          </v-row>
        </template>
        <v-card-text class="pt-0">
          <p>
            <v-avatar variant="tonal">
              {{ i.nombre.charAt(0) }}{{ i.apellido.charAt(0) }}
            </v-avatar>
            Creador <span> {{ i.nombre + ' ' + i.apellido }}</span> <span class="text-medium-emphasis">@{{ i.usuario
            }}</span>
          </p>
          <v-col cols="12" class="d-flex ga-2">
            <v-chip :color="estadoColor(i.estado)" size="small">{{ capitalizar(i.estado) }}</v-chip>
          </v-col>
          <v-expansion-panels class="mt-2" v-if="i.comentarios.length">
            <v-expansion-panel>
              <v-expansion-panel-title class="d-flex ga-2">
                <v-icon>
                  mdi-comment
                </v-icon>
                Comentarios
              </v-expansion-panel-title>
              <v-expansion-panel-text class="pa-0">
                <v-list class="">
                  <template v-for="c in i.comentarios">
                    <v-list-item class="border-s-thin bg-carta ma-1 rounded-lg" lines="two">
                      <div class="d-flex ga-2 justify-sm-space-between">
                        <div>
                          <div class="d-flex flex-column flex-sm-row ga-2">
                            <p class="text-wrap d-flex ga-1">
                              <v-icon>
                                mdi-shield-account-outline
                              </v-icon>
                              <span>
                                <strong>{{ c.nombre }} {{ c.apellido }}</strong> - <small>@{{ c.usuario }}</small>
                              </span>
                            </p>
                            <v-rating :model-value="c.puntaje" color="warning" size="small" density="compact"
                              readonly></v-rating>
                          </div>
                          <p class="mt-2">
                            {{ c.comentario }}
                          </p>
                        </div>
                        <div v-if="id_logeado === proyecto.id_responsable || id_logeado === c.id_">
                          <v-btn color="error" icon="mdi-delete" variant="text">
                          </v-btn>
                        </div>
                      </div>
                    </v-list-item>
                  </template>
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          <v-card class="text-center" color="carta" v-else>
            <v-card-text class="d-flex flex-column justify-center align-center">
              <v-avatar variant="tonal">
                <v-icon>mdi-comment-off-outline</v-icon>
              </v-avatar>
              Sin comentarios..
            </v-card-text>
          </v-card>
          <v-col cols="12" sm="6" class="px-0" v-if="equipo && perteneceMiembro(id_logeado)">
            <v-card color="carta" class="pa-4">
              <v-form>
                <v-card-title class="px-0">
                  <div class="d-flex align-center ga-2">
                    <span class="text-subtitle-2">
                      Deja un comentario
                    </span>
                    <v-rating v-model="val_idea.puntaje" color="warning" hover density="compact"></v-rating>
                  </div>
                </v-card-title>
                <v-textarea v-model="val_idea.comentario" label="Escribe tu opinión..." rounded="lg" variant="outlined"
                  auto-grow rows="2" hide-details density="compact">
                </v-textarea>
                <v-btn color="invertida" size="small" prepend-icon="mdi-send" class="w-100 mt-4" rounded="xl"
                  variant="elevated" @click="comentarioIdea(i.id_idea)" :disabled="botonIdea" :loading="cargandoComentarioIdea">
                  Comentar
                </v-btn>
              </v-form>
            </v-card>
          </v-col>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12" class="pa-0" v-else>
      <v-alert type="info" variant="tonal" border="start" icon="mdi-information-outline" class="mt-4">
        <v-alert-title>Bandeja vacía</v-alert-title>
        Actualmente no existen ideas registradas en el sistema.
      </v-alert>
    </v-col>
  </v-container>

  <ModalEliminar ref="eliminar" @confirmar="eliminarProyecto" />
  <ModalStatusFechas ref="statusFecha" @recargar="recargar" />
  <Notificacion ref="alerta" />
</template>

<script setup>
import ImagenBox from '@/components/ImagenBox.vue';
import ModalStatusFechas from '@/components/modales/ModalStatusFechas.vue';
import Notificacion from '@/components/Notificacion.vue';
import { apiCall } from '@/utils/apiCall';
import { getPersonId } from '@/utils/authdecode';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vuetify/lib/composables/router.mjs';

const route = useRoute()
const proyecto = ref({})
const ideas = ref([])
const equipo = ref([])
const decisiones = ref([])
const alerta = ref(null)
const statusFecha = ref(null)
const val_dec = ref({
  puntaje: 0,
  comentario: ''
})
const val_idea = ref({
  puntaje: 0,
  comentario: ''
})
const id_logeado = ref(getPersonId())
const id_responsable = ref(null)
const eliminar = ref(null)
const botonDec = ref(true)
const botonIdea = ref(true)
const cargandoComentario = ref(false)
const cargandoComentarioIdea = ref(false)


watch(val_dec.value, (newVal) => {
  if (newVal.puntaje > 0) {
    botonDec.value = false
  }
}, { deep: true })

watch(val_idea.value, (newVal) => {
  if (newVal.puntaje > 0) {
    botonIdea.value = false
  }
}, { deep: true })

function obtenerDatos() {
  apiCall('proyectos/uno', 'POST', { id_pro: route.value.params.id })
    .then((result) => {
      proyecto.value = result.data.proyecto[0]
      id_responsable.value = proyecto.value.id_responsable
      equipo.value = result.data.proyecto[0].equipo[0]
      ideas.value = result.data.ideas
      decisiones.value = result.data.des
      id_responsable.value = proyecto.value.id_responsable
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

function recargar() {
  apiCall('proyectos/uno', 'POST', { id_pro: route.value.params.id })
    .then((result) => {
      proyecto.value = result.data.proyecto[0]
      id_responsable.value = proyecto.value.id_responsable
      equipo.value = result.data.proyecto[0].equipo[0]
      ideas.value = result.data.ideas
      decisiones.value = result.data.des
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.mensaje || 'Credenciales inválidas'
      })
    });
}

function eliminarProyecto(data) {
  apiCall('decisiones/eliminar', 'DELETE', data)
    .then((result) => {
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || 'Credenciales inválidas'
      })
      recargar()
      eliminar.value.cerrar()
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.mensaje || 'Credenciales inválidas'
      })
    });
}

function comentarioDec(id) {
  val_dec.value.id_deci = id
  val_dec.value.id_pro = proyecto.value.id_pro
  cargandoComentario.value = true
  apiCall('decisiones/crearComentario', 'POST', val_dec.value)
    .then((result) => {
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || 'Credenciales inválidas'
      })
      recargar()
      val_dec.value = {}
      cargandoComentario.value = false
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.mensaje || 'Credenciales inválidas'
      })
      cargandoComentario.value = false
    });
}

function comentarioIdea(id) {
  val_idea.value.id_idea = id
  val_idea.value.id_pro = proyecto.value.id_pro
  cargandoComentarioIdea.value = true
  apiCall('ideas/crearComentario', 'POST', val_idea.value)
    .then((result) => {
      alerta.value.notify({
        type: 'success',
        title: '',
        message: result.data?.mensaje || 'Credenciales inválidas'
      })
      recargar()
      val_idea.value = {}
      cargandoComentarioIdea.value = false
    }).catch((err) => {
      alerta.value.notify({
        type: 'error',
        title: '',
        message: err.mensaje || 'Credenciales inválidas'
      })
      cargandoComentarioIdea.value = false
    });
}

function constructorIdea(objeto) {
  const data = {
    id_pro: objeto.id_pro,
    id_deci: objeto.id_deci,
    titulo: objeto.titulo,
    descripcion: objeto.descripcion,
    estado: objeto.estado,
    impacto: objeto.impacto,
    observacion: objeto.observacion,
  }
  return data
}

function perteneceMiembro(persona) {
  const miembros = equipo.value?.miembros;
  if (!miembros || !Array.isArray(miembros)) {
    return false;
  }
  return miembros.some(e => e.id_usu === persona);
}

function valor(puntaje = 0, total = 0) {
  if (parseFloat(puntaje) === 0) {
    return 0
  }
  if (parseFloat(total) === 0) {
    return 0
  }
  const result = parseFloat(puntaje) / parseFloat(total)
  return result
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
  const estado = capitalizar(status)
  return {
    'Abierta': 'warning',
    'Cerrada': 'success',
    'En Evaluacion': 'primary',
    'En evaluacion': 'primary'
  }[estado] || 'status-default'
}

const impactoColor = (status) => {
  const impacto = capitalizar(status)
  return {
    'Alto': 'error',
    'Medio': 'warning',
    'Bajo': 'success',
  }[impacto] || 'status-default'
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

.border-titulo {
  border-left: 4px solid rgba(var(--v-theme-primary), 1);
}
</style>