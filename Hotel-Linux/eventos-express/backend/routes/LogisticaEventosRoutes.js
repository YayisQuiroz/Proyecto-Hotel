const express = require('express');
const router = express.Router();
const LogisticaEventoController = require('../controllers/LogisticaEventoController');

router.get('/', LogisticaEventoController.getAll);
router.get('/:id', LogisticaEventoController.getById);
router.post('/', LogisticaEventoController.create);
router.put('/:id', LogisticaEventoController.update);
router.delete('/:id', LogisticaEventoController.delete);

module.exports = router;
