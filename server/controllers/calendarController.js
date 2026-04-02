const { CalendarEvent, Course } = require('../models');
const { Op } = require('sequelize');

const calendarController = {
  async getEvents(req, res) {
    try {
      const { start, end, type } = req.query;
      const where = {};
      if (start && end) {
        where.startDate = { [Op.between]: [new Date(start), new Date(end)] };
      }
      if (type) where.type = type;

      const events = await CalendarEvent.findAll({
        where,
        include: [{ model: Course, as: 'course', attributes: ['id', 'name', 'code'] }],
        order: [['startDate', 'ASC']]
      });
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { title, description, type, startDate, endDate, allDay, courseId, color } = req.body;
      const event = await CalendarEvent.create({
        title, description, type, startDate, endDate, allDay, courseId, color, createdBy: req.user.id
      });
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const event = await CalendarEvent.findByPk(req.params.id);
      if (!event) return res.status(404).json({ message: 'Not found' });
      await event.destroy();
      res.json({ message: 'Deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = calendarController;
