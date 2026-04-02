const { Class, Course, User } = require('../models');

const classController = {
  async getAll(req, res) {
    try {
      const { teacherId } = req.query;
      const where = teacherId ? { teacherId } : {};
      const classes = await Class.findAll({
        where,
        include: [
          { model: Course, as: 'course' },
          { model: User, as: 'teacher', attributes: ['id', 'name'] }
        ]
      });
      res.json(classes);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const cls = await Class.findByPk(req.params.id, {
        include: [
          { model: Course, as: 'course' },
          { model: User, as: 'teacher', attributes: ['id', 'name'] }
        ]
      });
      if (!cls) return res.status(404).json({ message: 'Class not found' });
      res.json(cls);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const cls = await Class.create(req.body);
      res.status(201).json(cls);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const cls = await Class.findByPk(req.params.id);
      if (!cls) return res.status(404).json({ message: 'Class not found' });
      await cls.update(req.body);
      res.json(cls);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const cls = await Class.findByPk(req.params.id);
      if (!cls) return res.status(404).json({ message: 'Class not found' });
      await cls.destroy();
      res.json({ message: 'Class deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = classController;
