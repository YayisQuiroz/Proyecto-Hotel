const express = require('express');
const router = express.Router();
const ParticipantesController = require('../controllers/ParticipantesController');

router.get('/', ParticipantesController.getAll);
router.get('/:id', ParticipantesController.getById);
router.post('/', ParticipantesController.create);
router.put('/:id', ParticipantesController.update);
router.delete('/:id', ParticipantesController.delete);

module.exports = router;
