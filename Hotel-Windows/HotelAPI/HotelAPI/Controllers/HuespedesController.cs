using HotelAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HuespedesController : ControllerBase
    {
        private readonly HotelApiContext _context;

        public HuespedesController(HotelApiContext context)
        {
            _context = context;
        }

        // api/Huespedes/listar
        [HttpGet("listar")]
        public async Task<ActionResult<IEnumerable<HuespedesDTO>>> ListarHuespedes()
        {
            var huespedes = await _context.Huespedes
                .Where(h => h.Activo == true || h.Activo == null)
                .Select(h => HuespedesMapper.ToDTO(h))
                .ToListAsync();

            return Ok(huespedes);
        }

        // api/Huespedes/obtener/5
        [HttpGet("obtener/{id}")]
        public async Task<ActionResult<HuespedesDTO>> ObtenerHuesped(int id)
        {
            var huesped = await _context.Huespedes.FindAsync(id);

            if (huesped == null || huesped.Activo == false)
                return NotFound("Huésped no encontrado.");

            return Ok(HuespedesMapper.ToDTO(huesped));
        }

        // api/Huespedes/crear
        [HttpPost("crear")]
        public async Task<ActionResult> CrearHuesped(CrearHuespedesDTO dto)
        {
            var huesped = new Huespedes
            {
                Nombre = dto.Nombre,
                Apellido = dto.Apellido,
                Telefono = dto.Telefono,
                Correo = dto.Correo,
                Identificacion = dto.Identificacion,
                FechaCreacion = DateTime.Now,
                UsuarioCreador = dto.UsuarioCreador,
                Activo = true
            };

            _context.Huespedes.Add(huesped);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Huésped creado correctamente",
                id = huesped.IdHuesped
            });
        }

        // ✅ PUT: api/Huespedes/editar/5
        [HttpPut("editar/{id}")]
        public async Task<ActionResult> EditarHuesped(int id, EditarHuespedesDTO dto)
        {
            if (id != dto.IdHuesped)
                return BadRequest("El ID no coincide.");

            var huesped = await _context.Huespedes.FindAsync(id);

            if (huesped == null || huesped.Activo == false)
                return NotFound("Huésped no encontrado.");

            huesped.Nombre = dto.Nombre;
            huesped.Apellido = dto.Apellido;
            huesped.Telefono = dto.Telefono;
            huesped.Correo = dto.Correo;
            huesped.Identificacion = dto.Identificacion;
            huesped.UsuarioModificador = dto.UsuarioModificador;
            huesped.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Huésped actualizado correctamente"
            });
        }

        // ✅ DELETE: api/Huespedes/eliminar/5  (BAJA LÓGICA)
        [HttpDelete("eliminar/{id}")]
        public async Task<ActionResult> EliminarHuesped(int id)
        {
            var huesped = await _context.Huespedes.FindAsync(id);

            if (huesped == null || huesped.Activo == false)
                return NotFound("Huésped no existe.");

            huesped.Activo = false;
            huesped.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Huésped dado de baja correctamente"
            });
        }
    }
}
