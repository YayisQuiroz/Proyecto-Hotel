const { getPool } = require('../config/db');

class SalonesModel {
  // ============================
  // OBTENER TODOS LOS SALONES
  // ============================
  static async getAll() {
    try {
      const pool = await getPool();
      const result = await pool.query('SELECT * FROM dbo.salonesevento ORDER BY nombre');
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  // ============================
  // OBTENER SALON POR ID
  // ============================
  static async getById(id) {
    try {
      const pool = await getPool();
      const result = await pool.query(
        'SELECT * FROM dbo.salonesevento WHERE id_salon = $1',
        [id]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  // ============================
  // CREAR SALON
  // ============================
  static async create(salon) {
    try {
      const pool = await getPool();
      const result = await pool.query(
        `INSERT INTO dbo.salonesevento (nombre, capacidad, ubicacion, descripcion, activo)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id_salon`,
        [
          salon.nombre,
          salon.capacidad,
          salon.ubicacion,
          salon.descripcion,
          salon.activo ?? true
        ]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  }

  // ============================
  // ACTUALIZAR SALON
  // ============================
  static async update(id, salon) {
    try {
      const pool = await getPool();
      const result = await pool.query(
        `UPDATE dbo.salonesevento
         SET nombre = $1,
             capacidad = $2,
             ubicacion = $3,
             descripcion = $4,
             activo = $5,
             fechaModificacion = NOW()
         WHERE id_salon = $6`,
        [
          salon.nombre,
          salon.capacidad,
          salon.ubicacion,
          salon.descripcion,
          salon.activo ?? true,
          id
        ]
      );
      return result.rowCount;
    } catch (err) {
      throw err;
    }
  }

  // ============================
  // ELIMINAR SALON
  // ============================
  // ============================
// ELIMINAR SALON (BAJA LOGICA)
// ============================
static async delete(id) {
  try {
    const pool = await getPool();
    const result = await pool.query(
      'UPDATE dbo.salonesevento SET activo = false WHERE id_salon = $1',
      [id]
    );
    return result.rowCount;
  } catch (err) {
    throw err;
  }
}

}

module.exports = SalonesModel;
