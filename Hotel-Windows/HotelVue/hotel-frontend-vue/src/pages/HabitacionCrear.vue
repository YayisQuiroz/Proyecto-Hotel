<template>
  <div
    :style="{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif'
    }"
  >
    <div :style="{ maxWidth: '800px', margin: '0 auto' }">
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
            Nueva Habitación
          </h1>
        </div>

        <button
          type="button"
          @click="router.push('/habitaciones')"
          :style="backButtonStyle"
        >
          <ArrowLeft :size="18" />
          Volver
        </button>
      </div>

      <!-- Form -->
      <div
        :style="{
          background: 'white',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }"
      >
        <div :style="{ display: 'grid', gap: '1.5rem' }">
          <!-- Número -->
          <div>
            <label :style="labelStyle">Número de Habitación</label>
            <input
              v-model="form.numeroHabitacion"
              placeholder="Ej: 101, 202, 305..."
              :style="inputStyle"
              @focus="onFocus"
              @blur="onBlur"
            />
          </div>

          <!-- Tipo -->
          <div>
            <label :style="labelStyle">Tipo de Habitación</label>
            <input
              v-model="form.tipo"
              placeholder="Ej: Simple, Doble, Suite..."
              :style="inputStyle"
              @focus="onFocus"
              @blur="onBlur"
            />
          </div>

          <!-- Precio -->
          <div>
            <label :style="labelStyle">Precio por Noche</label>
            <input
              v-model="form.precioNoche"
              placeholder="Ej: 850, 1200, 2500..."
              :style="inputStyle"
              @focus="onFocus"
              @blur="onBlur"
            />
          </div>

          <!-- ESTADO (DROPDOWN) -->
          <div>
            <label :style="labelStyle">Estado</label>
            <select
              v-model="form.estado"
              :style="inputStyle"
            >
              <option value="Disponible">Disponible</option>
              <option value="Ocupada">Ocupada</option>
            </select>
          </div>

          <!-- Descripción -->
          <div>
            <label :style="labelStyle">Descripción</label>
            <textarea
              v-model="form.descripcion"
              rows="4"
              placeholder="Escribe una breve descripción..."
              :style="textareaStyle"
              @focus="onFocus"
              @blur="onBlur"
            />
          </div>

          <!-- Botón -->
          <button
            type="button"
            @click="handleSubmit"
            :style="submitStyle"
            @mouseenter="onSubmitEnter"
            @mouseleave="onSubmitLeave"
          >
            <Save :size="20" />
            Guardar Habitación
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { DoorOpen, Save, ArrowLeft } from 'lucide-vue-next'
import { crearHabitacion } from '@/services/habitacionesService'

const router = useRouter()

const form = reactive({
  numeroHabitacion: '',
  tipo: '',
  precioNoche: '',
  estado: 'Disponible', // 👈 valor por defecto
  descripcion: '',
  usuarioCreador: 2
})

const handleSubmit = async () => {
  const data = {
    numeroHabitacion: String(form.numeroHabitacion),
    tipo: form.tipo,
    precioNoche: Number(form.precioNoche),
    estado: form.estado,
    descripcion: form.descripcion,
    usuarioCreador: Number(form.usuarioCreador)
  }

  try {
    await crearHabitacion(data)
    alert('Habitación creada ✅')
    router.push('/habitaciones')
  } catch (error) {
    alert('Error al crear habitación ❌')
  }
}

/* estilos */
const inputStyle = {
  width: '100%',
  padding: '0.875rem 1rem',
  border: '2px solid #e2e8f0',
  borderRadius: '10px',
  fontSize: '0.95rem',
  outline: 'none'
}

const textareaStyle = { ...inputStyle, resize: 'vertical', minHeight: '100px' }

const labelStyle = {
  fontWeight: '600',
  marginBottom: '0.5rem',
  display: 'block'
}

const backButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1.25rem',
  background: '#f1f5f9',
  borderRadius: '10px',
  cursor: 'pointer'
}

const submitStyle = {
  padding: '1rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: '10px',
  fontWeight: '600',
  cursor: 'pointer'
}

/* focus */
const onFocus = e => (e.target.style.borderColor = '#667eea')
const onBlur = e => (e.target.style.borderColor = '#e2e8f0')
const onSubmitEnter = e => (e.currentTarget.style.transform = 'translateY(-2px)')
const onSubmitLeave = e => (e.currentTarget.style.transform = 'translateY(0)')
</script>
