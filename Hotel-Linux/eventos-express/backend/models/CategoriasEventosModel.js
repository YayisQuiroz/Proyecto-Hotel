const { getPool } = require('../config/db');

class CategoriasEventosModel {
  static async getAll() {
    const pool = await getPool();
    const result = await pool.query('SELECT * FROM dbo.categoriaseventos ORDER BY nombre ASC');
    return result.rows;
  }

  static async getById(id) {
    const pool = await getPool();
    const result = await pool.query('SELECT * FROM dbo.categoriaseventos WHERE id_categoria = $1', [id]);
    return result.rows[0];
  }

  static async create(categoria) {
    const { nombre, descripcion, activo = true } = categoria;
    const pool = await getPool();
    const result = await pool.query(
      `INSERT INTO dbo.categoriaseventos (nombre, descripcion, activo, fechaCreacion)
       VALUES ($1, $2, $3, NOW())
       RETURNING id_categoria`,
      [nombre, descripcion, activo]
    );
    return result.rows[0];
  }

  static async update(id, categoria) {
    const { nombre, descripcion, activo = true } = categoria;
    const pool = await getPool();
    const result = await pool.query(
      `UPDATE dbo.categoriaseventos
       SET nombre = $1,
           descripcion = $2,
           activo = $3,
           fechaModificacion = NOW()
       WHERE id_categoria = $4`,
      [nombre, descripcion, activo, id]
    );
    return result.rowCount;
  }

  static async delete(id) {
    const pool = await getPool();
    const result = await pool.query(
      `UPDATE dbo.categoriaseventos
       SET activo = false, fechaModificacion = NOW()
       WHERE id_categoria = $1`,
      [id]
    );
    return result.rowCount;
  }
}

module.exports = CategoriasEventosModel;
