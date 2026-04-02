const { Finance, User } = require('../models');

const financeController = {
  async getAll(req, res) {
    try {
      const { studentId, status } = req.query;
      const where = {};
      if (studentId) where.studentId = studentId;
      if (status) where.status = status;

      const finances = await Finance.findAll({
        where,
        include: [{ model: User, as: 'student', attributes: ['id', 'name', 'studentId'] }],
        order: [['dueDate', 'ASC']]
      });
      res.json(finances);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const finance = await Finance.findByPk(req.params.id, {
        include: [{ model: User, as: 'student', attributes: ['id', 'name', 'studentId'] }]
      });
      if (!finance) return res.status(404).json({ message: 'Record not found' });
      res.json(finance);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const finance = await Finance.create(req.body);
      res.status(201).json(finance);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const finance = await Finance.findByPk(req.params.id);
      if (!finance) return res.status(404).json({ message: 'Record not found' });
      await finance.update(req.body);
      res.json(finance);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const finance = await Finance.findByPk(req.params.id);
      if (!finance) return res.status(404).json({ message: 'Record not found' });
      await finance.destroy();
      res.json({ message: 'Record deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = financeController;
