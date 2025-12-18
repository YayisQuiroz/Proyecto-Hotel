const express = require('express');
const router = express.Router();
const CategoriasEventosController = require('../controllers/CategoriasEventosController');

router.get('/', CategoriasEventosController.getAll);
router.get('/:id', CategoriasEventosController.getById);
router.post('/', CategoriasEventosController.create);
router.put('/:id', CategoriasEventosController.update);
router.delete('/:id', CategoriasEventosController.delete);

module.exports = router;
