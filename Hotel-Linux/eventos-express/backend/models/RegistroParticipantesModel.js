const { getPool } = require('../config/db');

class RegistroParticipantesModel {
  static async getAll() {
    const pool = await getPool();
    const result = await pool.query(`
      SELECT r.*, e.titulo AS nombre_evento, p.nombre AS nombre_participante, p.apellido AS apellido_participante
      FROM RegistroParticipantes r
      JOIN Eventos e ON r.id_evento = e.id_evento
      JOIN Participantes p ON r.id_participante = p.id_participante
      WHERE r.activo = TRUE
    `);
    return result.rows;
  }

  static async getById(id) {
    const pool = await getPool();
    const result = await pool.query(
      `
      SELECT r.*, e.titulo AS nombre_evento, p.nombre AS nombre_participante, p.apellido AS apellido_participante
      FROM RegistroParticipantes r
      JOIN Eventos e ON r.id_evento = e.id_evento
      JOIN Participantes p ON r.id_participante = p.id_participante
      WHERE r.id_registro = $1 AND r.activo = TRUE
      `,
      [id]
    );
    return result.rows[0];
  }

  static async create(registro) {
    const pool = await getPool();
    const result = await pool.query(
      `
      INSERT INTO RegistroParticipantes 
        (id_evento, id_participante, asistencia, notas, activo)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id_registro
      `,
      [
        registro.id_evento,
        registro.id_participante,
        registro.asistencia ?? false,
        registro.notas,
        registro.activo ?? true
      ]
    );
    return result.rows[0];
  }

  static async update(id, registro) {
    const pool = await getPool();
    const result = await pool.query(
      `
      UPDATE RegistroParticipantes
      SET id_evento = $1,
          id_participante = $2,
          asistencia = $3,
          notas = $4,
          activo = $5,
          fecha_modificacion = NOW()
      WHERE id_registro = $6
      `,
      [
        registro.id_evento,
        registro.id_participante,
        registro.asistencia ?? false,
        registro.notas,
        registro.activo ?? true,
        id
      ]
    );
    return result.rowCount;
  }

  static async delete(id) {
    const pool = await getPool();
    const result = await pool.query(
      'UPDATE RegistroParticipantes SET activo = FALSE WHERE id_registro = $1',
      [id]
    );
    return result.rowCount;
  }
}

module.exports = RegistroParticipantesModel;
