const { getPool } = require('../config/db');

class MaterialesModel {
  // ============================
  // OBTENER TODOS LOS MATERIALES
  // ============================
  static async getAll() {
    const pool = await getPool();
    const result = await pool.query('SELECT * FROM dbo.materialesevento ORDER BY nombre');
    return result.rows;
  }

  // ============================
  // OBTENER MATERIAL POR ID
  // ============================
  static async getById(id) {
    const pool = await getPool();
    const result = await pool.query(
      'SELECT * FROM dbo.materialesevento WHERE id_material = $1',
      [id]
    );
    return result.rows[0];
  }

  // ============================
  // CREAR MATERIAL
  // ============================
  static async create(material) {
    const pool = await getPool();
    const result = await pool.query(
      `INSERT INTO dbo.materialesevento (nombre, cantidad, descripcion, activo, fechaModificacion)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING *`,
      [
        material.nombre,
        material.cantidad ?? 0, // Si no envían cantidad, poner 0
        material.descripcion,
        material.activo ?? true
      ]
    );
    return result.rows[0];
  }

  // ============================
  // ACTUALIZAR MATERIAL
  // ============================
  static async update(id, material) {
    const pool = await getPool();
    const result = await pool.query(
      `UPDATE dbo.materialesevento
       SET nombre = $1,
           cantidad = $2,
           descripcion = $3,
           activo = $4,
           fechaModificacion = NOW()
       WHERE id_material = $5
       RETURNING *`,
      [
        material.nombre,
        material.cantidad ?? 0,
        material.descripcion,
        material.activo ?? true,
        id
      ]
    );
    return result.rows[0];
  }

  // ============================
  // BAJA LÓGICA / ELIMINAR
  // ============================
  static async delete(id) {
    const pool = await getPool();
    const result = await pool.query(
      'UPDATE dbo.materialesevento SET activo = false, fechaModificacion = NOW() WHERE id_material = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = MaterialesModel;
