const { getPool } = require('../config/db');

class EventosModel {
  static async getAll() {
    const pool = await getPool();
    const result = await pool.query('SELECT * FROM dbo.eventos ORDER BY fecha_inicio ASC');
    return result.rows;
  }

  static async getById(id) {
    const pool = await getPool();
    const result = await pool.query('SELECT * FROM dbo.eventos WHERE id_evento = $1', [id]);
    return result.rows[0];
  }

  static async create(evento) {
    const { titulo, descripcion, id_categoria, fecha_inicio, fecha_fin, id_salon, usuario_responsable, activo = true } = evento;
    const pool = await getPool();
    const result = await pool.query(
      `INSERT INTO dbo.eventos 
       (titulo, descripcion, id_categoria, fecha_inicio, fecha_fin, id_salon, usuario_responsable, activo, fechaCreacion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING id_evento`,
      [titulo, descripcion, id_categoria, fecha_inicio, fecha_fin, id_salon, usuario_responsable, activo]
    );
    return result.rows[0];
  }

  static async update(id, evento) {
    const { titulo, descripcion, id_categoria, fecha_inicio, fecha_fin, id_salon, usuario_responsable, activo = true } = evento;
    const pool = await getPool();
    const result = await pool.query(
      `UPDATE dbo.eventos
       SET titulo = $1,
           descripcion = $2,
           id_categoria = $3,
           fecha_inicio = $4,
           fecha_fin = $5,
           id_salon = $6,
           usuario_responsable = $7,
           activo = $8,
           fechaModificacion = NOW()
       WHERE id_evento = $9`,
      [titulo, descripcion, id_categoria, fecha_inicio, fecha_fin, id_salon, usuario_responsable, activo, id]
    );
    return result.rowCount;
  }

  static async delete(id) {
    const pool = await getPool();
    const result = await pool.query(
      `UPDATE dbo.eventos
       SET activo = false, fechaModificacion = NOW()
       WHERE id_evento = $1`,
      [id]
    );
    return result.rowCount;
  }
}

module.exports = EventosModel;
