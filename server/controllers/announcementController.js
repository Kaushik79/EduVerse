const { Announcement, User } = require('../models');

const announcementController = {
  async getAll(req, res) {
    try {
      const { targetRole } = req.query;
      const where = targetRole ? { targetRole } : {};
      const announcements = await Announcement.findAll({
        where,
        include: [{ model: User, as: 'author', attributes: ['id', 'name', 'role'] }],
        order: [['createdAt', 'DESC']]
      });
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const announcement = await Announcement.create({ ...req.body, authorId: req.user.id });
      res.status(201).json(announcement);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const announcement = await Announcement.findByPk(req.params.id);
      if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
      await announcement.update(req.body);
      res.json(announcement);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const announcement = await Announcement.findByPk(req.params.id);
      if (!announcement) return res.status(404).json({ message: 'Announcement not found' });
      await announcement.destroy();
      res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = announcementController;
