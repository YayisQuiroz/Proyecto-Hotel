<template>
  <div
    :style="{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
    }"
  >
    <div :style="{ maxWidth: '1400px', margin: '0 auto' }">
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
            <User :size="28" color="white" />
          </div>
          <div>
            <h1
              :style="{
                margin: 0,
                fontSize: '1.875rem',
                fontWeight: '700',
                color: '#1e3c72'
              }"
            >
              Huéspedes
            </h1>
          </div>
        </div>
      </div>

      <!-- Formulario -->
      <div
        :style="{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }"
      >
        <h2
          :style="{
            margin: '0 0 1.5rem 0',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#1e3c72',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }"
        >
          <template v-if="editingId">
            <Edit2 :size="24" /> Editar Huésped
          </template>
          <template v-else>
            <UserPlus :size="24" /> Crear Huésped
          </template>
        </h2>

        <div
          :style="{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }"
        >
          <div v-for="field in fields" :key="field.name">
            <label :style="labelStyle">{{ field.label }}</label>
            <input
              :name="field.name"
              :placeholder="field.placeholder"
              v-model="form[field.name]"
              :required="field.required"
              :style="inputStyle"
              @focus="onFocus"
              @blur="onBlur"
            />
          </div>

          <div
            :style="{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '0.5rem'
            }"
          >
            <button
              @click="handleSubmit"
              :style="submitStyle"
              @mouseenter="onSubmitEnter"
              @mouseleave="onSubmitLeave"
            >
              <template v-if="editingId">
                <Save :size="18" /> Actualizar
              </template>
              <template v-else>
                <UserPlus :size="18" /> Crear
              </template>
            </button>

            <button
              v-if="editingId"
              type="button"
              @click="resetForm"
              :style="cancelStyle"
              @mouseenter="e => (e.currentTarget.style.background = '#e2e8f0')"
              @mouseleave="e => (e.currentTarget.style.background = '#f1f5f9')"
            >
              <X :size="18" />
              Cancelar
            </button>
          </div>
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
        <div
          :style="{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid #f1f5f9'
          }"
        >
          <h2
            :style="{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1e3c72'
            }"
          >
            Lista de Huéspedes
          </h2>
        </div>

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
                v-for="(h, index) in huespedesPaginados"
                :key="h.idHuesped"
                :style="rowStyle(index)"
                @mouseenter="e => (e.currentTarget.style.background = '#f1f5f9')"
                @mouseleave="e => (e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f8fafc')"
              >
                <td :style="tdIdStyle">{{ h.idHuesped }}</td>
                <td :style="tdNameStyle">{{ h.nombre }}</td>
                <td :style="tdNameStyle">{{ h.apellido }}</td>
                <td :style="tdStyle">{{ h.telefono }}</td>
                <td :style="tdStyle">{{ h.correo }}</td>
                <td :style="tdStyle">{{ h.identificacion }}</td>
                <td :style="{ padding: '1.25rem 1.5rem', textAlign: 'center' }">
                  <div
                    :style="{
                      display: 'flex',
                      gap: '0.5rem',
                      justifyContent: 'center'
                    }"
                  >
                    <button
                      type="button"
                      @click="handleEditar(h)"
                      :style="editButtonStyle"
                      @mouseenter="onEditEnter"
                      @mouseleave="onEditLeave"
                    >
                      <Edit2 :size="16" />
                      Editar
                    </button>
                    <button
                      type="button"
                      @click="handleEliminar(h.idHuesped)"
                      :style="deleteButtonStyle"
                      @mouseenter="onDeleteEnter"
                      @mouseleave="onDeleteLeave"
                    >
                      <Trash2 :size="16" />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="huespedes.length === 0"
          :style="{
            padding: '4rem 2rem',
            textAlign: 'center',
            color: '#94a3b8'
          }"
        >
          <User :size="64" :style="{ margin: '0 auto 1rem', opacity: 0.3 }" />
          <p :style="{ margin: 0, fontSize: '1.125rem' }">
            No hay huéspedes registrados
          </p>
        </div>

        <!-- Paginación -->
        <div
          v-if="huespedes.length > 0"
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
            {{ Math.min(paginaActual * itemsPorPagina, huespedes.length) }} de 
            {{ huespedes.length }} huéspedes
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
import { ref, reactive, onMounted, computed } from 'vue'
import { User, UserPlus, Edit2, Trash2, X, Save } from 'lucide-vue-next'
import {
  getHuespedes,
  crearHuesped,
  editarHuesped,
  eliminarHuesped
} from '@/services/huespedesService'

const huespedes = ref([])
const editingId = ref(null)

