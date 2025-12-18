using HotelAPI.Controllers;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace HotelAPI.Models
{
    public partial class HotelApiContext : DbContext
    {
        public HotelApiContext()
        {
        }

        public HotelApiContext(DbContextOptions<HotelApiContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Checkin> Checkins { get; set; }
        public virtual DbSet<Checkout> Checkouts { get; set; }
        public virtual DbSet<Habitacione> Habitaciones { get; set; }
        public virtual DbSet<Huespedes> Huespedes { get; set; }
        public virtual DbSet<Pago> Pagos { get; set; }
        public virtual DbSet<Reserva> Reservas { get; set; }
        public virtual DbSet<Usuario> Usuarios { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Auditoria>(entity =>
            {
                entity.HasKey(e => e.IdAuditoria);
                entity.Property(e => e.IdAuditoria).HasColumnName("id_auditoria");
                entity.Property(e => e.Usuario).HasColumnName("usuario");
                entity.Property(e => e.TablaAfectada).HasMaxLength(100).HasColumnName("tabla_afectada");
                entity.Property(e => e.IdRegistroAfectado).HasColumnName("id_registro_afectado");
                entity.Property(e => e.Accion).HasMaxLength(20).HasColumnName("accion");
                entity.Property(e => e.Fecha).HasColumnType("datetime").HasColumnName("fecha");
                entity.Property(e => e.DescripcionCambio).HasColumnName("descripcion_cambio");
            });

            // =========================
            // USUARIOS
            // =========================
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.IdUsuario);
                entity.HasIndex(e => e.Correo).IsUnique();

                entity.Property(e => e.IdUsuario).HasColumnName("id_usuario");
                entity.Property(e => e.Nombre).HasMaxLength(100).HasColumnName("nombre");
                entity.Property(e => e.Apellido).HasMaxLength(100).HasColumnName("apellido");
                entity.Property(e => e.Correo).HasMaxLength(150).HasColumnName("correo");
                entity.Property(e => e.ContraseñaHash).HasMaxLength(300).HasColumnName("contraseña_hash");
                entity.Property(e => e.Rol).HasMaxLength(50).HasColumnName("rol");
                entity.Property(e => e.FechaCreacion).HasColumnType("datetime").HasColumnName("fechaCreacion");
                entity.Property(e => e.FechaModificacion).HasColumnType("datetime").HasColumnName("fechaModificacion");
                entity.Property(e => e.UsuarioCreador).HasColumnName("usuarioCreador");
                entity.Property(e => e.UsuarioModificador).HasColumnName("usuarioModificador");
                entity.Property(e => e.Activo).HasDefaultValue(true).HasColumnName("activo");
            });

            // =========================
            // HUESPEDES
            // =========================
            modelBuilder.Entity<Huespedes>(entity =>
            {
                entity.HasKey(e => e.IdHuesped);

                entity.Property(e => e.IdHuesped).HasColumnName("id_huesped");
                entity.Property(e => e.Nombre).HasMaxLength(100).HasColumnName("nombre");
                entity.Property(e => e.Apellido).HasMaxLength(100).HasColumnName("apellido");
                entity.Property(e => e.Telefono).HasMaxLength(20).HasColumnName("telefono");
                entity.Property(e => e.Correo).HasMaxLength(150).HasColumnName("correo");
                entity.Property(e => e.Identificacion).HasMaxLength(80).HasColumnName("identificacion");
                entity.Property(e => e.FechaCreacion).HasColumnType("datetime").HasColumnName("fechaCreacion");
                entity.Property(e => e.FechaModificacion).HasColumnType("datetime").HasColumnName("fechaModificacion");
                entity.Property(e => e.UsuarioCreador).HasColumnName("usuarioCreador");
                entity.Property(e => e.UsuarioModificador).HasColumnName("usuarioModificador");
                entity.Property(e => e.Activo).HasDefaultValue(true).HasColumnName("activo");
            });

            // =========================
            // HABITACIONES
            // =========================
            modelBuilder.Entity<Habitacione>(entity =>
            {
                entity.HasKey(e => e.IdHabitacion);
                entity.HasIndex(e => e.NumeroHabitacion).IsUnique();

                entity.Property(e => e.IdHabitacion).HasColumnName("id_habitacion");
                entity.Property(e => e.NumeroHabitacion).HasMaxLength(20).HasColumnName("numero_habitacion");
                entity.Property(e => e.Tipo).HasMaxLength(50).HasColumnName("tipo");
                entity.Property(e => e.PrecioNoche).HasColumnType("decimal(10,2)").HasColumnName("precio_noche");
                entity.Property(e => e.Estado).HasMaxLength(50).HasColumnName("estado");
                entity.Property(e => e.Descripcion).HasColumnName("descripcion");
                entity.Property(e => e.FechaCreacion).HasColumnType("datetime").HasColumnName("fechaCreacion");
                entity.Property(e => e.FechaModificacion).HasColumnType("datetime").HasColumnName("fechaModificacion");
                entity.Property(e => e.UsuarioCreador).HasColumnName("usuarioCreador");
                entity.Property(e => e.UsuarioModificador).HasColumnName("usuarioModificador");
                entity.Property(e => e.Activo).HasDefaultValue(true).HasColumnName("activo");

            });

            // =========================
            // RESERVAS
            // =========================
            modelBuilder.Entity<Reserva>(entity =>
            {
                entity.HasKey(e => e.IdReserva);

                entity.Property(e => e.IdReserva).HasColumnName("id_reserva");
                entity.Property(e => e.IdHuesped).HasColumnName("id_huesped");
                entity.Property(e => e.IdHabitacion).HasColumnName("id_habitacion");
                entity.Property(e => e.FechaEntrada).HasColumnName("fecha_entrada");
                entity.Property(e => e.FechaSalida).HasColumnName("fecha_salida");
                entity.Property(e => e.Estado).HasMaxLength(50).HasColumnName("estado");
                entity.Property(e => e.TotalEstimado).HasColumnType("decimal(10,2)").HasColumnName("total_estimado");
                entity.Property(e => e.FechaCreacion).HasColumnType("datetime").HasColumnName("fechaCreacion");
                entity.Property(e => e.FechaModificacion).HasColumnType("datetime").HasColumnName("fechaModificacion");
                entity.Property(e => e.UsuarioCreador).HasColumnName("usuarioCreador");
                entity.Property(e => e.UsuarioModificador).HasColumnName("usuarioModificador");
                entity.Property(e => e.Activo).HasDefaultValue(true).HasColumnName("activo");

                // ✅ CORRECTO: Especificar las colecciones de navegación inversas
                entity.HasOne(d => d.IdHabitacionNavigation)
                    .WithMany(p => p.Reservas)  // ✅ Especifica la colección
                    .HasForeignKey(d => d.IdHabitacion)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.IdHuespedNavigation)
                    .WithMany(p => p.Reservas)  // ✅ Especifica la colección
                    .HasForeignKey(d => d.IdHuesped)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            // =========================
            // CHECKINS
            // =========================
            modelBuilder.Entity<Checkin>(entity =>
            {
                entity.ToTable("Checkins");
                entity.HasKey(e => e.IdCheckin);

                entity.Property(e => e.IdCheckin).HasColumnName("id_checkin");
                entity.Property(e => e.IdReserva).HasColumnName("id_reserva");
                entity.Property(e => e.FechaCheckin).HasColumnName("fecha_checkin");
                entity.Property(e => e.EmpleadoRegistro).HasColumnName("empleado_registro");
                entity.Property(e => e.Notas).HasColumnName("notas");
                entity.Property(e => e.FechaCreacion).HasColumnType("datetime").HasColumnName("fechaCreacion");
                entity.Property(e => e.FechaModificacion).HasColumnType("datetime").HasColumnName("fechaModificacion");
                entity.Property(e => e.UsuarioCreador).HasColumnName("usuarioCreador");
                entity.Property(e => e.UsuarioModificador).HasColumnName("usuarioModificador");
                entity.Property(e => e.Activo).HasDefaultValue(true).HasColumnName("activo");

                // ✅ Configurar relaciones de Checkin
                entity.HasOne(d => d.EmpleadoRegistroNavigation)
                    .WithMany(p => p.Checkins)
                    .HasForeignKey(d => d.EmpleadoRegistro)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.IdReservaNavigation)
                    .WithMany(p => p.Checkins)
                    .HasForeignKey(d => d.IdReserva)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            // =========================
            // CHECKOUTS
            // =========================
            modelBuilder.Entity<Checkout>(entity =>
            {
                entity.ToTable("Checkouts");

                entity.HasKey(e => e.IdCheckout);

                entity.Property(e => e.IdCheckout).HasColumnName("id_checkout");
                entity.Property(e => e.IdReserva).HasColumnName("id_reserva");
                entity.Property(e => e.FechaCheckout).HasColumnName("fecha_checkout");
                entity.Property(e => e.EmpleadoRegistro).HasColumnName("empleado_registro");
                entity.Property(e => e.TotalFinal).HasColumnName("total_final");
                entity.Property(e => e.Notas).HasColumnName("notas");
                entity.Property(e => e.FechaCreacion).HasColumnName("fechaCreacion").HasColumnType("datetime");
                entity.Property(e => e.FechaModificacion).HasColumnName("fechaModificacion").HasColumnType("datetime");
                entity.Property(e => e.UsuarioCreador).HasColumnName("usuarioCreador");
                entity.Property(e => e.UsuarioModificador).HasColumnName("usuarioModificador");
                entity.Property(e => e.Activo).HasColumnName("activo").HasDefaultValue(true);

                // Configurar relaciones
                entity.HasOne(d => d.EmpleadoRegistroNavigation)
                    .WithMany(p => p.Checkouts)
                    .HasForeignKey(d => d.EmpleadoRegistro)
                    .OnDelete(DeleteBehavior.ClientSetNull);

                entity.HasOne(d => d.IdReservaNavigation)
                    .WithMany(p => p.Checkouts)
                    .HasForeignKey(d => d.IdReserva)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });


            // =========================
            // PAGOS
            // =========================
            modelBuilder.Entity<Pago>(entity =>
            {
                entity.HasKey(e => e.IdPago);
                entity.Property(e => e.IdPago).HasColumnName("id_pago");
            });

            modelBuilder.Entity<Usuario>().ToTable(tb => tb.HasTrigger("TR_Usuarios_Auditoria"));
            modelBuilder.Entity<Huespedes>().ToTable(tb => tb.HasTrigger("TR_Huespedes_Auditoria"));
            modelBuilder.Entity<Habitacione>().ToTable(tb => tb.HasTrigger("TR_Habitaciones_Auditoria"));
            modelBuilder.Entity<Reserva>().ToTable(tb => tb.HasTrigger("TR_Reservas_Auditoria"));
            modelBuilder.Entity<Checkin>().ToTable(tb => tb.HasTrigger("TR_Checkins_Auditoria"));
            modelBuilder.Entity<Checkout>().ToTable(tb => tb.HasTrigger("TR_Checkouts_Auditoria"));
            modelBuilder.Entity<Pago>().ToTable(tb => tb.HasTrigger("TR_Pagos_Auditoria"));

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}