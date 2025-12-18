const express = require('express');
const router = express.Router();
const StaffEventoController = require('../controllers/StaffEventoController');

// CRUD StaffEvento
router.get('/', StaffEventoController.getAll);
router.get('/:id', StaffEventoController.getById);
router.post('/', StaffEventoController.create);
router.put('/:id', StaffEventoController.update);
router.delete('/:id', StaffEventoController.delete);

module.exports = router;
