const { User } = require('../models');
const { Op } = require('sequelize');

const teacherController = {
  async getLeaderboard(req, res) {
    try {
      const students = await User.findAll({
        where: { 
          role: 'student',
          leetcodeHandle: { [Op.not]: null }
        },
        order: [['totalSolved', 'DESC']],
        attributes: ['id', 'name', 'leetcodeHandle', 'easySolved', 'mediumSolved', 'hardSolved', 'totalSolved', 'avatar']
      });
      res.json(students);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ message: 'Server error fetching leaderboard', error: error.message });
    }
  }
};

module.exports = teacherController;
