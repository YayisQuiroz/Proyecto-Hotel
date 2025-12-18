const { getPool } = require('../config/db');

class StaffEventoModel {
  // ============================
  // OBTENER TODOS LOS STAFF
  // ============================
  static async getAll(filters = {}) {
    const pool = await getPool();
    let query = 'SELECT * FROM dbo.staffevento WHERE 1=1';
    const params = [];
    let idx = 1; // contador para los placeholders $1, $2, ...

    // Filtro por búsqueda general (nombre o rol)
    if (filters.search) {
      query += ` AND (nombre ILIKE $${idx} OR rol ILIKE $${idx})`;
      params.push(`%${filters.search}%`);
      idx++;
    }

    // Filtro por rol específico
    if (filters.rol) {
      query += ` AND rol = $${idx}`;
      params.push(filters.rol);
      idx++;
    }

    // Filtro por estado activo
    if (filters.activo !== undefined) {
      query += ` AND activo = $${idx}`;
      params.push(filters.activo);
      idx++;
    }

    query += ' ORDER BY nombre ASC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  // ============================
  // OBTENER STAFF POR ID
  // ============================
  static async getById(id) {
    const pool = await getPool();
    const result = await pool.query('SELECT * FROM dbo.staffevento WHERE id_staff = $1', [id]);
    return result.rows[0];
  }

  // ============================
  // CREAR STAFF
  // ============================
  static async create(staff) {
    const { nombre, rol, telefono, activo = true } = staff;
    const pool = await getPool();
    const result = await pool.query(
      `INSERT INTO dbo.staffevento (nombre, rol, telefono, activo, fechaCreacion)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id_staff`,
      [nombre, rol, telefono, activo]
    );
    return result.rows[0];
  }

  // ============================
  // ACTUALIZAR STAFF
  // ============================
  static async update(id, staff) {
    const { nombre, rol, telefono, activo = true } = staff;
    const pool = await getPool();
    const result = await pool.query(
      `UPDATE dbo.staffevento
       SET nombre = $1,
           rol = $2,
           telefono = $3,
           activo = $4,
           fechaModificacion = NOW()
       WHERE id_staff = $5`,
      [nombre, rol, telefono, activo, id]
    );
    return result.rowCount;
  }

  // ============================
  // ELIMINAR STAFF (BAJA LÓGICA)
  // ============================
  static async delete(id) {
    const pool = await getPool();
    const result = await pool.query(
      `UPDATE dbo.staffevento
       SET activo = false, fechaModificacion = NOW()
       WHERE id_staff = $1`,
      [id]
    );
    return result.rowCount;
  }
}

module.exports = StaffEventoModel;
