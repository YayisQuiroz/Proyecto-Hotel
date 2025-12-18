const StaffAsignadoModel = require('../models/StaffAsignadoModel');

class StaffAsignadoController {
  static async getAll(req, res) {
    try {
      const asignaciones = await StaffAsignadoModel.getAll();
      res.json(asignaciones);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const asignacion = await StaffAsignadoModel.getById(req.params.id);
      if (!asignacion) return res.status(404).json({ error: 'Asignación no encontrada' });
      res.json(asignacion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const newAsignacion = await StaffAsignadoModel.create(req.body);
      res.status(201).json(newAsignacion);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const updated = await StaffAsignadoModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Asignación no encontrada' });
      res.json({ message: 'Asignación actualizada correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await StaffAsignadoModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Asignación no encontrada' });
      res.json({ message: 'Asignación eliminada correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = StaffAsignadoController;
