const express = require('express');
const router = express.Router();
const SalonesController = require('../controllers/SalonesController');

// CRUD Salones
router.get('/', SalonesController.getAll);
router.get('/:id', SalonesController.getById);
router.post('/', SalonesController.create);
router.put('/:id', SalonesController.update);
router.delete('/:id', SalonesController.delete);

module.exports = router;