// Paginación
const paginaActual = ref(1)
const itemsPorPagina = 10

const form = reactive({
  nombre: '',
  apellido: '',
  telefono: '',
  correo: '',
  identificacion: ''
})

const camposBase = [
  { name: 'nombre', label: 'Nombre', placeholder: 'Nombre', required: true },
  { name: 'apellido', label: 'Apellido', placeholder: 'Apellido', required: true },
  { name: 'telefono', label: 'Teléfono', placeholder: 'Teléfono', required: false },
  { name: 'correo', label: 'Correo', placeholder: 'Correo', required: false },
  { name: 'identificacion', label: 'Identificación', placeholder: 'Identificación', required: false }
]

const fields = camposBase

// Computed para paginación
const totalPaginas = computed(() => Math.ceil(huespedes.value.length / itemsPorPagina))

const huespedesPaginados = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina
  const fin = inicio + itemsPorPagina
  return huespedes.value.slice(inicio, fin)
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

const fetchData = async () => {
  try {
    huespedes.value = await getHuespedes()
    paginaActual.value = 1
  } catch (error) {
    console.error(error)
    alert(error.message)
  }
}

onMounted(fetchData)

const handleSubmit = async () => {
  try {
    if (editingId.value) {
      await editarHuesped(editingId.value, { ...form })
      alert('Huésped actualizado ✅')
    } else {
      await crearHuesped({ ...form })
      alert('Huésped creado ✅')
    }
    resetForm()
    fetchData()
  } catch (error) {
    alert(error.message)
  }
}

const handleEditar = h => {
  form.nombre = h.nombre
  form.apellido = h.apellido
  form.telefono = h.telefono || ''
  form.correo = h.correo || ''
  form.identificacion = h.identificacion || ''
  editingId.value = h.idHuesped
}

const handleEliminar = async id => {
  if (!window.confirm('¿Eliminar huésped?')) return
  try {
    await eliminarHuesped(id)
    fetchData()
  } catch (error) {
    alert(error.message)
  }
}

const resetForm = () => {
  form.nombre = ''
  form.apellido = ''
  form.telefono = ''
  form.correo = ''
  form.identificacion = ''
  editingId.value = null
}

/* estilos reutilizables */
const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#475569'
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '0.95rem',
  transition: 'all 0.2s ease'
}

const submitStyle = {
  flex: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1.5rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.95rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
}

const cancelStyle = {
  flex: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1.5rem',
  background: '#f1f5f9',
  color: '#475569',
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.95rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
}

/* tabla */
const columnas = ['ID', 'Nombre', 'Apellido', 'Teléfono', 'Correo', 'Identificación']

const thStyle = {
  padding: '1.25rem 1.5rem',
  textAlign: 'left',
  fontWeight: '600',
  fontSize: '0.875rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
}

const thCenterStyle = {
  ...thStyle,
  textAlign: 'center'
}

const tdBase = {
  padding: '1.25rem 1.5rem',
  fontSize: '0.95rem'
}

const tdIdStyle = {
  ...tdBase,
  color: '#475569',
  fontWeight: '600'
}

const tdNameStyle = {
  ...tdBase,
  color: '#1e293b',
  fontWeight: '700'
}

const tdStyle = {
  ...tdBase,
  color: '#475569'
}

const rowStyle = index => ({
  borderBottom: '1px solid #f1f5f9',
  background: index % 2 === 0 ? 'white' : '#f8fafc',
  transition: 'background 0.2s ease'
})

const editButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.625rem 1rem',
  background: '#dbeafe',
  color: '#1e40af',
  border: '1px solid #bfdbfe',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
}

const deleteButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.625rem 1rem',
  background: '#fee2e2',
  color: '#dc2626',
  border: '1px solid #fecaca',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
}

/* handlers de estilo */
const onFocus = e => { e.target.style.borderColor = '#667eea' }
const onBlur = e => { e.target.style.borderColor = '#e2e8f0' }

const onSubmitEnter = e => {
  e.currentTarget.style.transform = 'translateY(-2px)'
  e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)'
}
const onSubmitLeave = e => {
  e.currentTarget.style.transform = 'translateY(0)'
  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
}

const onEditEnter = e => {
  e.currentTarget.style.background = '#1e40af'
  e.currentTarget.style.color = 'white'
  e.currentTarget.style.borderColor = '#1e40af'
}
const onEditLeave = e => {
  e.currentTarget.style.background = '#dbeafe'
  e.currentTarget.style.color = '#1e40af'
  e.currentTarget.style.borderColor = '#bfdbfe'
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