const { User } = require('../models');
const { Op } = require('sequelize');

const bcrypt = require('bcryptjs');

const teacherController = {
  async getLeaderboard(req, res) {
    try {
      // Auto-Seed logic embedded inside active thread to prevent CLI locks
      const handles = ['shriram716', 'Cipher_Algo', 'rogithpm', 'Vishwa7805'];
      const defaultPassword = await bcrypt.hash('password123', 10);
      
      for (let handle of handles) {
        // Only insert if missing
        await User.findOrCreate({
          where: { leetcodeHandle: handle },
          defaults: {
            name: handle,
            email: `${handle.toLowerCase()}@eduverse.test`,
            password: defaultPassword,
            role: 'student',
            easySolved: 0,
            mediumSolved: 0,
            hardSolved: 0,
            totalSolved: 0,
            leetcodeRanking: 0
          }
        });
      }

      const students = await User.findAll({
        where: { 
          role: 'student',
          leetcodeHandle: { [Op.ne]: null }
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
