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
            <Calendar :size="28" color="white" />
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
              Reservas
            </h1>
          </div>
        </div>
      </div>

      <!-- Formulario Crear Reserva -->
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
          <Plus :size="24" />
          Crear Reserva
        </h2>

        <div
          :style="{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }"
        >
          <!-- Huésped -->
          <div>
            <label :style="labelStyle">Huésped</label>
            <select
              name="idHuesped"
              v-model="form.idHuesped"
              required
              :style="selectStyle"
              @focus="onFocus"
              @blur="onBlur"
            >
              <option value="">Seleccione un huésped</option>
              <option
                v-for="h in huespedes"
                :key="h.idHuesped"
                :value="h.idHuesped"
              >
                {{ h.nombre }} {{ h.apellido }}
              </option>
            </select>
          </div>

          <!-- Habitación -->
          <div>
            <label :style="labelStyle">Habitación</label>
            <select
              name="idHabitacion"
              v-model="form.idHabitacion"
              required
              :style="selectStyle"
              @focus="onFocus"
              @blur="onBlur"
            >
              <option value="">Seleccione una habitación</option>
              <option
                v-for="h in habitaciones"
                :key="h.idHabitacion"
                :value="h.idHabitacion"
              >
                {{ h.numeroHabitacion }} - {{ h.tipo }}
              </option>
            </select>
          </div>

          <!-- Fechas -->
          <div>
            <label :style="labelStyle">Fecha Entrada</label>
            <input
              type="date"
              name="fechaEntrada"
              v-model="form.fechaEntrada"
              required
              :style="inputStyle"
              @focus="onFocus"
              @blur="onBlur"
            />
          </div>

          <div>
            <label :style="labelStyle">Fecha Salida</label>
            <input
              type="date"
              name="fechaSalida"
              v-model="form.fechaSalida"
              required
              :style="inputStyle"
              @focus="onFocus"
              @blur="onBlur"
            />
          </div>

          <!-- Total estimado -->
          <div>
            <label :style="labelStyle">Total Estimado</label>
            <input
              type="number"
              name="totalEstimado"
              v-model="form.totalEstimado"
              placeholder="Total estimado"
              required
              :style="inputStyle"
              @focus="onFocus"
              @blur="onBlur"
            />
          </div>

          <div :style="{ display: 'flex', alignItems: 'flex-end' }">
            <button
              @click="handleSubmit"
              :style="buttonStyle"
              @mouseenter="onButtonEnter"
              @mouseleave="onButtonLeave"
            >
              <Plus :size="18" />
              Crear Reserva
            </button>
          </div>
        </div>
      </div>

      <!-- Tabla Reservas -->
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
            Reservas Activas
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
                <th :style="thCenterStyle">Estado</th>
                <th :style="thCenterStyle">Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(r, index) in reservasPaginadas"
                :key="r.idReserva"
                :style="rowStyle(index)"
                @mouseenter="e => (e.currentTarget.style.background = '#f1f5f9')"
                @mouseleave="e => (e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f8fafc')"
              >
                <td :style="tdIdStyle">{{ r.idReserva }}</td>
                <td :style="tdMainStyle">{{ r.nombreHuesped || `Huésped #${r.idHuesped}` }}</td>
                <td :style="tdBoldStyle">{{ r.numeroHabitacion || r.idHabitacion }}</td>
                <td :style="tdStyle">{{ formatearFecha(r.fechaEntrada) }}</td>
                <td :style="tdStyle">{{ formatearFecha(r.fechaSalida) }}</td>
                <td :style="tdTotalStyle">
                  ${{ r.totalEstimado }}
                </td>
                <td :style="{ padding: '1.25rem 1.5rem', textAlign: 'center' }">
                  <span v-if="tieneCheckout(r.idReserva)" :style="badgeCompletedStyle">
                    ✅ Completado
                  </span>
                  <span v-else-if="tieneCheckin(r.idReserva)" :style="badgeSuccessStyle">
                    🏨 Hospedado
                  </span>
                  <span v-else :style="badgePendingStyle">
                    ⏳ Pendiente
                  </span>
                </td>
                <td :style="{ padding: '1.25rem 1.5rem', textAlign: 'center' }">
                  <div :style="{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }">
                    <!-- Botón Check-in: solo si NO tiene check-in -->
                    <button
                      v-if="!tieneCheckin(r.idReserva) && !tieneCheckout(r.idReserva)"
                      @click="abrirModalCheckin(r)"
                      :style="checkinButtonStyle"
                      @mouseenter="onCheckinEnter"
                      @mouseleave="onCheckinLeave"
                    >
                      <DoorOpen :size="16" />
                      Check-in
                    </button>
                    
                    <!-- Botón Check-out: solo si tiene check-in pero NO tiene check-out -->
                    <button
                      v-if="tieneCheckin(r.idReserva) && !tieneCheckout(r.idReserva)"
                      @click="abrirModalCheckout(r)"
                      :style="checkoutButtonStyle"
                      @mouseenter="onCheckoutEnter"
                      @mouseleave="onCheckoutLeave"
                    >
                      <DoorClosed :size="16" />
                      Check-out
                    </button>
                    
                    <!-- Botón Ver Detalles: solo si tiene check-out (completado) -->
                    <button
                      v-if="tieneCheckout(r.idReserva)"
                      @click="abrirModalDetalles(r)"
                      :style="detailsButtonStyle"
                      @mouseenter="onDetailsEnter"
                      @mouseleave="onDetailsLeave"
                    >
                      📋 Ver Detalles
                    </button>
                    
                    <!-- Botón Cancelar: solo si NO tiene check-out -->
                    <button
                      v-if="!tieneCheckout(r.idReserva)"
                      @click="handleEliminar(r.idReserva)"
                      :style="deleteButtonStyle"
                      @mouseenter="onDeleteEnter"
                      @mouseleave="onDeleteLeave"
                    >
                      <Trash2 :size="16" />
                      Cancelar
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="reservas.length === 0"
          :style="{
            padding: '4rem 2rem',
            textAlign: 'center',
            color: '#94a3b8'
          }"
        >
          <Calendar :size="64" :style="{ margin: '0 auto 1rem', opacity: 0.3 }" />
          <p :style="{ margin: 0, fontSize: '1.125rem' }">
            No hay reservas registradas
          </p>
        </div>

        <!-- Paginación -->
        <div
          v-if="reservas.length > 0"
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
            {{ Math.min(paginaActual * itemsPorPagina, reservas.length) }} de 
            {{ reservas.length }} reservas
          </div>

          <div :style="{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }">
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

    <!-- Modal Check-in -->
    <div v-if="showCheckinModal" :style="modalOverlayStyle" @click.self="cerrarModal">
      <div :style="modalContentStyle">
        <div :style="modalHeaderStyle">
          <h2 :style="{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }">
            Realizar Check-in
          </h2>
          <button @click="cerrarModal" :style="btnCloseStyle">✕</button>
        </div>

        <div :style="{ padding: '2rem' }">
          <div :style="infoReservaStyle">
            <p :style="{ margin: '0.5rem 0', color: '#475569' }">
              <strong>Reserva ID:</strong> {{ selectedReserva?.idReserva }}
            </p>
            <p :style="{ margin: '0.5rem 0', color: '#475569' }">
              <strong>Huésped:</strong> {{ selectedReserva?.nombreHuesped }}
            </p>
            <p :style="{ margin: '0.5rem 0', color: '#475569' }">
              <strong>Habitación:</strong> {{ selectedReserva?.numeroHabitacion }}
            </p>
            <p :style="{ margin: '0.5rem 0', color: '#475569' }">
              <strong>Fecha entrada:</strong> {{ formatearFecha(selectedReserva?.fechaEntrada) }}
            </p>
          </div>

          <form @submit.prevent="handleCheckin">
            <div :style="{ marginBottom: '1.5rem' }">
              <label :style="labelStyle">Empleado que registra *</label>
              <select
                v-model="checkinForm.empleadoRegistro"
                required
                :style="selectStyle"
                @focus="onFocus"
                @blur="onBlur"
              >
                <option value="">Seleccione un empleado</option>
                <option
                  v-for="emp in empleados"
                  :key="emp.idUsuario"
                  :value="emp.idUsuario"
                >
                  {{ emp.nombreCompleto }}
                </option>
              </select>
            </div>

            <div :style="{ marginBottom: '1.5rem' }">
              <label :style="labelStyle">Notas (opcional)</label>
              <textarea 
                v-model="checkinForm.notas"
                rows="3"
                placeholder="Observaciones del check-in..."
                :style="textareaStyle"
                @focus="onFocus"
                @blur="onBlur"
              ></textarea>
            </div>

            <div :style="{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }">
              <button 
                type="button" 
                @click="cerrarModal" 
                :style="btnSecondaryStyle"
                @mouseenter="onSecondaryEnter"
                @mouseleave="onSecondaryLeave"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                :style="btnPrimaryStyle"
                @mouseenter="onPrimaryEnter"
                @mouseleave="onPrimaryLeave"
              >
                ✅ Confirmar Check-in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Check-out -->
    <div v-if="showCheckoutModal" :style="modalOverlayStyle" @click.self="cerrarModalCheckout">
      <div :style="modalContentStyle">
        <div :style="modalHeaderStyle">
          <h2 :style="{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }">
            Realizar Check-out
          </h2>
          <button @click="cerrarModalCheckout" :style="btnCloseStyle">✕</button>
        </div>

        <div :style="{ padding: '2rem' }">
          <div :style="infoReservaStyle">
            <p :style="{ margin: '0.5rem 0', color: '#475569' }">
              <strong>Reserva ID:</strong> {{ selectedReserva?.idReserva }}
            </p>
            <p :style="{ margin: '0.5rem 0', color: '#475569' }">
              <strong>Huésped:</strong> {{ selectedReserva?.nombreHuesped }}
            </p>
            <p :style="{ margin: '0.5rem 0', color: '#475569' }">
              <strong>Habitación:</strong> {{ selectedReserva?.numeroHabitacion }}
            </p>
            <p :style="{ margin: '0.5rem 0', color: '#475569' }">
              <strong>Total estimado:</strong> ${{ selectedReserva?.totalEstimado }}
            </p>
          </div>

          <form @submit.prevent="handleCheckout">
            <div :style="{ marginBottom: '1.5rem' }">
              <label :style="labelStyle">Empleado que registra *</label>
              <select
                v-model="checkoutForm.empleadoRegistro"
                required
                :style="selectStyle"
                @focus="onFocus"
                @blur="onBlur"
              >
                <option value="">Seleccione un empleado</option>
                <option
                  v-for="emp in empleados"
                  :key="emp.idUsuario"
                  :value="emp.idUsuario"
                >
                  {{ emp.nombreCompleto }} (ID: {{ emp.idUsuario }})
                </option>
              </select>
            </div>

            <div :style="{ marginBottom: '1.5rem' }">
              <label :style="labelStyle">Total Final *</label>
              <input 
                v-model.number="checkoutForm.totalFinal"
                type="number"
                step="0.01"
                required
                placeholder="Total a pagar"
                min="0"
                :style="inputStyle"
                @focus="onFocus"
                @blur="onBlur"
              />
            </div>

            <div :style="{ marginBottom: '1.5rem' }">
              <label :style="labelStyle">Notas (opcional)</label>
              <textarea 
                v-model="checkoutForm.notas"
                rows="3"
                placeholder="Observaciones del check-out..."
                :style="textareaStyle"
                @focus="onFocus"
                @blur="onBlur"
              ></textarea>
            </div>

            <div :style="{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }">
              <button 
                type="button" 
                @click="cerrarModalCheckout" 
                :style="btnSecondaryStyle"
                @mouseenter="onSecondaryEnter"
                @mouseleave="onSecondaryLeave"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                :style="btnPrimaryStyle"
                @mouseenter="onPrimaryEnter"
                @mouseleave="onPrimaryLeave"
              >
                ✅ Confirmar Check-out
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Detalles (Check-in y Check-out) -->
    <div v-if="showDetallesModal" :style="modalOverlayStyle" @click.self="cerrarModalDetalles">
      <div :style="{ ...modalContentStyle, maxWidth: '800px' }">
        <div :style="modalHeaderStyle">
          <h2 :style="{ margin: 0, fontSize: '1.5rem', color: '#1e293b' }">
            📋 Detalles de la Reserva
          </h2>
          <button @click="cerrarModalDetalles" :style="btnCloseStyle">✕</button>
        </div>

        <div :style="{ padding: '2rem' }">
          <!-- Información de la Reserva -->
          <div :style="{ ...infoReservaStyle, marginBottom: '2rem' }">
            <h3 :style="{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#1e293b' }">
              Información de la Reserva
            </h3>
            <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }">
              <p :style="{ margin: '0.5rem 0', color: '#475569' }">
                <strong>ID Reserva:</strong> {{ selectedReserva?.idReserva }}
              </p>
              <p :style="{ margin: '0.5rem 0', color: '#475569' }">
                <strong>Huésped:</strong> {{ selectedReserva?.nombreHuesped }}
              </p>
              <p :style="{ margin: '0.5rem 0', color: '#475569' }">
                <strong>Habitación:</strong> {{ selectedReserva?.numeroHabitacion }}
              </p>
              <p :style="{ margin: '0.5rem 0', color: '#475569' }">
                <strong>Fecha Entrada:</strong> {{ formatearFecha(selectedReserva?.fechaEntrada) }}
              </p>
              <p :style="{ margin: '0.5rem 0', color: '#475569' }">
                <strong>Fecha Salida:</strong> {{ formatearFecha(selectedReserva?.fechaSalida) }}
              </p>
              <p :style="{ margin: '0.5rem 0', color: '#059669', fontWeight: '700' }">
                <strong>Total Estimado:</strong> ${{ selectedReserva?.totalEstimado }}
              </p>
            </div>
          </div>

          <!-- Detalles del Check-in -->
          <div v-if="detallesCheckin" :style="{ ...infoReservaStyle, marginBottom: '2rem', background: '#dcfce7' }">
            <h3 :style="{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#166534' }">
              🏨 Detalles del Check-in
            </h3>
            <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }">
              <p :style="{ margin: '0.5rem 0', color: '#166534' }">
                <strong>Fecha Check-in:</strong> {{ formatearFechaHora(detallesCheckin.fechaCheckin) }}
              </p>
              <p :style="{ margin: '0.5rem 0', color: '#166534' }">
                <strong>Empleado:</strong> {{ obtenerNombreEmpleado(detallesCheckin.empleadoRegistro) }}
              </p>
              <p v-if="detallesCheckin.notas" :style="{ margin: '0.5rem 0', color: '#166534', gridColumn: '1 / -1' }">
                <strong>Notas:</strong> {{ detallesCheckin.notas }}
              </p>
            </div>
          </div>

          <!-- Detalles del Check-out -->
          <div v-if="detallesCheckout" :style="{ ...infoReservaStyle, background: '#dbeafe' }">
            <h3 :style="{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#1e40af' }">
              ✅ Detalles del Check-out
            </h3>
            <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }">
              <p :style="{ margin: '0.5rem 0', color: '#1e40af' }">
                <strong>Fecha Check-out:</strong> {{ formatearFechaHora(detallesCheckout.fechaCheckout) }}
              </p>
              <p :style="{ margin: '0.5rem 0', color: '#1e40af' }">
                <strong>Empleado:</strong> {{ obtenerNombreEmpleado(detallesCheckout.empleadoRegistro) }}
              </p>
              <p :style="{ margin: '0.5rem 0', color: '#1e40af', fontWeight: '700' }">
                <strong>Total Final:</strong> ${{ detallesCheckout.totalFinal }}
              </p>
              <p v-if="detallesCheckout.notas" :style="{ margin: '0.5rem 0', color: '#1e40af', gridColumn: '1 / -1' }">
                <strong>Notas:</strong> {{ detallesCheckout.notas }}
              </p>
            </div>
          </div>

          <div :style="{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }">
            <button 
              @click="cerrarModalDetalles" 
              :style="btnPrimaryStyle"
              @mouseenter="onPrimaryEnter"
              @mouseleave="onPrimaryLeave"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import {
  Calendar,
  Trash2,
  Plus,
  DoorOpen,
  DoorClosed
} from 'lucide-vue-next'
import {
  getReservas,
  getHuespedes,
  getHabitacionesDisponibles,
  crearReserva,
  eliminarReserva,
  getCheckins,
  crearCheckin,
  getCheckouts,
  crearCheckout,
  getEmpleados
} from '@/services/reservasService'


