const { Achievement } = require('../models');

const achievementController = {
  async getByUser(req, res) {
    try {
      const userId = req.params.userId || req.user.id;
      const achievements = await Achievement.findAll({
        where: { userId },
        order: [['dateAchieved', 'DESC']]
      });
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const { type, title, description, issuer, dateAchieved, proofUrl } = req.body;
      const achievement = await Achievement.create({
        userId: req.user.id, type, title, description, issuer, dateAchieved, proofUrl
      });
      res.status(201).json(achievement);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const achievement = await Achievement.findByPk(req.params.id);
      if (!achievement) return res.status(404).json({ message: 'Not found' });
      if (achievement.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
      await achievement.destroy();
      res.json({ message: 'Deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = achievementController;
