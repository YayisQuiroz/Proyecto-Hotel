const CategoriasEventosModel = require('../models/CategoriasEventosModel');

class CategoriasEventosController {
  static async getAll(req, res) {
    try {
      const categorias = await CategoriasEventosModel.getAll();
      res.json(categorias);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getById(req, res) {
    try {
      const categoria = await CategoriasEventosModel.getById(req.params.id);
      if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
      res.json(categoria);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async create(req, res) {
    try {
      const newCategoria = await CategoriasEventosModel.create(req.body);
      res.status(201).json(newCategoria);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async update(req, res) {
    try {
      const updated = await CategoriasEventosModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Categoría no encontrada' });
      res.json({ message: 'Categoría actualizada correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async delete(req, res) {
    try {
      const deleted = await CategoriasEventosModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Categoría no encontrada' });
      res.json({ message: 'Categoría eliminada correctamente' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = CategoriasEventosController;
