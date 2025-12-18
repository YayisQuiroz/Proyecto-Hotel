using HotelAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReservasController : ControllerBase
    {
        private readonly HotelApiContext _context;

        public ReservasController(HotelApiContext context)
        {
            _context = context;
        }

        [HttpGet("listar")]
        public async Task<ActionResult<IEnumerable<ReservaDTO>>> ListarReservas()
        {
            var reservas = await _context.Reservas
                .Include(r => r.IdHuespedNavigation) // ⭐ Incluir relación
                .Include(r => r.IdHabitacionNavigation) // ⭐ Incluir habitación también
                .Where(r => r.Activo == true || r.Activo == null)
                .Select(r => new ReservaDTO
                {
                    IdReserva = r.IdReserva,
                    IdHuesped = r.IdHuesped,
                    NombreHuesped = r.IdHuespedNavigation.Nombre + " " + r.IdHuespedNavigation.Apellido,
                    IdHabitacion = r.IdHabitacion,
                    NumeroHabitacion = r.IdHabitacionNavigation.NumeroHabitacion,
                    FechaEntrada = r.FechaEntrada,
                    FechaSalida = r.FechaSalida,
                    Estado = r.Estado,
                    TotalEstimado = r.TotalEstimado
                })
                .ToListAsync();

            return Ok(reservas);
        }

        //api/Reservas/obtener/5
        [HttpGet("obtener/{id}")]
        public async Task<ActionResult<ReservaDTO>> ObtenerReserva(int id)
        {
            var reserva = await _context.Reservas.FindAsync(id);

            if (reserva == null || reserva.Activo == false)
                return NotFound("Reserva no encontrada.");

            return Ok(ReservaMapper.ToDTO(reserva));
        }

        [HttpPost("crear")]
        public async Task<ActionResult> CrearReserva(CrearReservaDTO dto)
        {
            // 1️⃣ Buscar la habitación
            var habitacion = await _context.Habitaciones
                .FirstOrDefaultAsync(h => h.IdHabitacion == dto.IdHabitacion && h.Activo == true);

            if (habitacion == null)
                return NotFound("La habitación no existe.");

            if (habitacion.Estado.ToLower() != "disponible")
                return BadRequest("La habitación no está disponible.");

            // 2️⃣ Crear la reserva
            var reserva = new Reserva
            {
                IdHuesped = dto.IdHuesped,
                IdHabitacion = dto.IdHabitacion,
                FechaEntrada = dto.FechaEntrada,
                FechaSalida = dto.FechaSalida,
                Estado = "Activa",
                TotalEstimado = dto.TotalEstimado,
                FechaCreacion = DateTime.Now,
                UsuarioCreador = dto.UsuarioCreador,
                Activo = true
            };

            _context.Reservas.Add(reserva);

            // 3️⃣ Cambiar estado de la habitación a OCUPADA ✅
            habitacion.Estado = "ocupado";
            habitacion.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Reserva creada y habitación ocupada correctamente",
                id = reserva.IdReserva
            });
        }


        // api/Reservas/editar/5
        [HttpPut("editar/{id}")]
        public async Task<ActionResult> EditarReserva(int id, EditarReservaDTO dto)
        {
            if (id != dto.IdReserva)
                return BadRequest("El ID no coincide.");

            var reserva = await _context.Reservas.FindAsync(id);

            if (reserva == null || reserva.Activo == false)
                return NotFound("Reserva no encontrada.");

            reserva.IdHuesped = dto.IdHuesped;
            reserva.IdHabitacion = dto.IdHabitacion;
            reserva.FechaEntrada = dto.FechaEntrada;
            reserva.FechaSalida = dto.FechaSalida;
            reserva.Estado = dto.Estado;
            reserva.TotalEstimado = dto.TotalEstimado;
            reserva.UsuarioModificador = dto.UsuarioModificador;
            reserva.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Reserva actualizada correctamente"
            });
        }

        //  api/Reservas/eliminar/5  (BAJA LÓGICA)
        [HttpDelete("eliminar/{id}")]
        public async Task<ActionResult> EliminarReserva(int id)
        {
            var reserva = await _context.Reservas.FindAsync(id);

            if (reserva == null || reserva.Activo == false)
                return NotFound("Reserva no encontrada.");

            // 🔹 Baja lógica de la reserva
            reserva.Activo = false;
            reserva.FechaModificacion = DateTime.Now;

            // 🔹 Liberar la habitación
            var habitacion = await _context.Habitaciones.FindAsync(reserva.IdHabitacion);
            if (habitacion != null)
            {
                habitacion.Estado = "disponible";
                habitacion.FechaModificacion = DateTime.Now;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Reserva cancelada y habitación liberada ✅"
            });
        }

    }
}
