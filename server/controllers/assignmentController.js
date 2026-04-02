const { Assignment, Course, Class, Submission, User } = require('../models');

const assignmentController = {
  async getAll(req, res) {
    try {
      const { courseId, teacherId, classId } = req.query;
      const where = {};
      if (courseId) where.courseId = courseId;
      if (teacherId) where.teacherId = teacherId;
      if (classId) where.classId = classId;

      const assignments = await Assignment.findAll({
        where,
        include: [
          { model: Course, as: 'course', attributes: ['id', 'name', 'code'] },
          { model: Class, as: 'class', attributes: ['id', 'name'] },
          { model: Submission, as: 'submissions', attributes: ['id', 'status'] }
        ],
        order: [['dueDate', 'ASC']]
      });
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const assignment = await Assignment.findByPk(req.params.id, {
        include: [
          { model: Course, as: 'course' },
          { model: Class, as: 'class' },
          { model: Submission, as: 'submissions', include: [{ model: User, as: 'student', attributes: ['id', 'name', 'studentId'] }] }
        ]
      });
      if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const assignment = await Assignment.create({ ...req.body, teacherId: req.user.id });
      res.status(201).json(assignment);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const assignment = await Assignment.findByPk(req.params.id);
      if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
      await assignment.update(req.body);
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const assignment = await Assignment.findByPk(req.params.id);
      if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
      await assignment.destroy();
      res.json({ message: 'Assignment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async submit(req, res) {
    try {
      const submission = await Submission.create({
        assignmentId: req.params.id,
        studentId: req.user.id,
        ...req.body
      });
      res.status(201).json(submission);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async grade(req, res) {
    try {
      const submission = await Submission.findByPk(req.params.submissionId);
      if (!submission) return res.status(404).json({ message: 'Submission not found' });
      await submission.update({ ...req.body, status: 'graded' });
      res.json(submission);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = assignmentController;
