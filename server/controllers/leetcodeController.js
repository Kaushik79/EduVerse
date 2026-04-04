const { fetchLeetcodeStats, getLeetcodeStatsForUser } = require('../services/leetcodeService');
const { User, LeetcodeStats } = require('../models');
const { Op } = require('sequelize');

let globalLastSync = null;

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
  },

  async syncAll(req, res) {
    try {
      const users = await User.findAll({
        where: {
          leetcodeHandle: {
            [Op.ne]: null
          }
        }
      });

      let updatedCount = 0;

      for (const user of users) {
        const stats = await fetchLeetcodeStats(user.leetcodeHandle);
        if (stats) {
          await user.update({
            easySolved: stats.easySolved,
            mediumSolved: stats.mediumSolved,
            hardSolved: stats.hardSolved,
            totalSolved: stats.totalSolved,
            leetcodeRanking: stats.ranking
          });
          updatedCount++;
        }
      }

      globalLastSync = Date.now();
      res.json({ message: 'Sync complete', updatedCount, totalUsersWithHandle: users.length });
    } catch (error) {
      console.error('Error in syncAll:', error);
      res.status(500).json({ message: 'Server error during sync', error: error.message });
    }
  }
};

module.exports = leetcodeController;