const reservas = ref([])
const huespedes = ref([])
const habitaciones = ref([])
const checkins = ref([])
const checkouts = ref([])
const empleados = ref([])

// Check-in modal
const showCheckinModal = ref(false)
const selectedReserva = ref(null)
const checkinForm = reactive({
  empleadoRegistro: '',
  notas: '',
  usuarioCreador: 1
})

// Check-out modal
const showCheckoutModal = ref(false)
const checkoutForm = reactive({
  empleadoRegistro: '',
  totalFinal: null,
  notas: '',
  usuarioCreador: 1
})

// Modal Detalles
const showDetallesModal = ref(false)
const detallesCheckin = ref(null)
const detallesCheckout = ref(null)

// Paginación
const paginaActual = ref(1)
const itemsPorPagina = 10

const form = reactive({
  idHuesped: '',
  idHabitacion: '',
  fechaEntrada: '',
  fechaSalida: '',
  totalEstimado: ''
})

const columnas = ['ID', 'Huésped', 'Habitación', 'Entrada', 'Salida', 'Total']

const totalPaginas = computed(() => Math.ceil(reservas.value.length / itemsPorPagina))

const reservasPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * itemsPorPagina
  const fin = inicio + itemsPorPagina
  return reservas.value.slice(inicio, fin)
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

