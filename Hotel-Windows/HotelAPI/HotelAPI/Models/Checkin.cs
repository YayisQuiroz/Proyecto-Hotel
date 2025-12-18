using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelAPI.Models
{
    public partial class Checkin
    {
        public int IdCheckin { get; set; }
        public int IdReserva { get; set; }
        public DateTime FechaCheckin { get; set; }
        public int EmpleadoRegistro { get; set; }
        public string? Notas { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public int? UsuarioCreador { get; set; }
        public int? UsuarioModificador { get; set; }
        public bool? Activo { get; set; }

        [ForeignKey("EmpleadoRegistro")]
        public virtual Usuario EmpleadoRegistroNavigation { get; set; } = null!;

        [ForeignKey("IdReserva")]
        public virtual Reserva IdReservaNavigation { get; set; } = null!;
    }

    public class CheckinDTO
    {
        public int IdCheckin { get; set; }
        public int IdReserva { get; set; }
        public DateTime FechaCheckin { get; set; }
        public int EmpleadoRegistro { get; set; }
        public string? Notas { get; set; }
    }

    public class CrearCheckinDTO
    {
        public int IdReserva { get; set; }
        public DateTime FechaCheckin { get; set; }
        public int EmpleadoRegistro { get; set; }
        public string? Notas { get; set; }
        public int? UsuarioCreador { get; set; }
    }

    public class EditarCheckinDTO
    {
        public int IdCheckin { get; set; }
        public DateTime FechaCheckin { get; set; }
        public int EmpleadoRegistro { get; set; }
        public string? Notas { get; set; }
        public int? UsuarioModificador { get; set; }
    }

    public static class CheckinMapper
    {
        public static CheckinDTO ToDTO(Checkin c)
        {
            return new CheckinDTO
            {
                IdCheckin = c.IdCheckin,
                IdReserva = c.IdReserva,
                FechaCheckin = c.FechaCheckin,
                EmpleadoRegistro = c.EmpleadoRegistro,
                Notas = c.Notas
            };
        }
    }
}