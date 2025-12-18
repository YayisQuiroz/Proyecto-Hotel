using HotelAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CheckoutsController : ControllerBase
    {
        private readonly HotelApiContext _context;

        public CheckoutsController(HotelApiContext context)
        {
            _context = context;
        }

        [HttpGet("listar")]
        public async Task<ActionResult<IEnumerable<CheckoutDTO>>> ListarCheckouts()
        {
            try
            {
                var checkouts = await _context.Checkouts
                    .AsNoTracking()
                    .Where(c => c.Activo == true || c.Activo == null)
                    .Select(c => new CheckoutDTO
                    {
                        IdCheckout = c.IdCheckout,
                        IdReserva = c.IdReserva,
                        FechaCheckout = c.FechaCheckout,
                        EmpleadoRegistro = c.EmpleadoRegistro,
                        TotalFinal = c.TotalFinal,
                        Notas = c.Notas,
                        Activo = c.Activo
                    })
                    .ToListAsync();

                return Ok(checkouts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al listar checkouts", detalle = ex.Message });
            }
        }


        // GET: api/Checkouts/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<CheckoutDTO>> ObtenerCheckout(int id)
        {
            try
            {
                var checkout = await _context.Checkouts
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.IdCheckout == id && (c.Activo == true || c.Activo == null));

                if (checkout == null)
                    return NotFound(new { mensaje = "Checkout no encontrado" });

                return Ok(CheckoutMapper.ToDTO(checkout));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al obtener checkout", detalle = ex.Message });
            }
        }

        // POST: api/Checkouts/crear
        [HttpPost("crear")]
        public async Task<ActionResult> CrearCheckout(CrearCheckoutDTO dto)
        {
            try
            {
                // ✅ Ahora esto funcionará sin errores
                var reserva = await _context.Reservas
                    .Where(r => r.IdReserva == dto.IdReserva && (r.Activo == true || r.Activo == null))
                    .Select(r => new { r.IdReserva, r.IdHabitacion })
                    .FirstOrDefaultAsync();

                if (reserva == null)
                    return NotFound(new { mensaje = "Reserva no encontrada o inactiva." });

                var checkout = new Checkout
                {
                    IdReserva = dto.IdReserva,
                    FechaCheckout = DateTime.Now,
                    EmpleadoRegistro = dto.EmpleadoRegistro,
                    TotalFinal = dto.TotalFinal,
                    Notas = dto.Notas,
                    FechaCreacion = DateTime.Now,
                    UsuarioCreador = dto.UsuarioCreador,
                    Activo = true
                };

                _context.Checkouts.Add(checkout);

                // 🔹 Liberar la habitación
                var habitacion = await _context.Habitaciones
                    .FirstOrDefaultAsync(h => h.IdHabitacion == reserva.IdHabitacion);

                if (habitacion != null)
                {
                    habitacion.Estado = "disponible";
                    habitacion.FechaModificacion = DateTime.Now;
                }

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    mensaje = "Checkout registrado correctamente y habitación liberada ✅",
                    checkoutId = checkout.IdCheckout
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al crear checkout", detalle = ex.Message });
            }
        }

        // PUT: api/Checkouts/editar/{id}
        [HttpPut("editar/{id}")]
        public async Task<IActionResult> EditarCheckout(int id, EditarCheckoutDTO dto)
        {
            try
            {
                if (id != dto.IdCheckout)
                    return BadRequest(new { mensaje = "El ID no coincide" });

                var checkout = await _context.Checkouts
                    .FirstOrDefaultAsync(c => c.IdCheckout == id && (c.Activo == true || c.Activo == null));

                if (checkout == null)
                    return NotFound(new { mensaje = "Checkout no encontrado" });

                checkout.FechaCheckout = dto.FechaCheckout;
                checkout.EmpleadoRegistro = dto.EmpleadoRegistro;
                checkout.TotalFinal = dto.TotalFinal;
                checkout.Notas = dto.Notas;
                checkout.FechaModificacion = DateTime.Now;
                checkout.UsuarioModificador = dto.UsuarioModificador;

                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Checkout actualizado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al editar checkout", detalle = ex.Message });
            }
        }

        // DELETE: api/Checkouts/borrar/5
        [HttpDelete("borrar/{id}")]
        public async Task<IActionResult> BorrarCheckout(int id)
        {
            try
            {
                var checkout = await _context.Checkouts
                    .FirstOrDefaultAsync(c => c.IdCheckout == id && (c.Activo == true || c.Activo == null));

                if (checkout == null)
                    return NotFound(new { mensaje = "Checkout no encontrado" });

                checkout.Activo = false;
                checkout.FechaModificacion = DateTime.Now;

                await _context.SaveChangesAsync();

                return Ok(new { mensaje = "Checkout eliminado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = "Error al eliminar checkout", detalle = ex.Message });
            }
        }
    }
}