const formatearFecha = (fecha) => {
  if (!fecha) return ''
  const date = new Date(fecha)
  return date.toLocaleDateString('es-MX')
}

const formatearFechaHora = (fecha) => {
  if (!fecha) return ''
  const date = new Date(fecha)
  return date.toLocaleString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const obtenerNombreEmpleado = (idEmpleado) => {
  const empleado = empleados.value.find(e => e.idUsuario === idEmpleado)
  return empleado ? empleado.nombreCompleto : `Empleado #${idEmpleado}`
}

// Check-in functions
const tieneCheckin = (idReserva) => {
  return checkins.value.some(c => c.idReserva === idReserva && c.activo !== false)
}

const abrirModalCheckin = (reserva) => {
  selectedReserva.value = reserva
  checkinForm.empleadoRegistro = ''
  checkinForm.notas = ''
  checkinForm.usuarioCreador = 1
  showCheckinModal.value = true
}

const cerrarModal = () => {
  showCheckinModal.value = false
  selectedReserva.value = null
}

const handleCheckin = async () => {
  try {
    const data = {
      idReserva: selectedReserva.value.idReserva,
      fechaCheckin: new Date().toISOString(),
      empleadoRegistro: parseInt(checkinForm.empleadoRegistro),
      notas: checkinForm.notas || '',
      usuarioCreador: parseInt(checkinForm.usuarioCreador)
    }

    await crearCheckin(data)
    alert('✅ Check-in realizado correctamente')
    cerrarModal()
    await fetchData()
  } catch (error) {
    alert('❌ Error: ' + error.message)
  }
}

// Check-out functions
const tieneCheckout = (idReserva) => {
  return checkouts.value.some(c => c.idReserva === idReserva && c.activo !== false)
}

const abrirModalCheckout = (reserva) => {
  selectedReserva.value = reserva
  checkoutForm.empleadoRegistro = ''
  checkoutForm.totalFinal = reserva.totalEstimado
  checkoutForm.notas = ''
  checkoutForm.usuarioCreador = 1
  showCheckoutModal.value = true
}

const cerrarModalCheckout = () => {
  showCheckoutModal.value = false
  selectedReserva.value = null
}

const handleCheckout = async () => {
  try {
    const data = {
      idReserva: selectedReserva.value.idReserva,
      empleadoRegistro: parseInt(checkoutForm.empleadoRegistro),
      totalFinal: parseFloat(checkoutForm.totalFinal),
      notas: checkoutForm.notas || '',
      usuarioCreador: parseInt(checkoutForm.usuarioCreador)
    }

    await crearCheckout(data)
    alert('✅ Check-out realizado correctamente. Habitación liberada.')
    cerrarModalCheckout()
    await fetchData()
  } catch (error) {
    alert('❌ Error: ' + error.message)
  }
}

// Funciones del Modal de Detalles
const abrirModalDetalles = async (reserva) => {
  selectedReserva.value = reserva
  
  // Buscar check-in de esta reserva
  const checkin = checkins.value.find(c => c.idReserva === reserva.idReserva)
  detallesCheckin.value = checkin || null
  
  // Buscar check-out de esta reserva
  const checkout = checkouts.value.find(c => c.idReserva === reserva.idReserva)
  detallesCheckout.value = checkout || null
  
  showDetallesModal.value = true
}

const cerrarModalDetalles = () => {
  showDetallesModal.value = false
  selectedReserva.value = null
  detallesCheckin.value = null
  detallesCheckout.value = null
}

const fetchData = async () => {
  try {
    const [resReservas, resHuespedes, resHabitaciones, resCheckins, resCheckouts, resEmpleados] = await Promise.all([
      getReservas(),
      getHuespedes(),
      getHabitacionesDisponibles(),
      getCheckins(),
      getCheckouts(),
      getEmpleados()
    ])
    
    reservas.value = resReservas
    huespedes.value = resHuespedes
    habitaciones.value = resHabitaciones
    checkins.value = resCheckins.filter(c => c.activo !== false)
    checkouts.value = resCheckouts.filter(c => c.activo !== false)
    empleados.value = resEmpleados
    paginaActual.value = 1
  } catch (error) {
    console.error(error)
    alert(error.message)
  }
}

onMounted(fetchData)

const handleSubmit = async () => {
  try {
    await crearReserva({
      IdHuesped: Number(form.idHuesped),
      IdHabitacion: Number(form.idHabitacion),
      FechaEntrada: form.fechaEntrada,
      FechaSalida: form.fechaSalida,
      TotalEstimado: Number(form.totalEstimado),
      Estado: 'Activa'
    })
    alert('Reserva creada ✅')
    form.idHuesped = ''
    form.idHabitacion = ''
    form.fechaEntrada = ''
    form.fechaSalida = ''
    form.totalEstimado = ''
    fetchData()
  } catch (error) {
    alert(error.message)
  }
}

const handleEliminar = async id => {
  if (!window.confirm('¿Cancelar reserva?')) return
  try {
    await eliminarReserva(id)
    fetchData()
  } catch (error) {
    alert(error.message)
  }
}

/* estilos */
const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontSize: '0.875rem',
  fontWeight: '600',
  color: '#475569'
}

const selectStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '0.95rem',
  background: 'white',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '0.95rem',
  transition: 'all 0.2s ease'
}

const textareaStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  transition: 'all 0.2s ease'
}

const buttonStyle = {
  width: '100%',
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

const checkinButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.625rem 1rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
}

const checkoutButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.625rem 1rem',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  color: 'white',
  border: 'none',
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
  padding: '0.625rem 1.25rem',
  background: '#fee2e2',
  color: '#dc2626',
  border: '1px solid #fecaca',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
}

const detailsButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.625rem 1rem',
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: '600',
  fontSize: '0.875rem',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
}

const badgeSuccessStyle = {
  display: 'inline-block',
  padding: '0.35rem 0.75rem',
  borderRadius: '12px',
  fontSize: '0.85rem',
  fontWeight: '600',
  background: '#dcfce7',
  color: '#166534'
}

const badgeCompletedStyle = {
  display: 'inline-block',
  padding: '0.35rem 0.75rem',
  borderRadius: '12px',
  fontSize: '0.85rem',
  fontWeight: '600',
  background: '#dbeafe',
  color: '#1e40af'
}

const badgePendingStyle = {
  display: 'inline-block',
  padding: '0.35rem 0.75rem',
  borderRadius: '12px',
  fontSize: '0.85rem',
  fontWeight: '600',
  background: '#fef3c7',
  color: '#92400e'
}

