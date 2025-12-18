using System;
using System.Collections.Generic;

namespace HotelAPI.Models
{
    public partial class Checkout
    {
        public int IdCheckout { get; set; }
        public int IdReserva { get; set; }
        public DateTime FechaCheckout { get; set; }
        public int EmpleadoRegistro { get; set; }
        public decimal? TotalFinal { get; set; }
        public string? Notas { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public int? UsuarioCreador { get; set; }
        public int? UsuarioModificador { get; set; }
        public bool? Activo { get; set; }

        public virtual Usuario EmpleadoRegistroNavigation { get; set; } = null!;
        public virtual Reserva IdReservaNavigation { get; set; } = null!;
    }

    // DTO para listar/obtener checkouts
    public class CheckoutDTO
    {
        public int IdCheckout { get; set; }
        public int IdReserva { get; set; }
        public DateTime FechaCheckout { get; set; }
        public int EmpleadoRegistro { get; set; }
        public decimal? TotalFinal { get; set; }
        public string? Notas { get; set; }
        public bool? Activo { get; set; }
    }

    // DTO para crear un checkout
    public class CrearCheckoutDTO
    {
        public int IdReserva { get; set; }
        public int EmpleadoRegistro { get; set; }
        public decimal? TotalFinal { get; set; }
        public string? Notas { get; set; }
        public int UsuarioCreador { get; set; }
    }

    // DTO para editar un checkout
    public class EditarCheckoutDTO
    {
        public int IdCheckout { get; set; }
        public DateTime FechaCheckout { get; set; }
        public int EmpleadoRegistro { get; set; }
        public decimal? TotalFinal { get; set; }
        public string? Notas { get; set; }
        public int? UsuarioModificador { get; set; }
    }

    // Mapper
    public static class CheckoutMapper
    {
        public static CheckoutDTO ToDTO(Checkout c)
        {
            return new CheckoutDTO
            {
                IdCheckout = c.IdCheckout,
                IdReserva = c.IdReserva,
                FechaCheckout = c.FechaCheckout,
                EmpleadoRegistro = c.EmpleadoRegistro,
                TotalFinal = c.TotalFinal,
                Notas = c.Notas,
                Activo = c.Activo
            };
        }
    }
}
