const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar router de Eventos
const eventosRouter = require('./routes/EventosRoutes');
const categoriaseventosRouter = require('./routes/CategoriasEventosRoutes');
const horarios_eventosRouter = require('./routes/HorariosEventoRoutes');
const logistica_eventosRouter = require('./routes/LogisticaEventosRoutes');
const materialesRoutes = require('./routes/MaterialesRoutes');
const participantesRoutes = require('./routes/ParticipantesRoutes');
const registoRouter = require('./routes/RegistroParticipantesRoutes');
const SalonesRoutes = require('./routes/SalonesRoutes');
const StaffAsignadoRoutes = require('./routes/StaffAsignadoRoutes');
const StaffEventoRoutes = require('./routes/StaffEventoRoutes');
const reportesRoutes = require('./routes/ReportesRoutes');
const loginRoutes = require('./routes/LoginRoutes');



// Rutas
app.use('/api/eventos', eventosRouter);
app.use('/api/categorias', categoriaseventosRouter);
app.use('/api/horarios', horarios_eventosRouter);
app.use('/api/logistica', logistica_eventosRouter);
app.use('/api/materiales', materialesRoutes);
app.use('/api/participantes', participantesRoutes);
app.use('/api/registro', registoRouter);
app.use('/api/salones', SalonesRoutes);
app.use('/api/staff-asignado', StaffAsignadoRoutes);
app.use('/api/staff', StaffEventoRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/login', loginRoutes);





app.get('/', (req, res) => {
    res.send('API HotelAPI funcionando 🚀');
});

module.exports = app;
