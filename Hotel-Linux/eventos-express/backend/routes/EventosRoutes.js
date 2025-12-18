const express = require('express');
const router = express.Router();
const EventosController = require('../controllers/EventosController');

router.get('/', EventosController.getAll);
router.get('/:id', EventosController.getById);
router.post('/', EventosController.create);
router.put('/:id', EventosController.update);
router.delete('/:id', EventosController.delete);

module.exports = router;
