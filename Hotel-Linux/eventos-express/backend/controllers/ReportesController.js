const { getPool } = require('../config/db'); // pg pool

class ReportesController {

  // ============================
  // EVENTOS CON RESPONSABLE
  // ============================
  static async eventosConResponsable(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      const pool = await getPool();

      const params = [];
      let where = 'WHERE 1=1';

      if (fecha_inicio) {
        params.push(fecha_inicio);
        where += ` AND e.fecha_inicio >= $${params.length}::timestamp`;
      }
      if (fecha_fin) {
        params.push(fecha_fin);
        where += ` AND e.fecha_fin <= $${params.length}::timestamp`;
      }

      const query = `
        SELECT 
          e.id_evento,
          e.titulo,
          e.descripcion,
          c.nombre AS categoria,
          s.nombre AS salon,
          u.nombre || ' ' || u.apellido AS responsable,
          u.correo AS correo_responsable,
          e.fecha_inicio,
          e.fecha_fin
        FROM dbo.eventos e
        INNER JOIN dbo.categoriaseventos c ON e.id_categoria = c.id_categoria
        INNER JOIN dbo.salonesevento s ON e.id_salon = s.id_salon
        LEFT JOIN public.usuarios_fdw u ON u.id_usuario = e.usuario_responsable
        ${where}
        ORDER BY e.fecha_inicio
      `;

      const result = await pool.query(query, params);
      res.json(result.rows);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener eventos con responsable' });
    }
  }

  // ============================
  // EVENTOS CON PARTICIPANTES
  // ============================
  static async eventosConParticipantes(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      const pool = await getPool();

      const params = [];
      let where = 'WHERE 1=1';

      if (fecha_inicio) {
        params.push(fecha_inicio);
        where += ` AND e.fecha_inicio >= $${params.length}::timestamp`;
      }
      if (fecha_fin) {
        params.push(fecha_fin);
        where += ` AND e.fecha_fin <= $${params.length}::timestamp`;
      }

      const query = `
        SELECT 
          e.titulo AS evento,
          p.nombre || ' ' || p.apellido AS participante,
          p.tipo AS tipo_participante,
          CASE 
            WHEN h.id_huesped IS NOT NULL THEN 'Huésped del hotel'
            ELSE 'Externo'
          END AS origen,
          e.fecha_inicio,
          e.fecha_fin
        FROM dbo.registroparticipantes rp
        INNER JOIN dbo.participantes p ON rp.id_participante = p.id_participante
        INNER JOIN dbo.eventos e ON rp.id_evento = e.id_evento
        LEFT JOIN public.huespedes_fdw h
          ON lower(h.nombre) = lower(p.nombre)
         AND lower(h.apellido) = lower(p.apellido)
        ${where}
        ORDER BY evento, participante
      `;

      const result = await pool.query(query, params);
      res.json(result.rows);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener eventos con participantes' });
    }
  }

  // ============================
  // EVENTOS CON STAFF
  // ============================
  static async eventosConStaff(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      const pool = await getPool();

      const params = [];
      let where = 'WHERE 1=1';

      if (fecha_inicio) {
        params.push(fecha_inicio);
        where += ` AND e.fecha_inicio >= $${params.length}::timestamp`;
      }
      if (fecha_fin) {
        params.push(fecha_fin);
        where += ` AND e.fecha_fin <= $${params.length}::timestamp`;
      }

      const query = `
        SELECT 
          e.titulo AS evento,
          u.nombre || ' ' || u.apellido AS responsable,
          u.correo AS correo_responsable,
          s.nombre AS staff,
          s.rol,
          s.telefono,
          sa.notas,
          e.fecha_inicio,
          e.fecha_fin
        FROM dbo.staffasignado sa
        INNER JOIN dbo.eventos e ON sa.id_evento = e.id_evento
        INNER JOIN dbo.staffevento s ON sa.id_staff = s.id_staff
        LEFT JOIN public.usuarios_fdw u ON u.id_usuario = e.usuario_responsable
        ${where}
        ORDER BY e.titulo, s.rol
      `;

      const result = await pool.query(query, params);
      res.json(result.rows);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener eventos con staff' });
    }
  }

  // ============================
  // MATERIALES CON RESPONSABLE
  // ============================
  static async materialesConResponsable(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      const pool = await getPool();

      const params = [];
      let where = 'WHERE 1=1';

      if (fecha_inicio) {
        params.push(fecha_inicio);
        where += ` AND e.fecha_inicio >= $${params.length}::timestamp`;
      }
      if (fecha_fin) {
        params.push(fecha_fin);
        where += ` AND e.fecha_fin <= $${params.length}::timestamp`;
      }

      const query = `
        SELECT 
          e.titulo AS evento,
          m.nombre AS material,
          l.cantidad_usada,
          l.notas,
          u.nombre || ' ' || u.apellido AS responsable,
          e.fecha_inicio,
          e.fecha_fin
        FROM dbo.logisticaevento l
        INNER JOIN dbo.eventos e ON l.id_evento = e.id_evento
        INNER JOIN dbo.materialesevento m ON l.id_material = m.id_material
        LEFT JOIN public.usuarios_fdw u ON u.id_usuario = e.usuario_responsable
        ${where}
        ORDER BY evento, material
      `;

      const result = await pool.query(query, params);
      res.json(result.rows);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener materiales por evento' });
    }
  }

  // ============================
  // REPORTE FULL (OPTIMIZADO)
  // ============================
  static async reporteFull(req, res) {
    try {
      const { fecha_inicio, fecha_fin } = req.query;
      const pool = await getPool();

      const params = [];
      let where = 'WHERE 1=1';

      if (fecha_inicio) {
        params.push(fecha_inicio);
        where += ` AND e.fecha_inicio >= $${params.length}::timestamp`;
      }
      if (fecha_fin) {
        params.push(fecha_fin);
        where += ` AND e.fecha_fin <= $${params.length}::timestamp`;
      }

      const query = `
        SELECT 
          e.id_evento,
          e.titulo,
          c.nombre AS categoria,
          s.nombre AS salon,
          u.nombre || ' ' || u.apellido AS responsable,
          u.correo AS correo_responsable,
          COALESCE(rp.total_participantes, 0) AS total_participantes,
          COALESCE(sa.total_staff, 0) AS total_staff,
          COALESCE(lg.total_materiales, 0) AS total_materiales,
          e.fecha_inicio,
          e.fecha_fin
        FROM dbo.eventos e
        INNER JOIN dbo.categoriaseventos c ON e.id_categoria = c.id_categoria
        INNER JOIN dbo.salonesevento s ON e.id_salon = s.id_salon
        LEFT JOIN public.usuarios_fdw u ON u.id_usuario = e.usuario_responsable

        LEFT JOIN (
          SELECT id_evento, COUNT(*) AS total_participantes
          FROM dbo.registroparticipantes
          GROUP BY id_evento
        ) rp ON rp.id_evento = e.id_evento

        LEFT JOIN (
          SELECT id_evento, COUNT(*) AS total_staff
          FROM dbo.staffasignado
          GROUP BY id_evento
        ) sa ON sa.id_evento = e.id_evento

        LEFT JOIN (
          SELECT id_evento, COUNT(*) AS total_materiales
          FROM dbo.logisticaevento
          GROUP BY id_evento
        ) lg ON lg.id_evento = e.id_evento

        ${where}
        ORDER BY e.fecha_inicio
      `;

      const result = await pool.query(query, params);
      res.json(result.rows);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al generar reporte completo' });
    }
  }
}

module.exports = ReportesController;
