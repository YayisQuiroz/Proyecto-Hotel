const express = require('express');
const router = express.Router();
const RegistroParticipantesController = require('../controllers/RegistroParticipantesController');

router.get('/', RegistroParticipantesController.getAll);
router.get('/:id', RegistroParticipantesController.getById);
router.post('/', RegistroParticipantesController.create);
router.put('/:id', RegistroParticipantesController.update);
router.delete('/:id', RegistroParticipantesController.delete);

module.exports = router;
