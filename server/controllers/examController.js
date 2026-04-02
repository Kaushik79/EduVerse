const { Exam, Course } = require('../models');

const examController = {
  async getAll(req, res) {
    try {
      const { courseId } = req.query;
      const where = courseId ? { courseId } : {};
      const exams = await Exam.findAll({
        where,
        include: [{ model: Course, as: 'course', attributes: ['id', 'name', 'code'] }],
        order: [['date', 'ASC']]
      });
      res.json(exams);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const exam = await Exam.findByPk(req.params.id, {
        include: [{ model: Course, as: 'course' }]
      });
      if (!exam) return res.status(404).json({ message: 'Exam not found' });
      res.json(exam);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const exam = await Exam.create(req.body);
      res.status(201).json(exam);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const exam = await Exam.findByPk(req.params.id);
      if (!exam) return res.status(404).json({ message: 'Exam not found' });
      await exam.update(req.body);
      res.json(exam);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const exam = await Exam.findByPk(req.params.id);
      if (!exam) return res.status(404).json({ message: 'Exam not found' });
      await exam.destroy();
      res.json({ message: 'Exam deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = examController;
