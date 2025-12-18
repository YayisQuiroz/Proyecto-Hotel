<template>
  <div
    :style="{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
    }"
  >
    <!-- Loader -->
    <div
      v-if="loading"
      :style="{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }"
    >
      <div
        :style="{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          padding: '2rem',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }"
      >
        <Loader
          :size="40"
          color="#667eea"
          :style="{ animation: 'spin 1s linear infinite' }"
        />
        <h2
          :style="{
            margin: 0,
            color: '#1e3c72',
            fontSize: '1.25rem'
          }"
        >
          Cargando habitaciones...
        </h2>
      </div>
    </div>

    <div v-else :style="{ maxWidth: '1400px', margin: '0 auto' }">
      <!-- Header -->
      <div
        :style="{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }"
      >
        <div :style="{ display: 'flex', alignItems: 'center', gap: '1rem' }">
          <div
            :style="{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }"
          >
            <DoorOpen :size="28" color="white" />
          </div>
          <h1
            :style="{
              margin: 0,
              fontSize: '1.875rem',
              fontWeight: '700',
              color: '#1e3c72'
            }"
          >
            Habitaciones
          </h1>
        </div>
      </div>

      <!-- Tabla -->
      <div
        :style="{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }"
      >
        <div :style="{ overflowX: 'auto' }">
          <table :style="{ width: '100%', borderCollapse: 'collapse' }">
            <thead>
              <tr
                :style="{
                  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                  color: 'white'
                }"
              >
                <th v-for="col in columnas" :key="col" :style="thStyle">
                  {{ col }}
                </th>
                <th :style="thCenterStyle">Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(h, index) in habitacionesPaginadas"
                :key="h.idHabitacion"
                :style="rowStyle(index)"
                @mouseenter="e => (e.currentTarget.style.background = '#f1f5f9')"
                @mouseleave="e => (e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f8fafc')"
              >
                <td :style="tdIdStyle">{{ h.idHabitacion }}</td>
                <td :style="{ padding: '1.25rem 1.5rem', fontWeight: '700' }">
                  {{ h.numeroHabitacion }}
                </td>
                <td :style="tdStyle">{{ h.tipo }}</td>
                <td :style="{ padding: '1.25rem 1.5rem', fontWeight: '700', color: '#059669' }">
                  ${{ h.precioNoche }}
                </td>
                <td :style="{ padding: '1.25rem 1.5rem' }">
                  <span :style="estadoConfig(h.estado).badgeStyle">
                    <component
                      :is="estadoConfig(h.estado).icon"
                      :size="14"
                    />
                    {{ h.estado }}
                  </span>
                </td>
                <td :style="{ padding: '1.25rem 1.5rem', textAlign: 'center' }">
                  <button
                    @click="handleEliminar(h.idHabitacion)"
                    :style="deleteButtonStyle"
                    @mouseenter="onDeleteEnter"
                    @mouseleave="onDeleteLeave"
                  >
                    <Trash2 :size="16" />
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="habitaciones.length === 0"
          :style="{
            padding: '4rem 2rem',
            textAlign: 'center',
            color: '#94a3b8'
          }"
        >
          <DoorOpen :size="64" :style="{ margin: '0 auto 1rem', opacity: 0.3 }" />
          <p :style="{ margin: 0, fontSize: '1.125rem' }">
            No hay habitaciones registradas
          </p>
        </div>

        <!-- Paginación -->
        <div
          v-if="habitaciones.length > 0"
          :style="{
            padding: '1.5rem 2rem',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }"
        >
          <div :style="{ color: '#64748b', fontSize: '0.875rem' }">
            Mostrando {{ (paginaActual - 1) * itemsPorPagina + 1 }} - 
            {{ Math.min(paginaActual * itemsPorPagina, habitaciones.length) }} de 
            {{ habitaciones.length }} habitaciones
          </div>

          <div :style="{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }">
            <!-- Botón Anterior -->
            <button
              @click="cambiarPagina(paginaActual - 1)"
              :disabled="paginaActual === 1"
              :style="{
                padding: '0.5rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: paginaActual === 1 ? '#f8fafc' : 'white',
                color: paginaActual === 1 ? '#cbd5e1' : '#475569',
                cursor: paginaActual === 1 ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease'
              }"
            >
              Anterior
            </button>

            <!-- Números de página -->
            <template v-for="pagina in paginasVisibles" :key="pagina">
              <button
                v-if="pagina !== '...'"
                @click="cambiarPagina(pagina)"
                :style="{
                  padding: '0.5rem 0.875rem',
                  border: pagina === paginaActual ? 'none' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background: pagina === paginaActual 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'white',
                  color: pagina === paginaActual ? 'white' : '#475569',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                  minWidth: '40px'
                }"
                @mouseenter="e => {
                  if (pagina !== paginaActual) {
                    e.currentTarget.style.background = '#f1f5f9'
                  }
                }"
                @mouseleave="e => {
                  if (pagina !== paginaActual) {
                    e.currentTarget.style.background = 'white'
                  }
                }"
              >
                {{ pagina }}
              </button>
              <span
                v-else
                :style="{
                  padding: '0.5rem 0.875rem',
                  color: '#94a3b8',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center'
                }"
              >
                ...
              </span>
            </template>

            <!-- Botón Siguiente -->
            <button
              @click="cambiarPagina(paginaActual + 1)"
              :disabled="paginaActual === totalPaginas"
              :style="{
                padding: '0.5rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: paginaActual === totalPaginas ? '#f8fafc' : 'white',
                color: paginaActual === totalPaginas ? '#cbd5e1' : '#475569',
                cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer',
                fontWeight: '600',
                fontSize: '0.875rem',
                transition: 'all 0.2s ease'
              }"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  DoorOpen,
  Trash2,
  Loader,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-vue-next'
