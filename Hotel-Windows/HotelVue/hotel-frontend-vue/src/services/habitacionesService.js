// src/services/habitacionesService.js
const API_URL = 'https://localhost:44353/api/Habitaciones'

export const getHabitaciones = async () => {
  const res = await fetch(`${API_URL}/listar`)
  if (!res.ok) throw new Error('Error al listar habitaciones')
  return res.json()
}

export const getHabitacionById = async id => {
  const res = await fetch(`${API_URL}/obtener/${id}`)
  if (!res.ok) throw new Error('Habitación no encontrada')
  return res.json()
}

export const crearHabitacion = async data => {
  const res = await fetch('https://localhost:44353/api/Habitaciones/crear', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Error al crear habitación')
  return res.json()
}

export const editarHabitacion = async (id, data) => {
  const res = await fetch(`${API_URL}/editar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Error al editar habitación')
  return res.text()
}

export const eliminarHabitacion = async id => {
  const res = await fetch(`${API_URL}/eliminar/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Error al eliminar habitación')
  return res.text()
}
