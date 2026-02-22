/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import index from '@/pages/index.vue'
import Login from '@/pages/Login.vue'
import Usuarios from '@/pages/Usuarios.vue'
import CambioClave from '@/pages/CambioClave.vue'
import Proyectos from '@/pages/Proyectos.vue'
import Equipos from '@/pages/Equipos.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Inicio',
      component: index,
      meta: { title: 'Inicio', requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { title: 'Iniciar sesión', requiresAuth: false }
    },
    {
      path: '/usuarios',
      name: 'Usuarios',
      component: Usuarios,
      meta: { title: 'Usuarios', requiresAuth: true }
    },
    {
      path: '/password',
      name: 'Password',
      component: CambioClave,
      meta: { title: 'Cambio de clave', requiresAuth: false }
    },
    {
      path: '/proyectos',
      name: 'Proyectos',
      component: Proyectos,
      meta: { title: 'Proyectos', requiresAuth: true }
    },
    {
      path: '/equipos',
      name: 'Equipos',
      component: Equipos,
      meta: { title: 'Equipos', requiresAuth: true }
    },
  ],
})

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}


router.beforeEach((to, from, next) => {
  const token = getCookie('user_token'); // Nombre de tu cookie
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !token) {
    next({ name: 'Login' });
  } else if (to.name === 'Login' && token) {
    next({ path: '/' });
  } else {
    next();
  }
});

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.afterEach((to) => {
  document.title = to.meta?.title || '';
  // }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