import {
  getHabitaciones,
  eliminarHabitacion
} from '@/services/habitacionesService'

const habitaciones = ref([])
const loading = ref(true)

// Paginación
const paginaActual = ref(1)
const itemsPorPagina = 10

const columnas = ['ID', 'Número', 'Tipo', 'Precio', 'Estado']

// Computed para paginación
const totalPaginas = computed(() => Math.ceil(habitaciones.value.length / itemsPorPagina))

const habitacionesPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina
  const fin = inicio + itemsPorPagina
  return habitaciones.value.slice(inicio, fin)
})

const paginasVisibles = computed(() => {
  const paginas = []
  const total = totalPaginas.value
  const actual = paginaActual.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) paginas.push(i)
    return paginas
  }
  
  paginas.push(1)
  
  if (actual <= 4) {
    for (let i = 2; i <= 5; i++) paginas.push(i)
    paginas.push('...')
  } else if (actual >= total - 3) {
    paginas.push('...')
    for (let i = total - 4; i < total; i++) paginas.push(i)
  } else {
    paginas.push('...')
    for (let i = actual - 1; i <= actual + 1; i++) paginas.push(i)
    paginas.push('...')
  }
  
  paginas.push(total)
  return paginas
})

const cambiarPagina = (pagina) => {
  if (pagina >= 1 && pagina <= totalPaginas.value) {
    paginaActual.value = pagina
  }
}

const cargarHabitaciones = async () => {
  try {
    const data = await getHabitaciones()
    habitaciones.value = data
    paginaActual.value = 1
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

const handleEliminar = async id => {
  if (!window.confirm('¿Eliminar habitación?')) return
  await eliminarHabitacion(id)
  cargarHabitaciones()
}

onMounted(cargarHabitaciones)

/* estado badge */
const estadoConfig = estado => {
  const estadoLower = (estado || '').toLowerCase()
  let config

  if (estadoLower.includes('disponible')) {
    config = { bg: '#dcfce7', color: '#166534', icon: CheckCircle }
  } else if (estadoLower.includes('ocupada') || estadoLower.includes('ocupado')) {
    config = { bg: '#fee2e2', color: '#991b1b', icon: AlertCircle }
  } else if (estadoLower.includes('mantenimiento')) {
    config = { bg: '#fef3c7', color: '#92400e', icon: Clock }
  } else {
    config = { bg: '#e0e7ff', color: '#3730a3', icon: AlertCircle }
  }

  return {
    icon: config.icon,
    badgeStyle: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.375rem',
      padding: '0.375rem 0.75rem',
      background: config.bg,
      color: config.color,
      borderRadius: '9999px',
      fontSize: '0.875rem',
      fontWeight: '600'
    }
  }
}

/* estilos */
const thStyle = {
  padding: '1.25rem 1.5rem',
  textAlign: 'left',
  fontWeight: '600',
  fontSize: '0.875rem',
  textTransform: 'uppercase'
}

const thCenterStyle = { ...thStyle, textAlign: 'center' }

const tdBase = { padding: '1.25rem 1.5rem', fontSize: '0.95rem' }
const tdIdStyle = { ...tdBase, color: '#475569', fontWeight: '600' }
const tdStyle = { ...tdBase, color: '#475569' }

const rowStyle = index => ({
  borderBottom: '1px solid #f1f5f9',
  background: index % 2 === 0 ? 'white' : '#f8fafc',
  transition: 'background 0.2s ease'
})

/* botón eliminar */
const deleteButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.625rem 1.25rem',
  background: '#fee2e2',
  color: '#dc2626',
  border: '1px solid #fed5d5ff',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
}

const onDeleteEnter = e => {
  e.currentTarget.style.background = '#dc2626'
  e.currentTarget.style.color = 'white'
  e.currentTarget.style.borderColor = '#dc2626'
}

const onDeleteLeave = e => {
  e.currentTarget.style.background = '#fee2e2'
  e.currentTarget.style.color = '#dc2626'
  e.currentTarget.style.borderColor = '#fecaca'
}
</script>

<style scoped>
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>