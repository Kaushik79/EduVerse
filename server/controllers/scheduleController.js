const { Schedule, Course, User } = require('../models');

const scheduleController = {
  async getAll(req, res) {
    try {
      const { userId, day } = req.query;
      const where = {};
      if (userId) where.userId = userId;
      if (day) where.day = day;

      const schedules = await Schedule.findAll({
        where,
        include: [
          { model: Course, as: 'course', attributes: ['id', 'name', 'code'] }
        ],
        order: [['day', 'ASC'], ['startTime', 'ASC']]
      });
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const schedule = await Schedule.findByPk(req.params.id, {
        include: [{ model: Course, as: 'course' }]
      });
      if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const schedule = await Schedule.create(req.body);
      res.status(201).json(schedule);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const schedule = await Schedule.findByPk(req.params.id);
      if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
      await schedule.update(req.body);
      res.json(schedule);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const schedule = await Schedule.findByPk(req.params.id);
      if (!schedule) return res.status(404).json({ message: 'Schedule not found' });
      await schedule.destroy();
      res.json({ message: 'Schedule deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = scheduleController;
