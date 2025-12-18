// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/pages/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Habitaciones from '@/pages/Habitaciones.vue'
import Reservas from '@/pages/Reservas.vue'
import Pagos from '@/pages/Pagos.vue'
import Auditorias from '@/pages/Auditorias.vue'
import HabitacionCrear from '@/pages/HabitacionCrear.vue'
import Huespedes from '@/pages/Huespedes.vue'
import Reportes from '../pages/Reportes.vue'

const routes = [
  { path: '/', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/habitaciones', component: Habitaciones },
  { path: '/reservas', component: Reservas },
  { path: '/pagos', component: Pagos },
  { path: '/auditorias', component: Auditorias },
  { path: '/habitaciones/crear', component: HabitacionCrear },
  { path: '/huespedes', component: Huespedes },
  { path: '/reportes', component: Reportes },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
