// src/services/reservasService.js
const API_URL = 'https://localhost:44353/api'

export const getReservas = async () => {
  const res = await fetch(`${API_URL}/Reservas/listar`)
  if (!res.ok) throw new Error('Error al listar reservas')
  return res.json()
}

export const getHuespedes = async () => {
  const res = await fetch(`${API_URL}/Huespedes/listar`)
  if (!res.ok) throw new Error('Error al listar huéspedes')
  const data = await res.json()
  return data.filter(h => h.activo !== false)
}

export const getHabitacionesDisponibles = async () => {
  const res = await fetch(`${API_URL}/Habitaciones/listar`)
  if (!res.ok) throw new Error('Error al listar habitaciones')
  const data = await res.json()
  return data.filter(h => h.estado.toLowerCase() === 'disponible')
}

export const crearReserva = async data => {
  const res = await fetch(`${API_URL}/Reservas/crear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.mensaje || 'Error al crear reserva')
  }
  return res.json()
}

export const eliminarReserva = async id => {
  const res = await fetch(`${API_URL}/Reservas/eliminar/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Error al eliminar reserva')
  return res.json()
}

// ====== FUNCIONES DE CHECK-IN ======

export const getCheckins = async () => {
  const res = await fetch(`${API_URL}/Checkins/listar`)
  if (!res.ok) throw new Error('Error al listar check-ins')
  return res.json()
}

export const crearCheckin = async data => {
  const res = await fetch(`${API_URL}/Checkins/crear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.mensaje || 'Error al crear check-in')
  }
  return res.json()
}

export const verificarCheckinExistente = async (idReserva) => {
  try {
    const checkins = await getCheckins()
    return checkins.find(c => c.idReserva === idReserva && c.activo !== false)
  } catch (error) {
    console.error('Error al verificar check-in:', error)
    return null
  }
}

// ====== FUNCIONES DE CHECK-OUT ======

export const getCheckouts = async () => {
  const res = await fetch(`${API_URL}/Checkouts/listar`)
  if (!res.ok) throw new Error('Error al listar check-outs')
  return res.json()
}

export const crearCheckout = async data => {
  const res = await fetch(`${API_URL}/Checkouts/crear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.mensaje || 'Error al crear check-out')
  }
  return res.json()
}

export const verificarCheckoutExistente = async (idReserva) => {
  try {
    const checkouts = await getCheckouts()
    return checkouts.find(c => c.idReserva === idReserva && c.activo !== false)
  } catch (error) {
    console.error('Error al verificar check-out:', error)
    return null
  }
}

// ====== FUNCIONES DE USUARIOS/EMPLEADOS ======

export const getEmpleados = async () => {
  const res = await fetch(`${API_URL}/Usuario/listar`)
  if (!res.ok) throw new Error('Error al listar empleados')
  const data = await res.json()

  return data
    .filter(u => (u.rol === 1 || u.rol === "1") && u.activo !== false)
    .map(u => ({
      ...u,
      nombreCompleto: `${u.nombre} ${u.apellido}`
    }))
}