// Modal styles
const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
}

const modalContentStyle = {
  background: 'white',
  borderRadius: '20px',
  width: '90%',
  maxWidth: '600px',
  boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
}

const modalHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1.5rem 2rem',
  borderBottom: '2px solid #f1f5f9'
}

const btnCloseStyle = {
  background: 'none',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  color: '#64748b',
  padding: 0,
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  transition: 'background 0.2s ease'
}

const infoReservaStyle = {
  background: '#f8fafc',
  padding: '1rem',
  borderRadius: '12px',
  marginBottom: '1.5rem'
}

const btnSecondaryStyle = {
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  background: 'white',
  color: '#475569',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
}

const btnPrimaryStyle = {
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  border: 'none',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease'
}

/* handlers de estilo */
const onFocus = e => {
  e.target.style.borderColor = '#667eea'
}

const onBlur = e => {
  e.target.style.borderColor = '#e2e8f0'
}

const onButtonEnter = e => {
  e.currentTarget.style.transform = 'translateY(-2px)'
  e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)'
}

const onButtonLeave = e => {
  e.currentTarget.style.transform = 'translateY(0)'
  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
}

const onCheckinEnter = e => {
  e.currentTarget.style.transform = 'translateY(-2px)'
  e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)'
}

const onCheckinLeave = e => {
  e.currentTarget.style.transform = 'translateY(0)'
  e.currentTarget.style.boxShadow = 'none'
}

