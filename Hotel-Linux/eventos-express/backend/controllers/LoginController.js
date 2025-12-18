const { getPool } = require('../config/db');

const login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
      return res.status(400).json({ error: 'Correo y contraseña obligatorios' });
    }

    const pool = await getPool();

    const result = await pool.query(
      `
      SELECT
        id_usuario,
        nombre,
        apellido,
        correo,
        rol,
        contraseña_hash
      FROM usuarios_fdw
      WHERE correo = $1
      `,
      [correo]
    );

    const usuario = result.rows[0];

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // ⚠️ comparación simple (igual que antes)
    if (usuario.contraseña_hash !== contraseña) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Respuesta segura
    res.json({
      message: '✅ Login correcto',
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ error: 'Error en servidor al hacer login' });
  }
};

module.exports = { login };
