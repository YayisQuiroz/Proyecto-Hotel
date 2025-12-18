CREATE SCHEMA "dbo";

CREATE TABLE "dbo"."categoriaseventos" (
  "id_categoria" bigint PRIMARY KEY NOT NULL,
  "nombre" text NOT NULL,
  "descripcion" text,
  "fechacreacion" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "fechamodificacion" timestamp,
  "activo" boolean DEFAULT true
);

CREATE TABLE "dbo"."eventos" (
  "id_evento" bigint PRIMARY KEY NOT NULL,
  "titulo" text NOT NULL,
  "descripcion" text,
  "id_categoria" integer NOT NULL,
  "fecha_inicio" timestamp NOT NULL,
  "fecha_fin" timestamp NOT NULL,
  "id_salon" integer NOT NULL,
  "usuario_responsable" integer NOT NULL,
  "fechacreacion" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "fechamodificacion" timestamp,
  "activo" boolean DEFAULT true
);

CREATE TABLE "dbo"."horariosevento" (
  "id_horario" bigint PRIMARY KEY NOT NULL,
  "id_evento" integer NOT NULL,
  "hora_inicio" timestamp NOT NULL,
  "hora_fin" timestamp NOT NULL,
  "descripcion" text,
  "fechacreacion" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "fechamodificacion" timestamp,
  "activo" boolean DEFAULT true
);

CREATE TABLE "dbo"."logisticaevento" (
  "id_logistica" bigint PRIMARY KEY NOT NULL,
  "id_evento" integer NOT NULL,
  "id_material" integer NOT NULL,
  "cantidad_usada" integer NOT NULL,
  "notas" text,
  "fechacreacion" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "fechamodificacion" timestamp,
  "activo" boolean DEFAULT true
);

CREATE TABLE "dbo"."materialesevento" (
  "id_material" bigint PRIMARY KEY NOT NULL,
  "nombre" text NOT NULL,
  "cantidad" integer NOT NULL,
  "descripcion" text,
  "fechacreacion" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "fechamodificacion" timestamp,
  "activo" boolean DEFAULT true
);

CREATE TABLE "dbo"."participantes" (
  "id_participante" bigint PRIMARY KEY NOT NULL,
  "nombre" text NOT NULL,
  "apellido" text NOT NULL,
  "correo" text,
  "telefono" text,
  "tipo" text NOT NULL,
  "fechacreacion" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "fechamodificacion" timestamp,
  "activo" boolean DEFAULT true
);

CREATE TABLE "dbo"."registroparticipantes" (
  "id_registro" bigint PRIMARY KEY NOT NULL,
  "id_evento" integer NOT NULL,
  "id_participante" integer NOT NULL,
  "asistencia" boolean DEFAULT false,
  "notas" text,
  "fechacreacion" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "fechamodificacion" timestamp,
  "activo" boolean DEFAULT true
);

CREATE TABLE "dbo"."salonesevento" (
  "id_salon" bigint PRIMARY KEY NOT NULL,
  "nombre" text NOT NULL,
  "capacidad" integer NOT NULL,
  "ubicacion" text,
  "descripcion" text,
  "fechacreacion" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "fechamodificacion" timestamp,
  "activo" boolean DEFAULT true
);

CREATE TABLE "dbo"."staffasignado" (
  "id_asignacion" bigint PRIMARY KEY NOT NULL,
  "id_evento" integer NOT NULL,
  "id_staff" integer NOT NULL,
  "notas" text,
  "fechacreacion" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "fechamodificacion" timestamp,
  "activo" boolean DEFAULT true
);

CREATE TABLE "dbo"."staffevento" (
  "id_staff" bigint PRIMARY KEY NOT NULL,
  "nombre" text NOT NULL,
  "rol" text NOT NULL,
  "telefono" text,
  "fechacreacion" timestamp DEFAULT (CURRENT_TIMESTAMP),
  "fechamodificacion" timestamp,
  "activo" boolean DEFAULT true
);

ALTER TABLE "dbo"."eventos" ADD CONSTRAINT "fk__eventos__id_cate__412eb0b6" FOREIGN KEY ("id_categoria") REFERENCES "dbo"."categoriaseventos" ("id_categoria");

ALTER TABLE "dbo"."eventos" ADD CONSTRAINT "fk__eventos__id_salo__4222d4ef" FOREIGN KEY ("id_salon") REFERENCES "dbo"."salonesevento" ("id_salon");

ALTER TABLE "dbo"."horariosevento" ADD CONSTRAINT "fk__horariose__id_ev__46e78a0c" FOREIGN KEY ("id_evento") REFERENCES "dbo"."eventos" ("id_evento");

ALTER TABLE "dbo"."logisticaevento" ADD CONSTRAINT "fk__logistica__id_ev__6383c8ba" FOREIGN KEY ("id_evento") REFERENCES "dbo"."eventos" ("id_evento");

ALTER TABLE "dbo"."logisticaevento" ADD CONSTRAINT "fk__logistica__id_ma__6477ecf3" FOREIGN KEY ("id_material") REFERENCES "dbo"."materialesevento" ("id_material");

ALTER TABLE "dbo"."registroparticipantes" ADD CONSTRAINT "fk__registrop__id_ev__5070f446" FOREIGN KEY ("id_evento") REFERENCES "dbo"."eventos" ("id_evento");

ALTER TABLE "dbo"."registroparticipantes" ADD CONSTRAINT "fk__registrop__id_pa__5165187f" FOREIGN KEY ("id_participante") REFERENCES "dbo"."participantes" ("id_participante");

ALTER TABLE "dbo"."staffasignado" ADD CONSTRAINT "fk__staffasig__id_ev__59fa5e80" FOREIGN KEY ("id_evento") REFERENCES "dbo"."eventos" ("id_evento");

ALTER TABLE "dbo"."staffasignado" ADD CONSTRAINT "fk__staffasig__id_st__5aee82b9" FOREIGN KEY ("id_staff") REFERENCES "dbo"."staffevento" ("id_staff");

ALTER TABLE "dbo"."eventos" ADD FOREIGN KEY ("fechacreacion") REFERENCES "dbo"."eventos" ("fecha_inicio");
