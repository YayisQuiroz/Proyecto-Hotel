const { getPool } = require('../config/db'); // pool de pg

class HorariosEventoModel {
  static async getAll() {
    const pool = await getPool();
    const result = await pool.query('SELECT * FROM HorariosEvento WHERE activo = TRUE');
    return result.rows;
  }

  static async getById(id) {
    const pool = await getPool();
    const result = await pool.query(
      'SELECT * FROM HorariosEvento WHERE id_horario = $1 AND activo = TRUE',
      [id]
    );
    return result.rows[0];
  }

  static async create(horario) {
    const pool = await getPool();
    const result = await pool.query(
      `INSERT INTO HorariosEvento 
        (id_evento, hora_inicio, hora_fin, descripcion, activo)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id_horario`,
      [horario.id_evento, horario.hora_inicio, horario.hora_fin, horario.descripcion, horario.activo ?? true]
    );
    return result.rows[0];
  }

  static async update(id, horario) {
    const pool = await getPool();
    const result = await pool.query(
      `UPDATE HorariosEvento
       SET id_evento = $1,
           hora_inicio = $2,
           hora_fin = $3,
           descripcion = $4,
           activo = $5,
           fecha_modificacion = NOW()
       WHERE id_horario = $6`,
      [horario.id_evento, horario.hora_inicio, horario.hora_fin, horario.descripcion, horario.activo ?? true, id]
    );
    return result.rowCount;
  }

  static async delete(id) {
    const pool = await getPool();
    const result = await pool.query(
      'UPDATE HorariosEvento SET activo = FALSE WHERE id_horario = $1',
      [id]
    );
    return result.rowCount;
  }
}

module.exports = HorariosEventoModel;
