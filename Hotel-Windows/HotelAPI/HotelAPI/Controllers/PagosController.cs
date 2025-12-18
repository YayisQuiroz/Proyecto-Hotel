using HotelAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PagosController : ControllerBase
    {
        private readonly HotelApiContext _context;

        public PagosController(HotelApiContext context)
        {
            _context = context;
        }

        
        // GET: api/Pagos/listar
       
        [HttpGet("listar")]
        public async Task<ActionResult<IEnumerable<PagoDTO>>> ListarPagos()
        {
            var pagos = await _context.Pagos
                .Where(p => p.Activo == true || p.Activo == null)
                .Select(p => PagoMapper.ToDTO(p))
                .ToListAsync();

            return Ok(pagos);
        }

        
        // GET: api/Pagos/5
       
        [HttpGet("{id}")]
        public async Task<ActionResult<PagoDTO>> ObtenerPago(int id)
        {
            var pago = await _context.Pagos.FindAsync(id);

            if (pago == null)
                return NotFound("Pago no encontrado");

            return Ok(PagoMapper.ToDTO(pago));
        }

       
        // POST: api/Pagos/crear
        
        [HttpPost("crear")]
        public async Task<ActionResult> CrearPago(CrearPagoDTO dto)
        {
            var pago = new Pago
            {
                IdReserva = dto.IdReserva,
                FechaPago = DateTime.Now,
                Monto = dto.Monto,
                MetodoPago = dto.MetodoPago,
                Referencia = dto.Referencia,
                EmpleadoRegistro = dto.EmpleadoRegistro,
                FechaCreacion = DateTime.Now,
                UsuarioCreador = dto.UsuarioCreador,
                Activo = true
            };

            _context.Pagos.Add(pago);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensaje = "Pago registrado correctamente",
                pagoId = pago.IdPago
            });
        }

      
        // PUT: api/Pagos/editar/5
       
        [HttpPut("editar/{id}")]
        public async Task<IActionResult> EditarPago(int id, EditarPagoDTO dto)
        {
            if (id != dto.IdPago)
                return BadRequest("El ID no coincide");

            var pago = await _context.Pagos.FindAsync(id);

            if (pago == null)
                return NotFound("Pago no encontrado");

            pago.Monto = dto.Monto;
            pago.MetodoPago = dto.MetodoPago;
            pago.Referencia = dto.Referencia;
            pago.EmpleadoRegistro = dto.EmpleadoRegistro;
            pago.FechaModificacion = DateTime.Now;
            pago.UsuarioModificador = dto.UsuarioModificador;

            await _context.SaveChangesAsync();

            return Ok("Pago actualizado correctamente");
        }

        // DELETE (BAJA LÓGICA)
       
        [HttpDelete("borrar/{id}")]
        public async Task<IActionResult> BorrarPago(int id)
        {
            var pago = await _context.Pagos.FindAsync(id);

            if (pago == null)
                return NotFound("Pago no encontrado");

            pago.Activo = false;
            pago.FechaModificacion = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok("Pago eliminado correctamente");
        }
    }
}
