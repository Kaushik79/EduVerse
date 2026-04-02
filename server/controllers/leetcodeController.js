const { getLeetcodeStatsForUser } = require('../services/leetcodeService');
const { User, LeetcodeStats } = require('../models');

const leetcodeController = {
  // Get stats for current user
  async getMyStats(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user?.leetcodeUsername) {
        return res.status(404).json({ message: 'LeetCode username not set. Update your profile.' });
      }
      const stats = await getLeetcodeStatsForUser(req.user.id, user.leetcodeUsername);
      if (!stats) return res.status(404).json({ message: 'Could not fetch LeetCode stats' });
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get stats for specific user (for teacher to view)
  async getStatsForUser(req, res) {
    try {
      const user = await User.findByPk(req.params.userId);
      if (!user?.leetcodeUsername) {
        return res.status(404).json({ message: 'LeetCode username not set for this user' });
      }
      const stats = await getLeetcodeStatsForUser(user.id, user.leetcodeUsername);
      if (!stats) return res.status(404).json({ message: 'Could not fetch LeetCode stats' });
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Force refresh
  async refresh(req, res) {
    try {
      const user = await User.findByPk(req.user.id);
      if (!user?.leetcodeUsername) {
        return res.status(404).json({ message: 'LeetCode username not set' });
      }
      // Delete cache to force refresh
      await LeetcodeStats.destroy({ where: { userId: req.user.id } });
      const stats = await getLeetcodeStatsForUser(req.user.id, user.leetcodeUsername);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = leetcodeController;
