const express = require('express');
const router = express.Router();
const HorariosEventoController = require('../controllers/HorariosEventoController');

router.get('/', HorariosEventoController.getAll);
router.get('/:id', HorariosEventoController.getById);
router.post('/', HorariosEventoController.create);
router.put('/:id', HorariosEventoController.update);
router.delete('/:id', HorariosEventoController.delete);

module.exports = router;
