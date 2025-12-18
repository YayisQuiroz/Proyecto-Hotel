using HotelAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HabitacionesController : ControllerBase
    {
        private readonly HotelApiContext _context;

        public HabitacionesController(HotelApiContext context)
        {
            _context = context;
        }

        
        // GET: api/Habitaciones/listar
      
        [HttpGet("listar")]
        public async Task<ActionResult<IEnumerable<HabitacionDTO>>> ListarHabitaciones()
        {
            var habitaciones = await _context.Habitaciones
                .Where(h => h.Activo == true || h.Activo == null)
                .ToListAsync();

            return habitaciones.Select(HabitacionMapper.ToDTO).ToList();
        }

      
        // GET: api/Habitaciones/obtener/5
        
        [HttpGet("obtener/{id}")]
        public async Task<ActionResult<HabitacionDTO>> ObtenerHabitacion(int id)
        {
            var habitacion = await _context.Habitaciones.FindAsync(id);

            if (habitacion == null || habitacion.Activo == false)
                return NotFound("Habitación no encontrada.");

            return HabitacionMapper.ToDTO(habitacion);
        }

      
        // POST: api/Habitaciones/crear
        
        [HttpPost("crear")]
        public async Task<ActionResult> CrearHabitacion(CrearHabitacionDTO dto)
        {
            var habitacion = new Habitacione
            {
                NumeroHabitacion = dto.NumeroHabitacion,
                Tipo = dto.Tipo,
                PrecioNoche = dto.PrecioNoche,
                Estado = dto.Estado,
                Descripcion = dto.Descripcion,
                UsuarioCreador = dto.UsuarioCreador,
                FechaCreacion = DateTime.Now,
                Activo = true
            };

            _context.Habitaciones.Add(habitacion);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Habitación creada correctamente",
                id = habitacion.IdHabitacion
            });
        }

       
        // PUT: api/Habitaciones/editar/5
       
        [HttpPut("editar/{id}")]
        public async Task<ActionResult> EditarHabitacion(int id, EditarHabitacionDTO dto)
        {
            if (id != dto.IdHabitacion)
                return BadRequest("El ID no coincide.");

            var habitacion = await _context.Habitaciones.FindAsync(id);

            if (habitacion == null)
                return NotFound("Habitación no encontrada.");

            habitacion.NumeroHabitacion = dto.NumeroHabitacion;
            habitacion.Tipo = dto.Tipo;
            habitacion.PrecioNoche = dto.PrecioNoche;
            habitacion.Estado = dto.Estado;
            habitacion.Descripcion = dto.Descripcion;
            habitacion.UsuarioModificador = dto.UsuarioModificador;
            habitacion.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok("Habitación actualizada correctamente.");
        }

        // DELETE: api/Habitaciones/eliminar/5
        [HttpDelete("eliminar/{id}")]
        public async Task<ActionResult> EliminarHabitacion(int id)
        {
            var habitacion = await _context.Habitaciones.FindAsync(id);

            if (habitacion == null)
                return NotFound("Habitación no encontrada.");

            habitacion.Activo = false;

            habitacion.UsuarioModificador = 1; 

            habitacion.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok("Habitación eliminada correctamente.");
        }

    }
}
