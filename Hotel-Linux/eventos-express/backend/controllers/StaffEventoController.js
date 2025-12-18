const StaffEventoModel = require('../models/StaffEventoModel');

class StaffEventoController {
  static async getAll(req, res) {
    try {
      const filters = {
        search: req.query.search,
        rol: req.query.rol,
        activo: req.query.activo !== undefined ? req.query.activo === 'true' : undefined
      };
      
      const staff = await StaffEventoModel.getAll(filters);
      res.json(staff);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const staff = await StaffEventoModel.getById(req.params.id);
      if (!staff) return res.status(404).json({ error: 'Staff no encontrado' });
      res.json(staff);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const newStaff = await StaffEventoModel.create(req.body);
      res.status(201).json(newStaff);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const updated = await StaffEventoModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Staff no encontrado' });
      res.json({ message: 'Staff actualizado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await StaffEventoModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Staff no encontrado' });
      res.json({ message: 'Staff eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = StaffEventoController;