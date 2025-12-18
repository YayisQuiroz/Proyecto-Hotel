const express = require('express');
const router = express.Router();
const StaffAsignadoController = require('../controllers/StaffAsignadoController');

// CRUD StaffAsignado
router.get('/', StaffAsignadoController.getAll);
router.get('/:id', StaffAsignadoController.getById);
router.post('/', StaffAsignadoController.create);
router.put('/:id', StaffAsignadoController.update);
router.delete('/:id', StaffAsignadoController.delete);

module.exports = router;
