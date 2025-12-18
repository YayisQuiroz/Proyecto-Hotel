const { getPool } = require('../config/db');

class LogisticaEventoModel {
  static async getAll() {
    const pool = await getPool();
    const result = await pool.query('SELECT * FROM LogisticaEvento WHERE activo = TRUE');
    return result.rows;
  }

  static async getById(id) {
    const pool = await getPool();
    const result = await pool.query(
      'SELECT * FROM LogisticaEvento WHERE id_logistica = $1 AND activo = TRUE',
      [id]
    );
    return result.rows[0];
  }

  static async create(logistica) {
    const pool = await getPool();
    const result = await pool.query(
      `INSERT INTO LogisticaEvento
        (id_evento, id_material, cantidad_usada, notas, activo)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id_logistica`,
      [
        logistica.id_evento,
        logistica.id_material,
        logistica.cantidad_usada,
        logistica.notas,
        logistica.activo ?? true
      ]
    );
    return result.rows[0];
  }

  static async update(id, logistica) {
    const pool = await getPool();
    const result = await pool.query(
      `UPDATE LogisticaEvento
       SET id_evento = $1,
           id_material = $2,
           cantidad_usada = $3,
           notas = $4,
           activo = $5,
           fecha_modificacion = NOW()
       WHERE id_logistica = $6`,
      [
        logistica.id_evento,
        logistica.id_material,
        logistica.cantidad_usada,
        logistica.notas,
        logistica.activo ?? true,
        id
      ]
    );
    return result.rowCount;
  }

  static async delete(id) {
    const pool = await getPool();
    const result = await pool.query(
      'UPDATE LogisticaEvento SET activo = FALSE WHERE id_logistica = $1',
      [id]
    );
    return result.rowCount;
  }
}

module.exports = LogisticaEventoModel;
