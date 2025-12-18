using System;
using System.Collections.Generic;

namespace HotelAPI.Models
{
    
    public partial class Usuario
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Correo { get; set; } = null!;
        public string ContraseñaHash { get; set; } = null!;
        public string Rol { get; set; } = null!;
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaModificacion { get; set; }
        public int? UsuarioCreador { get; set; }
        public int? UsuarioModificador { get; set; }
        public bool? Activo { get; set; }

        public virtual ICollection<Auditoria> Auditoria { get; set; } = new List<Auditoria>();
        public virtual ICollection<Checkin> Checkins { get; set; } = new List<Checkin>();
        public virtual ICollection<Checkout> Checkouts { get; set; } = new List<Checkout>();
        public virtual ICollection<Pago> Pagos { get; set; } = new List<Pago>();
    }


    public class UsuarioDTO
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Correo { get; set; } = null!;
        public string Rol { get; set; } = null!;
        public bool? Activo { get; set; }
    }


    public class CrearUsuarioDTO
    {
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Correo { get; set; } = null!;
        public string ContraseñaHash { get; set; } = null!;
        public string Rol { get; set; } = null!;
        public int? UsuarioCreador { get; set; }
    }


    public class EditarUsuarioDTO
    {
        public int IdUsuario { get; set; }
        public string Nombre { get; set; } = null!;
        public string Apellido { get; set; } = null!;
        public string Correo { get; set; } = null!;
        public string Rol { get; set; } = null!;
        public int? UsuarioModificador { get; set; }
    }


    public static class UsuarioMapper
    {
        public static UsuarioDTO ToDTO(Usuario u)
        {
            return new UsuarioDTO
            {
                IdUsuario = u.IdUsuario,
                Nombre = u.Nombre,
                Apellido = u.Apellido,
                Correo = u.Correo,
                Rol = u.Rol,
                Activo = u.Activo
            };
        }
    }
}
