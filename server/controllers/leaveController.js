const { LeaveRequest, User } = require('../models');

const leaveController = {
  async getAll(req, res) {
    try {
      const where = {};
      if (req.user.role === 'student') where.studentId = req.user.id;
      const requests = await LeaveRequest.findAll({
        where,
        include: [{ model: User, as: 'student', attributes: ['id', 'name', 'studentId', 'department'] }],
        order: [['createdAt', 'DESC']]
      });
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { type, reason, description, fromDate, toDate } = req.body;
      const request = await LeaveRequest.create({
        studentId: req.user.id, type, reason, description, fromDate, toDate
      });
      res.status(201).json(request);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async updateStatus(req, res) {
    try {
      const { status, reviewNote } = req.body;
      const request = await LeaveRequest.findByPk(req.params.id);
      if (!request) return res.status(404).json({ message: 'Not found' });
      await request.update({ status, reviewedBy: req.user.id, reviewNote });
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = leaveController;
