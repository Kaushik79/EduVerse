const { Course, User } = require('../models');

const courseController = {
  async getAll(req, res) {
    try {
      const courses = await Course.findAll({
        include: [{ model: User, as: 'teacher', attributes: ['id', 'name', 'email'] }]
      });
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const course = await Course.findByPk(req.params.id, {
        include: [{ model: User, as: 'teacher', attributes: ['id', 'name', 'email'] }]
      });
      if (!course) return res.status(404).json({ message: 'Course not found' });
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const course = await Course.create(req.body);
      res.status(201).json(course);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const course = await Course.findByPk(req.params.id);
      if (!course) return res.status(404).json({ message: 'Course not found' });
      await course.update(req.body);
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const course = await Course.findByPk(req.params.id);
      if (!course) return res.status(404).json({ message: 'Course not found' });
      await course.destroy();
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = courseController;
