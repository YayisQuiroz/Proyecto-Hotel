using System;
using System.Collections.Generic;

namespace HotelAPI.Models
{
    public partial class Reserva
    {
        public int IdReserva { get; set; }
        public int IdHuesped { get; set; }
        public int IdHabitacion { get; set; }
        public DateOnly FechaEntrada { get; set; }
        public DateOnly FechaSalida { get; set; }
        public string Estado { get; set; } = null!;
        public decimal? TotalEstimado { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public int? UsuarioCreador { get; set; }
        public int? UsuarioModificador { get; set; }
        public bool? Activo { get; set; }

        // ✅ SIN [ForeignKey] - deja que la configuración fluida se encargue
        public virtual Habitacione IdHabitacionNavigation { get; set; } = null!;
        public virtual Huespedes IdHuespedNavigation { get; set; } = null!;
        public virtual ICollection<Checkin> Checkins { get; set; } = new List<Checkin>();
        public virtual ICollection<Checkout> Checkouts { get; set; } = new List<Checkout>();
        public virtual ICollection<Pago> Pagos { get; set; } = new List<Pago>();
    }

    public class ReservaDTO
    {
        public int IdReserva { get; set; }
        public int IdHuesped { get; set; }
        public string? NombreHuesped { get; set; }  // ✅ Nullable
        public int IdHabitacion { get; set; }
        public string? NumeroHabitacion { get; set; }  // ✅ Nullable
        public DateOnly FechaEntrada { get; set; }
        public DateOnly FechaSalida { get; set; }
        public string Estado { get; set; } = null!;
        public decimal? TotalEstimado { get; set; }
    }

    public class CrearReservaDTO
    {
        public int IdHuesped { get; set; }
        public int IdHabitacion { get; set; }
        public DateOnly FechaEntrada { get; set; }
        public DateOnly FechaSalida { get; set; }
        public string Estado { get; set; } = null!;
        public decimal? TotalEstimado { get; set; }
        public int? UsuarioCreador { get; set; }
    }

    public class EditarReservaDTO
    {
        public int IdReserva { get; set; }
        public int IdHuesped { get; set; }
        public int IdHabitacion { get; set; }
        public DateOnly FechaEntrada { get; set; }
        public DateOnly FechaSalida { get; set; }
        public string Estado { get; set; } = null!;
        public decimal? TotalEstimado { get; set; }
        public int? UsuarioModificador { get; set; }
    }

    public static class ReservaMapper
    {
        public static ReservaDTO ToDTO(Reserva r)
        {
            return new ReservaDTO
            {
                IdReserva = r.IdReserva,
                IdHuesped = r.IdHuesped,
                NombreHuesped = r.IdHuespedNavigation != null
                    ? $"{r.IdHuespedNavigation.Nombre} {r.IdHuespedNavigation.Apellido}"
                    : null,
                IdHabitacion = r.IdHabitacion,
                NumeroHabitacion = r.IdHabitacionNavigation?.NumeroHabitacion,
                FechaEntrada = r.FechaEntrada,
                FechaSalida = r.FechaSalida,
                Estado = r.Estado,
                TotalEstimado = r.TotalEstimado
            };
        }
    }
}