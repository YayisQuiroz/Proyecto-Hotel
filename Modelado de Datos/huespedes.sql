CREATE TABLE [Usuarios] (
  [id_usuario] INT IDENTITY(1,1) PRIMARY KEY,
  [nombre] NVARCHAR(100) NOT NULL,
  [apellido] NVARCHAR(100) NOT NULL,
  [correo] NVARCHAR(150) UNIQUE NOT NULL,
  [contraseña_hash] NVARCHAR(300) NOT NULL,
  [rol] NVARCHAR(50) NOT NULL,
  [fechaCreacion] DATETIME DEFAULT (GETDATE()),
  [fechaModificacion] DATETIME,
  [usuarioCreador] INT,
  [usuarioModificador] INT,
  [Activo] BIT DEFAULT (1)
)
GO

CREATE TABLE [Huespedes] (
  [id_huesped] INT IDENTITY(1,1) PRIMARY KEY,
  [nombre] NVARCHAR(100) NOT NULL,
  [apellido] NVARCHAR(100) NOT NULL,
  [telefono] NVARCHAR(20),
  [correo] NVARCHAR(150),
  [identificacion] NVARCHAR(80),
  [fechaCreacion] DATETIME DEFAULT (GETDATE()),
  [fechaModificacion] DATETIME,
  [usuarioCreador] INT,
  [usuarioModificador] INT,
  [activo] BIT DEFAULT (1)
)
GO

CREATE TABLE [Habitaciones] (
  [id_habitacion] INT IDENTITY(1,1) PRIMARY KEY,
  [numero_habitacion] NVARCHAR(20) UNIQUE NOT NULL,
  [tipo] NVARCHAR(50) NOT NULL,
  [precio_noche] DECIMAL(10,2) NOT NULL,
  [estado] NVARCHAR(50) NOT NULL,
  [descripcion] NVARCHAR(MAX),
  [fechaCreacion] DATETIME DEFAULT (GETDATE()),
  [fechaModificacion] DATETIME,
  [usuarioCreador] INT,
  [usuarioModificador] INT,
  [activo] BIT DEFAULT (1)
)
GO

CREATE TABLE [Reservas] (
  [id_reserva] INT IDENTITY(1,1) PRIMARY KEY,
  [id_huesped] INT NOT NULL,
  [id_habitacion] INT NOT NULL,
  [fecha_entrada] DATE NOT NULL,
  [fecha_salida] DATE NOT NULL,
  [estado] NVARCHAR(50) NOT NULL,
  [total_estimado] DECIMAL(10,2),
  [fechaCreacion] DATETIME DEFAULT (GETDATE()),
  [fechaModificacion] DATETIME,
  [usuarioCreador] INT,
  [usuarioModificador] INT,
  [activo] BIT DEFAULT (1)
)
GO

CREATE TABLE [Checkins] (
  [id_checkin] INT IDENTITY(1,1) PRIMARY KEY,
  [id_reserva] INT NOT NULL,
  [fecha_checkin] DATETIME NOT NULL,
  [empleado_registro] INT NOT NULL,
  [notas] NVARCHAR(MAX),
  [fechaCreacion] DATETIME DEFAULT (GETDATE()),
  [fechaModificacion] DATETIME,
  [usuarioCreador] INT,
  [usuarioModificador] INT,
  [activo] BIT DEFAULT (1)
)
GO

CREATE TABLE [Checkouts] (
  [id_checkout] INT IDENTITY(1,1) PRIMARY KEY,
  [id_reserva] INT NOT NULL,
  [fecha_checkout] DATETIME NOT NULL,
  [empleado_registro] INT NOT NULL,
  [total_final] DECIMAL(10,2),
  [notas] NVARCHAR(MAX),
  [fechaCreacion] DATETIME DEFAULT (GETDATE()),
  [fechaModificacion] DATETIME,
  [usuarioCreador] INT,
  [usuarioModificador] INT,
  [activo] BIT DEFAULT (1)
)
GO

