using HotelAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace HotelAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly HotelApiContext _context;

        public AuthController(HotelApiContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Correo == dto.Correo && u.Activo == true);

            if (usuario == null)
                return Unauthorized("Correo no encontrado");

            // ✅ VERIFICACIÓN DOBLE (HASH Y TEXTO PLANO)
            bool passwordCorrecta =
                usuario.ContraseñaHash == dto.Password ||
                usuario.ContraseñaHash == ConvertirSha256(dto.Password);

            if (!passwordCorrecta)
                return Unauthorized("Contraseña incorrecta");

            // ✅ RESPUESTA LIMPIA (sin password)
            return Ok(new
            {
                usuario.IdUsuario,
                usuario.Nombre,
                usuario.Apellido,
                usuario.Rol
            });
        }

        private string ConvertirSha256(string texto)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(texto);
            var hash = sha256.ComputeHash(bytes);
            return BitConverter.ToString(hash).Replace("-", "").ToLower();
        }
    }
}
