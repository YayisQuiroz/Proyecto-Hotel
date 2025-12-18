const express = require('express');
const router = express.Router();
const ReportesController = require('../controllers/ReportesController');

router.get('/eventos-responsable', ReportesController.eventosConResponsable);
router.get('/eventos-participantes', ReportesController.eventosConParticipantes);
router.get('/eventos-staff', ReportesController.eventosConStaff);
router.get('/materiales-responsable', ReportesController.materialesConResponsable);
router.get('/full', ReportesController.reporteFull);

module.exports = router;
