const { Resource, Course, User } = require('../models');

const resourceController = {
  async getAll(req, res) {
    try {
      const { courseId } = req.query;
      const where = courseId ? { courseId } : {};
      const resources = await Resource.findAll({
        where,
        include: [
          { model: Course, as: 'course', attributes: ['id', 'name', 'code'] },
          { model: User, as: 'uploader', attributes: ['id', 'name'] }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const resource = await Resource.create({ ...req.body, uploadedBy: req.user.id });
      res.status(201).json(resource);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const resource = await Resource.findByPk(req.params.id);
      if (!resource) return res.status(404).json({ message: 'Resource not found' });
      await resource.update(req.body);
      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const resource = await Resource.findByPk(req.params.id);
      if (!resource) return res.status(404).json({ message: 'Resource not found' });
      await resource.destroy();
      res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = resourceController;
