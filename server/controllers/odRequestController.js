const { OdRequest, User } = require('../models');

const odRequestController = {
  async getAll(req, res) {
    try {
      const { status, studentId } = req.query;
      const where = {};
      if (status) where.status = status;
      if (studentId) where.studentId = studentId;

      const requests = await OdRequest.findAll({
        where,
        include: [{ model: User, as: 'student', attributes: ['id', 'name', 'studentId', 'avatar'] }],
        order: [['createdAt', 'DESC']]
      });
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const request = await OdRequest.create({ ...req.body, studentId: req.user.id });
      res.status(201).json(request);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async approve(req, res) {
    try {
      const request = await OdRequest.findByPk(req.params.id);
      if (!request) return res.status(404).json({ message: 'Request not found' });
      await request.update({ status: 'approved', reviewedBy: req.user.id });
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async reject(req, res) {
    try {
      const request = await OdRequest.findByPk(req.params.id);
      if (!request) return res.status(404).json({ message: 'Request not found' });
      await request.update({ status: 'rejected', reviewedBy: req.user.id });
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const request = await OdRequest.findByPk(req.params.id);
      if (!request) return res.status(404).json({ message: 'Request not found' });
      await request.destroy();
      res.json({ message: 'Request deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = odRequestController;
