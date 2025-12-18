// src/services/huespedesService.js
const API_URL = 'https://localhost:44353/api/Huespedes'

export const getHuespedes = async () => {
  const res = await fetch(`${API_URL}/listar`)
  if (!res.ok) throw new Error('Error al listar huéspedes')
  const data = await res.json()
  return data.filter(h => h.activo !== false)
}

export const crearHuesped = async data => {
  const res = await fetch(`${API_URL}/crear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.mensaje || 'Error al crear huésped')
  }
  return res.json()
}

export const editarHuesped = async (id, data) => {
  const res = await fetch(`${API_URL}/editar/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.mensaje || 'Error al actualizar huésped')
  }
  return res.json()
}

export const eliminarHuesped = async id => {
  const res = await fetch(`${API_URL}/eliminar/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Error al eliminar huésped')
  return res.json()
}
