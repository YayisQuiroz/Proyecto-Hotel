const { getPool } = require('../config/db');

class ParticipantesModel {
  // ============================
  // OBTENER TODOS LOS PARTICIPANTES
  // ============================
  static async getAll() {
    const pool = await getPool();
    const result = await pool.query('SELECT * FROM dbo.participantes ORDER BY nombre, apellido');
    return result.rows;
  }

  // ============================
  // OBTENER PARTICIPANTE POR ID
  // ============================
  static async getById(id) {
    const pool = await getPool();
    const result = await pool.query('SELECT * FROM dbo.participantes WHERE id_participante = $1', [id]);
    return result.rows[0];
  }

  // ============================
  // CREAR PARTICIPANTE
  // ============================
  static async create(participante) {
    const { nombre, apellido, correo, telefono, tipo, activo = true } = participante;
    const pool = await getPool();
    const result = await pool.query(
      `INSERT INTO dbo.participantes
        (nombre, apellido, correo, telefono, tipo, activo, fechaCreacion)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id_participante`,
      [nombre, apellido, correo, telefono, tipo, activo]
    );
    return result.rows[0];
  }

  // ============================
  // ACTUALIZAR PARTICIPANTE
  // ============================
  static async update(id, participante) {
    const { nombre, apellido, correo, telefono, tipo, activo = true } = participante;
    const pool = await getPool();
    const result = await pool.query(
      `UPDATE dbo.participantes
       SET nombre = $1,
           apellido = $2,
           correo = $3,
           telefono = $4,
           tipo = $5,
           activo = $6,
           fechaModificacion = NOW()
       WHERE id_participante = $7`,
      [nombre, apellido, correo, telefono, tipo, activo, id]
    );
    return result.rowCount;
  }

  // ============================
  // ELIMINAR PARTICIPANTE (BAJA LOGICA)
  // ============================
  static async delete(id) {
    const pool = await getPool();
    const result = await pool.query(
      'UPDATE dbo.participantes SET activo = false, fechaModificacion = NOW() WHERE id_participante = $1',
      [id]
    );
    return result.rowCount;
  }
}

module.exports = ParticipantesModel;
