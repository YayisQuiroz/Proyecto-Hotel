using System;
using System.Collections.Generic;

namespace HotelAPI.Models
{

    public partial class Pago
    {
        public int IdPago { get; set; }

        public int IdReserva { get; set; }

        public DateTime FechaPago { get; set; }

        public decimal Monto { get; set; }

        public string MetodoPago { get; set; } = null!;

        public string? Referencia { get; set; }

        public int EmpleadoRegistro { get; set; }

        public DateTime? FechaCreacion { get; set; }

        public DateTime? FechaModificacion { get; set; }

        public int? UsuarioCreador { get; set; }

        public int? UsuarioModificador { get; set; }

        public bool? Activo { get; set; }

        public virtual Usuario EmpleadoRegistroNavigation { get; set; } = null!;
        public virtual Reserva IdReservaNavigation { get; set; } = null!;
    }


    public class PagoDTO
    {
        public int IdPago { get; set; }
        public int IdReserva { get; set; }
        public DateTime FechaPago { get; set; }
        public decimal Monto { get; set; }
        public string MetodoPago { get; set; } = null!;
        public string? Referencia { get; set; }
        public int EmpleadoRegistro { get; set; }
    }


    public class CrearPagoDTO
    {
        public int IdReserva { get; set; }
        public decimal Monto { get; set; }
        public string MetodoPago { get; set; } = null!;
        public string? Referencia { get; set; }
        public int EmpleadoRegistro { get; set; }
        public int? UsuarioCreador { get; set; }
    }

 
    public class EditarPagoDTO
    {
        public int IdPago { get; set; }
        public decimal Monto { get; set; }
        public string MetodoPago { get; set; } = null!;
        public string? Referencia { get; set; }
        public int EmpleadoRegistro { get; set; }
        public int? UsuarioModificador { get; set; }
    }


    public static class PagoMapper
    {
        public static PagoDTO ToDTO(Pago p)
        {
            return new PagoDTO
            {
                IdPago = p.IdPago,
                IdReserva = p.IdReserva,
                FechaPago = p.FechaPago,
                Monto = p.Monto,
                MetodoPago = p.MetodoPago,
                Referencia = p.Referencia,
                EmpleadoRegistro = p.EmpleadoRegistro
            };
        }
    }
}
