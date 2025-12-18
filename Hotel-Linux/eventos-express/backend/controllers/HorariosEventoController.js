const HorariosEventoModel = require('../models/HorariosEventoModel');

class HorariosEventoController {
  static async getAll(req, res) {
    try {
      const horarios = await HorariosEventoModel.getAll();
      res.json(horarios);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const horario = await HorariosEventoModel.getById(req.params.id);
      if (!horario) return res.status(404).json({ error: 'Horario no encontrado' });
      res.json(horario);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const newHorario = await HorariosEventoModel.create(req.body);
      res.status(201).json(newHorario);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const updated = await HorariosEventoModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Horario no encontrado' });
      res.json({ message: 'Horario actualizado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await HorariosEventoModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Horario no encontrado' });
      res.json({ message: 'Horario eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = HorariosEventoController;
