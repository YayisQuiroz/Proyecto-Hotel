using System;

namespace HotelAPI.Models;

public partial class Auditoria
{
    public int IdAuditoria { get; set; }

    public int Usuario { get; set; }

    public string TablaAfectada { get; set; } = null!;

    public int IdRegistroAfectado { get; set; }

    public string Accion { get; set; } = null!;

    public DateTime? Fecha { get; set; }

    public string? DescripcionCambio { get; set; }

    public virtual Usuario UsuarioNavigation { get; set; } = null!;
}

// DTO dentro del mismo archivo
public class AuditoriaDTO
{
    public int IdAuditoria { get; set; }

    public int Usuario { get; set; }

    public string UsuarioNombre { get; set; } = null!;

    public string TablaAfectada { get; set; } = null!;

    public int IdRegistroAfectado { get; set; }

    public string Accion { get; set; } = null!;

    public DateTime? Fecha { get; set; }

    public string? DescripcionCambio { get; set; }
}