const onCheckoutEnter = e => {
  e.currentTarget.style.transform = 'translateY(-2px)'
  e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)'
}

const onCheckoutLeave = e => {
  e.currentTarget.style.transform = 'translateY(0)'
  e.currentTarget.style.boxShadow = 'none'
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

const onDetailsEnter = e => {
  e.currentTarget.style.transform = 'translateY(-2px)'
  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)'
}

const onDetailsLeave = e => {
  e.currentTarget.style.transform = 'translateY(0)'
  e.currentTarget.style.boxShadow = 'none'
}

const onSecondaryEnter = e => {
  e.currentTarget.style.background = '#f1f5f9'
}

const onSecondaryLeave = e => {
  e.currentTarget.style.background = 'white'
}

const onPrimaryEnter = e => {
  e.currentTarget.style.transform = 'translateY(-2px)'
  e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)'
}

const onPrimaryLeave = e => {
  e.currentTarget.style.transform = 'translateY(0)'
  e.currentTarget.style.boxShadow = 'none'
}

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

const tdMainStyle = {
  ...tdBase,
  color: '#1e293b',
  fontWeight: '600'
}

const tdBoldStyle = {
  ...tdBase,
  color: '#475569',
  fontWeight: '700'
}

const tdStyle = {
  ...tdBase,
  color: '#475569'
}

const tdTotalStyle = {
  ...tdBase,
  color: '#059669',
  fontWeight: '700'
}

const rowStyle = index => ({
  borderBottom: '1px solid #f1f5f9',
  background: index % 2 === 0 ? 'white' : '#f8fafc',
  transition: 'background 0.2s ease'
})

</script>