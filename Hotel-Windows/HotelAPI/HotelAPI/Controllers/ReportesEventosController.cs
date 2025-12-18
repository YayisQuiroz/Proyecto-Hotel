using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace HotelAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReporteEventosController : ControllerBase
    {
        private readonly string _connectionString;

        public ReporteEventosController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet]
        public IActionResult GetReporte([FromQuery] DateTime? fecha_inicio, [FromQuery] DateTime? fecha_fin)
        {
            var reporte = new List<object>();

            try
            {
                using (var conn = new SqlConnection(_connectionString))
                {
                    conn.Open();

                    // Consulta básica con filtros dinámicos
                    var query = @"
                        SELECT *
                        FROM OPENQUERY(Postgres_Linux, 'SELECT * FROM dbo.eventos WHERE 1=1
                        {0} {1}');
                    ";

                    string filtroInicio = fecha_inicio.HasValue ? $"AND fecha_inicio >= ''{fecha_inicio.Value:yyyy-MM-dd}''" : "";
                    string filtroFin = fecha_fin.HasValue ? $"AND fecha_inicio <= ''{fecha_fin.Value:yyyy-MM-dd}''" : "";

                    string finalQuery = string.Format(query, filtroInicio, filtroFin);

                    using (var cmd = new SqlCommand(finalQuery, conn))
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            reporte.Add(new
                            {
                                IdEvento = reader["id_evento"],
                                Titulo = reader["titulo"],
                                Descripcion = reader["descripcion"],
                                FechaInicio = reader["fecha_inicio"],
                                FechaFin = reader["fecha_fin"],
                                IdSalon = reader["id_salon"],
                                UsuarioResponsable = reader["usuario_responsable"]
                            });
                        }
                    }
                }

                return Ok(reporte);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
