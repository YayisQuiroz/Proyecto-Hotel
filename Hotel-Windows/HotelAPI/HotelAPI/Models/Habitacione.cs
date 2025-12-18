using System;
using System.Collections.Generic;

namespace HotelAPI.Models
{

    public partial class Habitacione
    {
        public int IdHabitacion { get; set; }

        public string NumeroHabitacion { get; set; } = null!;

        public string Tipo { get; set; } = null!;

        public decimal PrecioNoche { get; set; }

        public string Estado { get; set; } = null!;

        public string? Descripcion { get; set; }

        public DateTime? FechaCreacion { get; set; }

        public DateTime? FechaModificacion { get; set; }

        public int? UsuarioCreador { get; set; }

        public int? UsuarioModificador { get; set; }

        public bool? Activo { get; set; }

        public virtual ICollection<Reserva> Reservas { get; set; } = new List<Reserva>();
    }


    public class HabitacionDTO
    {
        public int IdHabitacion { get; set; }
        public string NumeroHabitacion { get; set; } = null!;
        public string Tipo { get; set; } = null!;
        public decimal PrecioNoche { get; set; }
        public string Estado { get; set; } = null!;
        public string? Descripcion { get; set; }
    }


    public class CrearHabitacionDTO
    {
        public string NumeroHabitacion { get; set; } = null!;
        public string Tipo { get; set; } = null!;
        public decimal PrecioNoche { get; set; }
        public string Estado { get; set; } = null!;
        public string? Descripcion { get; set; }
        public int? UsuarioCreador { get; set; }
    }

    public class EditarHabitacionDTO
    {
        public int IdHabitacion { get; set; }
        public string NumeroHabitacion { get; set; } = null!;
        public string Tipo { get; set; } = null!;
        public decimal PrecioNoche { get; set; }
        public string Estado { get; set; } = null!;
        public string? Descripcion { get; set; }
        public int? UsuarioModificador { get; set; }
        public virtual ICollection<Reserva> Reservas { get; set; } = new List<Reserva>();

    }


    public static class HabitacionMapper
    {
        public static HabitacionDTO ToDTO(Habitacione h)
        {
            return new HabitacionDTO
            {
                IdHabitacion = h.IdHabitacion,
                NumeroHabitacion = h.NumeroHabitacion,
                Tipo = h.Tipo,
                PrecioNoche = h.PrecioNoche,
                Estado = h.Estado,
                Descripcion = h.Descripcion
            };
        }
    }
}
