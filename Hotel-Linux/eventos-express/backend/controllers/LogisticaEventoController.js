const LogisticaEventoModel = require('../models/LogisticaEventoModel');

class LogisticaEventoController {
  static async getAll(req, res) {
    try {
      const registros = await LogisticaEventoModel.getAll();
      res.json(registros);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const registro = await LogisticaEventoModel.getById(req.params.id);
      if (!registro) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json(registro);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const newRegistro = await LogisticaEventoModel.create(req.body);
      res.status(201).json(newRegistro);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const updated = await LogisticaEventoModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json({ message: 'Registro actualizado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await LogisticaEventoModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Registro no encontrado' });
      res.json({ message: 'Registro eliminado correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = LogisticaEventoController;
