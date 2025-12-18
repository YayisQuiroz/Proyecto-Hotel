using HotelAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly HotelApiContext _context;

        public UsuarioController(HotelApiContext context)
        {
            _context = context;
        }

       
        // GET: api/Usuario/listar
      
        [HttpGet("listar")]
        public async Task<ActionResult<IEnumerable<UsuarioDTO>>> ListarUsuarios()
        {
            var usuarios = await _context.Usuarios
                .Where(u => u.Activo == true || u.Activo == null)
                .Select(u => UsuarioMapper.ToDTO(u))
                .ToListAsync();

            return usuarios;
        }

      
        // GET: api/Usuario/obtener/5
       
        [HttpGet("obtener/{id}")]
        public async Task<ActionResult<UsuarioDTO>> ObtenerUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
                return NotFound();

            return UsuarioMapper.ToDTO(usuario);
        }

      
        // POST: api/Usuario/crear
    
        [HttpPost("crear")]
        public async Task<IActionResult> CrearUsuario(CrearUsuarioDTO dto)
        {
            var usuario = new Usuario
            {
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Correo = dto.Correo,
                ContraseñaHash = dto.ContraseñaHash,
                Rol = dto.Rol,
                UsuarioCreador = dto.UsuarioCreador,
                FechaCreacion = DateTime.Now,
                Activo = true
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(UsuarioMapper.ToDTO(usuario));
        }

   
        // PUT: api/Usuario/actualizar/5
       
        [HttpPut("actualizar/{id}")]
        public async Task<IActionResult> ActualizarUsuario(int id, EditarUsuarioDTO dto)
        {
            if (id != dto.IdUsuario)
                return BadRequest("El ID no coincide.");

            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
                return NotFound();

            usuario.Nombre = dto.Nombre;
            usuario.Apellido = dto.Apellido;
            usuario.Correo = dto.Correo;
            usuario.Rol = dto.Rol;
            usuario.UsuarioModificador = dto.UsuarioModificador;
            usuario.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }

   
        // DELETE LÓGICO
        
        [HttpDelete("borrar/{id}")]
        public async Task<IActionResult> BorrarUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
                return NotFound();

            usuario.Activo = false;
            usuario.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
