const express = require('express');
const router = express.Router();
const MaterialesController = require('../controllers/MaterialesController');

router.get('/', MaterialesController.getAll);
router.get('/:id', MaterialesController.getById);
router.post('/', MaterialesController.create);
router.put('/:id', MaterialesController.update);
router.delete('/:id', MaterialesController.delete);

module.exports = router;
