const RegistroParticipantesModel = require('../models/RegistroParticipantesModel');

class RegistroParticipantesController {
  static async getAll(req, res) {
    try {
      const registros = await RegistroParticipantesModel.getAll();
      res.json(registros);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const registro = await RegistroParticipantesModel.getById(req.params.id);
      if (!registro) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json(registro);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const newRegistro = await RegistroParticipantesModel.create(req.body);
      res.status(201).json(newRegistro);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const updated = await RegistroParticipantesModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json({ message: 'Registro actualizado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await RegistroParticipantesModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json({ message: 'Registro eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = RegistroParticipantesController;
