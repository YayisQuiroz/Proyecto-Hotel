const EventosModel = require('../models/EventosModel');

class EventosController {
  static async getAll(req, res) {
    try {
      const eventos = await EventosModel.getAll();
      res.json(eventos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const evento = await EventosModel.getById(req.params.id);
      if (!evento) return res.status(404).json({ error: 'Evento no encontrado' });
      res.json(evento);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const newEvento = await EventosModel.create(req.body);
      res.status(201).json(newEvento);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const updated = await EventosModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Evento no encontrado' });
      res.json({ message: 'Evento actualizado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await EventosModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Evento no encontrado' });
      res.json({ message: 'Evento eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = EventosController;
