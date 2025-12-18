using HotelAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckinsController : ControllerBase
    {
        private readonly HotelApiContext _context;

        public CheckinsController(HotelApiContext context)
        {
            _context = context;
        }


        // GET: api/Checkins/listar
        [HttpGet("listar")]
        public async Task<ActionResult<IEnumerable<CheckinDTO>>> Listar()
        {
            try
            {
                var lista = await _context.Checkins
                    .AsNoTracking()
                    .Where(c => c.Activo == true || c.Activo == null)
                    .ToListAsync();

                return Ok(lista.Select(CheckinMapper.ToDTO).ToList());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al listar check-ins", detalle = ex.Message });
            }
        }


        // GET: api/Checkins/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CheckinDTO>> Obtener(int id)
        {
            try
            {
                var checkin = await _context.Checkins
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.IdCheckin == id);

                if (checkin == null || checkin.Activo == false)
                    return NotFound(new { mensaje = "Check-in no encontrado." });

                return Ok(CheckinMapper.ToDTO(checkin));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al obtener check-in", detalle = ex.Message });
            }
        }


        // POST: api/Checkins/crear
        [HttpPost("crear")]
        public async Task<ActionResult> Crear(CrearCheckinDTO dto)
        {
            try
            {
                // ✅ Validar que la reserva existe y está activa (SIN Include para evitar el error)
                var reserva = await _context.Reservas
                    .AsNoTracking()
                    .Where(r => r.IdReserva == dto.IdReserva && (r.Activo == true || r.Activo == null))
                    .Select(r => new { r.IdReserva }) // Solo seleccionar el ID
                    .FirstOrDefaultAsync();

                if (reserva == null)
                    return NotFound(new { mensaje = "Reserva no encontrada o inactiva." });

                // ✅ Validar que no tenga ya un check-in
                var checkinExistente = await _context.Checkins
                    .AsNoTracking()
                    .AnyAsync(c => c.IdReserva == dto.IdReserva && (c.Activo == true || c.Activo == null));

                if (checkinExistente)
                    return BadRequest(new { mensaje = "Esta reserva ya tiene un check-in registrado." });

                var checkin = new Checkin
                {
                    IdReserva = dto.IdReserva,
                    FechaCheckin = DateTime.Now,//dto.FechaCheckin,
                    EmpleadoRegistro = dto.EmpleadoRegistro,
                    Notas = dto.Notas,
                    FechaCreacion = DateTime.Now,
                    UsuarioCreador = dto.UsuarioCreador,
                    Activo = true
                };

                _context.Checkins.Add(checkin);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    mensaje = "Check-in registrado correctamente",
                    id = checkin.IdCheckin
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al crear check-in", detalle = ex.Message });
            }
        }


        // PUT: api/Checkins/editar
        [HttpPut("editar")]
        public async Task<IActionResult> Editar(EditarCheckinDTO dto)
        {
            try
            {
                var checkin = await _context.Checkins
                    .FirstOrDefaultAsync(c => c.IdCheckin == dto.IdCheckin);

                if (checkin == null || checkin.Activo == false)
                    return NotFound(new { mensaje = "Check-in no encontrado." });

                checkin.FechaCheckin = DateTime.Now;//dto.FechaCheckin;
                checkin.EmpleadoRegistro = dto.EmpleadoRegistro;
                checkin.Notas = dto.Notas;
                checkin.FechaModificacion = DateTime.Now;
                checkin.UsuarioModificador = dto.UsuarioModificador;

                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Check-in actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al editar check-in", detalle = ex.Message });
            }
        }


        // DELETE: api/Checkins/eliminar/5
        [HttpDelete("eliminar/{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            try
            {
                var checkin = await _context.Checkins
                    .FirstOrDefaultAsync(c => c.IdCheckin == id);

                if (checkin == null || checkin.Activo == false)
                    return NotFound(new { mensaje = "Check-in no encontrado." });

                checkin.Activo = false;
                checkin.FechaModificacion = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Check-in eliminado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al eliminar check-in", detalle = ex.Message });
            }
        }
    }
}