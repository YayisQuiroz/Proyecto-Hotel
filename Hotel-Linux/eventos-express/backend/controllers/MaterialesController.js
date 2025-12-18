const MaterialesModel = require('../models/MaterialesModel');

class MaterialesController {
  static async getAll(req, res) {
    try {
      const materiales = await MaterialesModel.getAll();
      res.json(materiales);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const material = await MaterialesModel.getById(req.params.id);
      if (!material) return res.status(404).json({ error: 'Material no encontrado' });
      res.json(material);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const newMaterial = await MaterialesModel.create(req.body);
      res.status(201).json(newMaterial);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const updated = await MaterialesModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Material no encontrado' });
      res.json({ message: 'Material actualizado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await MaterialesModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Material no encontrado' });
      res.json({ message: 'Material eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = MaterialesController;
