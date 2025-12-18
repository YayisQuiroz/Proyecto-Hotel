const { getPool } = require('../config/db');

class StaffAsignadoModel {
  static async getAll() {
    const pool = await getPool();
    const result = await pool.query('SELECT * FROM StaffAsignado WHERE activo = TRUE');
    return result.rows;
  }

  static async getById(id) {
    const pool = await getPool();
    const result = await pool.query(
      'SELECT * FROM StaffAsignado WHERE id_asignacion = $1 AND activo = TRUE',
      [id]
    );
    return result.rows[0];
  }

  static async create(asignacion) {
    const pool = await getPool();
    const result = await pool.query(
      `
      INSERT INTO StaffAsignado (id_evento, id_staff, notas, activo)
      VALUES ($1, $2, $3, $4)
      RETURNING id_asignacion
      `,
      [
        asignacion.id_evento,
        asignacion.id_staff,
        asignacion.notas,
        asignacion.activo ?? true
      ]
    );
    return result.rows[0];
  }

  static async update(id, asignacion) {
    const pool = await getPool();
    const result = await pool.query(
      `
      UPDATE StaffAsignado
      SET id_evento = $1,
          id_staff = $2,
          notas = $3,
          activo = $4,
          fecha_modificacion = NOW()
      WHERE id_asignacion = $5
      `,
      [
        asignacion.id_evento,
        asignacion.id_staff,
        asignacion.notas,
        asignacion.activo ?? true,
        id
      ]
    );
    return result.rowCount;
  }

  static async delete(id) {
    const pool = await getPool();
    const result = await pool.query(
      'UPDATE StaffAsignado SET activo = FALSE WHERE id_asignacion = $1',
      [id]
    );
    return result.rowCount;
  }
}

module.exports = StaffAsignadoModel;