CREATE TABLE [Pagos] (
  [id_pago] INT IDENTITY(1,1) PRIMARY KEY,
  [id_reserva] INT NOT NULL,
  [fecha_pago] DATETIME NOT NULL,
  [monto] DECIMAL(10,2) NOT NULL,
  [metodo_pago] NVARCHAR(50) NOT NULL,
  [referencia] NVARCHAR(150),
  [empleado_registro] INT NOT NULL,
  [fechaCreacion] DATETIME DEFAULT (GETDATE()),
  [fechaModificacion] DATETIME,
  [usuarioCreador] INT,
  [usuarioModificador] INT,
  [activo] BIT DEFAULT (1)
)
GO

CREATE TABLE [Auditorias] (
  [id_auditoria] INT IDENTITY(1,1) PRIMARY KEY,
  [usuario] INT NOT NULL,
  [tabla_afectada] NVARCHAR(100) NOT NULL,
  [id_registro_afectado] INT NOT NULL,
  [accion] NVARCHAR(20) NOT NULL,
  [fecha] DATETIME DEFAULT (GETDATE()),
  [descripcion_cambio] NVARCHAR(MAX)
)
GO

CREATE TABLE [Servicios] (
  [id_Servicio] INT IDENTITY(1,1) PRIMARY KEY,
  [nombre] VARCHAR(100) NOT NULL,
  [descripcion] NVARCHAR(100) NOT NULL,
  [precio] DECIMAL(10,2) NOT NULL,
  [fechaCreacion] DATETIME DEFAULT (GETDATE()),
  [fechaModificacion] DATETIME,
  [usuarioCreador] INT,
  [usuarioModificador] INT,
  [activo] BIT DEFAULT (1)
)
GO

CREATE TABLE [Reserva_Servicios] (
  [id_reserva_servicio] INT IDENTITY(1,1) PRIMARY KEY,
  [id_reserva] INT NOT NULL,
  [id_servicio] INT NOT NULL,
  [cantidad] DECIMAL(10,2) NOT NULL,
  [precio_total] DECIMAL(10,2) NOT NULL,
  [fechaCreacion] DATETIME DEFAULT (GETDATE()),
  [fechaModificacion] DATETIME,
  [usuarioCreador] INT,
  [usuarioModificador] INT,
  [activo] BIT DEFAULT (1)
)
GO

ALTER TABLE [Reservas] ADD FOREIGN KEY ([id_huesped]) REFERENCES [Huespedes] ([id_huesped])
GO

ALTER TABLE [Reservas] ADD FOREIGN KEY ([id_habitacion]) REFERENCES [Habitaciones] ([id_habitacion])
GO

ALTER TABLE [Checkins] ADD FOREIGN KEY ([id_reserva]) REFERENCES [Reservas] ([id_reserva])
GO

ALTER TABLE [Checkins] ADD FOREIGN KEY ([empleado_registro]) REFERENCES [Usuarios] ([id_usuario])
GO

ALTER TABLE [Checkouts] ADD FOREIGN KEY ([id_reserva]) REFERENCES [Reservas] ([id_reserva])
GO

ALTER TABLE [Checkouts] ADD FOREIGN KEY ([empleado_registro]) REFERENCES [Usuarios] ([id_usuario])
GO

ALTER TABLE [Pagos] ADD FOREIGN KEY ([id_reserva]) REFERENCES [Reservas] ([id_reserva])
GO

ALTER TABLE [Pagos] ADD FOREIGN KEY ([empleado_registro]) REFERENCES [Usuarios] ([id_usuario])
GO

ALTER TABLE [Auditorias] ADD FOREIGN KEY ([usuario]) REFERENCES [Usuarios] ([id_usuario])
GO

ALTER TABLE [Servicios] ADD FOREIGN KEY ([usuarioCreador]) REFERENCES [Usuarios] ([id_usuario])
GO

ALTER TABLE [Reserva_Servicios] ADD FOREIGN KEY ([id_servicio]) REFERENCES [Servicios] ([id_Servicio])
GO

ALTER TABLE [Reserva_Servicios] ADD FOREIGN KEY ([id_reserva]) REFERENCES [Reservas] ([id_reserva])
GO
