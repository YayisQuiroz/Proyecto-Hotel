const ParticipantesModel = require('../models/ParticipantesModel');

class ParticipantesController {
  static async getAll(req, res) {
    try {
      const participantes = await ParticipantesModel.getAll();
      res.json(participantes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const participante = await ParticipantesModel.getById(req.params.id);
      if (!participante) return res.status(404).json({ error: 'Participante no encontrado' });
      res.json(participante);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const newParticipante = await ParticipantesModel.create(req.body);
      res.status(201).json(newParticipante);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const updated = await ParticipantesModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Participante no encontrado' });
      res.json({ message: 'Participante actualizado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await ParticipantesModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Participante no encontrado' });
      res.json({ message: 'Participante eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = ParticipantesController;
