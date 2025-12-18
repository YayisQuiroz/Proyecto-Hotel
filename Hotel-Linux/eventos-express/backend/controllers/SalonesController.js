const SalonesModel = require('../models/SalonesModel');

class SalonesController {
  static async getAll(req, res) {
    try {
      const salones = await SalonesModel.getAll();
      res.json(salones);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const salon = await SalonesModel.getById(req.params.id);
      if (!salon) return res.status(404).json({ error: 'Salón no encontrado' });
      res.json(salon);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const newSalon = await SalonesModel.create(req.body);
      res.status(201).json(newSalon);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const updated = await SalonesModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Salón no encontrado' });
      res.json({ message: 'Salón actualizado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await SalonesModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Salón no encontrado' });
      res.json({ message: 'Salón eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = SalonesController;
