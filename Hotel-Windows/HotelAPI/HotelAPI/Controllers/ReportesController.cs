using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using HotelAPI.Models;

namespace HotelAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Reportees : ControllerBase
    {
        private readonly HotelApiContext _context;

        public Reportees(HotelApiContext context)
        {
            _context = context;
        }

        // =======================================
        // DTOs internos para reportes
        // =======================================
        public class HabitacionReporteDTO
        {
            public string Hotel { get; set; } = null!;
            public int IdHabitacion { get; set; }
            public string NumeroHabitacion { get; set; } = null!;
            public string Tipo { get; set; } = null!;
            public decimal PrecioNoche { get; set; }
            public string Estado { get; set; } = null!;
        }

        public class DisponibilidadDTO
        {
            public string Hotel { get; set; } = null!;
            public int IdHabitacion { get; set; }
            public string NumeroHabitacion { get; set; } = null!;
            public string Estado { get; set; } = null!; // Disponible / Ocupada
        }

        public class ReservaReporteDTO
        {
            public string Hotel { get; set; } = null!;
            public int IdReserva { get; set; }
            public string NumeroHabitacion { get; set; } = null!;
            public DateOnly FechaEntrada { get; set; }
            public DateOnly FechaSalida { get; set; }
            public string Estado { get; set; } = null!;
        }

        public class ReporteHuespedesDTO
        {
            public string Hotel { get; set; } = null!;
            public int IdHuesped { get; set; }
            public string Nombre { get; set; } = null!;
            public string Apellido { get; set; } = null!;
            public string? Telefono { get; set; }
            public string? Correo { get; set; }
            public string? Identificacion { get; set; }
        }

        // =======================================
        // HABITACIONES AMBOS HOTELES
        // =======================================
        [HttpGet("habitaciones")]
        public async Task<ActionResult<IEnumerable<HabitacionReporteDTO>>> Habitaciones()
        {
            // Linux (Linked Server)
            var habitacionesLinux = await _context.Habitaciones
                .FromSqlRaw(@"
                    SELECT id_habitacion, numero_habitacion, tipo, precio_noche, estado
                    FROM Hotel_Linux.HotelAPI_Linux.dbo.Habitaciones
                ")
                .Select(h => new HabitacionReporteDTO
                {
                    Hotel = "Hotel Linux",
                    IdHabitacion = h.IdHabitacion,
                    NumeroHabitacion = h.NumeroHabitacion,
                    Tipo = h.Tipo,
                    PrecioNoche = h.PrecioNoche,
                    Estado = h.Estado
                })
                .ToListAsync();

            // Windows (local DbContext)
            var habitacionesWindows = await _context.Habitaciones
                .Where(h => h.Activo == true)
                .Select(h => new HabitacionReporteDTO
                {
                    Hotel = "Hotel Windows",
                    IdHabitacion = h.IdHabitacion,
                    NumeroHabitacion = h.NumeroHabitacion,
                    Tipo = h.Tipo,
                    PrecioNoche = h.PrecioNoche,
                    Estado = h.Estado
                })
                .ToListAsync();

            habitacionesLinux.AddRange(habitacionesWindows);
            return Ok(habitacionesLinux);
        }

        // =======================================
        // DISPONIBILIDAD AMBOS HOTELES
        // =======================================
        [HttpGet("disponibilidad")]
        public async Task<ActionResult<IEnumerable<DisponibilidadDTO>>> Disponibilidad()
        {
            // Linux (Linked Server) usando LEFT JOIN
            var disponibilidadLinux = await _context.Habitaciones
                .FromSqlRaw(@"
                    SELECT h.id_habitacion, h.numero_habitacion,
                           CASE WHEN r.id_reserva IS NULL THEN 'Disponible' ELSE 'Ocupada' END AS estado
                    FROM Hotel_Linux.HotelAPI_Linux.dbo.Habitaciones h
                    LEFT JOIN Hotel_Linux.HotelAPI_Linux.dbo.Reservas r
                    ON h.id_habitacion = r.id_habitacion AND r.activo = 1
                ")
                .Select(h => new DisponibilidadDTO
                {
                    Hotel = "Hotel Linux",
                    IdHabitacion = h.IdHabitacion,
                    NumeroHabitacion = h.NumeroHabitacion,
                    Estado = h.Estado
                })
                .ToListAsync();

            // Windows (LINQ)
            var disponibilidadWindows = await _context.Habitaciones
                .Where(h => h.Activo == true)
                .Select(h => new DisponibilidadDTO
                {
                    Hotel = "Hotel Windows",
                    IdHabitacion = h.IdHabitacion,
                    NumeroHabitacion = h.NumeroHabitacion,
                    Estado = h.Reservas.Any(r => r.Activo == true) ? "Ocupada" : "Disponible"
                })
                .ToListAsync();

            disponibilidadLinux.AddRange(disponibilidadWindows);
            return Ok(disponibilidadLinux);
        }

        // =======================================
        // RESERVAS AMBOS HOTELES
        // =======================================
        [HttpGet("reservas")]
        public async Task<ActionResult<IEnumerable<ReservaReporteDTO>>> Reservas()
        {
            // Linux (Linked Server)
            var reservasLinux = await _context.Reservas
                .FromSqlRaw(@"
                    SELECT r.id_reserva, r.id_habitacion, h.numero_habitacion, r.fecha_entrada, r.fecha_salida, r.estado
                    FROM Hotel_Linux.HotelAPI_Linux.dbo.Reservas r
                    INNER JOIN Hotel_Linux.HotelAPI_Linux.dbo.Habitaciones h
                    ON r.id_habitacion = h.id_habitacion
                    WHERE r.activo = 1
                ")
                .Select(r => new ReservaReporteDTO
                {
                    Hotel = "Hotel Linux",
                    IdReserva = r.IdReserva,
                    NumeroHabitacion = r.IdHabitacionNavigation.NumeroHabitacion,
                    FechaEntrada = r.FechaEntrada,
                    FechaSalida = r.FechaSalida,
                    Estado = r.Estado
                })
                .ToListAsync();

            // Windows (LINQ)
            var reservasWindows = await _context.Reservas
                .Include(r => r.IdHabitacionNavigation)
                .Where(r => r.Activo == true)
                .Select(r => new ReservaReporteDTO
                {
                    Hotel = "Hotel Windows",
                    IdReserva = r.IdReserva,
                    NumeroHabitacion = r.IdHabitacionNavigation.NumeroHabitacion,
                    FechaEntrada = r.FechaEntrada,
                    FechaSalida = r.FechaSalida,
                    Estado = r.Estado
                })
                .ToListAsync();

            reservasLinux.AddRange(reservasWindows);
            return Ok(reservasLinux);
        }

        // =======================================
        // HUÉSPEDES AMBOS HOTELES
        // =======================================
        [HttpGet("huespedes")]
        public async Task<ActionResult<IEnumerable<ReporteHuespedesDTO>>> Huespedes()
        {
            // Linux (Linked Server)
            var huespedesLinux = await _context.Huespedes
                .FromSqlRaw(@"
                    SELECT id_huesped, nombre, apellido, telefono, correo, identificacion
                    FROM Hotel_Linux.HotelAPI_Linux.dbo.Huespedes
                    WHERE activo = 1
                ")
                .Select(h => new ReporteHuespedesDTO
                {
                    Hotel = "Hotel Linux",
                    IdHuesped = h.IdHuesped,
                    Nombre = h.Nombre,
                    Apellido = h.Apellido,
                    Telefono = h.Telefono,
                    Correo = h.Correo,
                    Identificacion = h.Identificacion
                })
                .ToListAsync();

            // Windows (local DbContext)
            var huespedesWindows = await _context.Huespedes
                .Where(h => h.Activo == true)
                .Select(h => new ReporteHuespedesDTO
                {
                    Hotel = "Hotel Windows",
                    IdHuesped = h.IdHuesped,
                    Nombre = h.Nombre,
                    Apellido = h.Apellido,
                    Telefono = h.Telefono,
                    Correo = h.Correo,
                    Identificacion = h.Identificacion
                })
                .ToListAsync();

            huespedesLinux.AddRange(huespedesWindows);
            return Ok(huespedesLinux);
        }
    }
}
