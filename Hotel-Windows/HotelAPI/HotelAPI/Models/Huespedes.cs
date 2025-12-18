using System;
using System.Collections.Generic;

namespace HotelAPI.Models
{
   
    public partial class Huespedes
    {
        public int IdHuesped { get; set; }

        public string Nombre { get; set; } = null!;

        public string Apellido { get; set; } = null!;

        public string? Telefono { get; set; }

        public string? Correo { get; set; }

        public string? Identificacion { get; set; }

        public DateTime? FechaCreacion { get; set; }

        public DateTime? FechaModificacion { get; set; }

        public int? UsuarioCreador { get; set; }

        public int? UsuarioModificador { get; set; }

        public bool? Activo { get; set; }

        public virtual ICollection<Reserva> Reservas { get; set; } = new List<Reserva>();

    }


    public class HuespedesDTO
    {
        public int IdHuesped { get; set; }
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string? Telefono { get; set; }
        public string? Correo { get; set; }
        public string? Identificacion { get; set; }
    }

 
    public class CrearHuespedesDTO
    {
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string? Telefono { get; set; }
        public string? Correo { get; set; }
        public string? Identificacion { get; set; }
        public int? UsuarioCreador { get; set; }
    }


    public class EditarHuespedesDTO
    {
        public int IdHuesped { get; set; }
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string? Telefono { get; set; }
        public string? Correo { get; set; }
        public string? Identificacion { get; set; }
        public int? UsuarioModificador { get; set; }
    }


    public static class HuespedesMapper
    {
        public static HuespedesDTO ToDTO(Huespedes h)
        {
            return new HuespedesDTO
            {
                IdHuesped = h.IdHuesped,
                Nombre = h.Nombre,
                Apellido = h.Apellido,
                Telefono = h.Telefono,
                Correo = h.Correo,
                Identificacion = h.Identificacion
            };
        }
    }
}
