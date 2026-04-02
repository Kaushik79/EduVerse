const { Grade, User, Course } = require('../models');

const gradeController = {
  async getAll(req, res) {
    try {
      const { studentId, courseId, semester } = req.query;
      const where = {};
      if (studentId) where.studentId = studentId;
      if (courseId) where.courseId = courseId;
      if (semester) where.semester = semester;

      const grades = await Grade.findAll({
        where,
        include: [
          { model: User, as: 'student', attributes: ['id', 'name', 'studentId'] },
          { model: Course, as: 'course', attributes: ['id', 'name', 'code'] }
        ]
      });
      res.json(grades);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const grade = await Grade.create(req.body);
      res.status(201).json(grade);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const grade = await Grade.findByPk(req.params.id);
      if (!grade) return res.status(404).json({ message: 'Grade not found' });
      await grade.update(req.body);
      res.json(grade);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const grade = await Grade.findByPk(req.params.id);
      if (!grade) return res.status(404).json({ message: 'Grade not found' });
      await grade.destroy();
      res.json({ message: 'Grade deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = gradeController;
