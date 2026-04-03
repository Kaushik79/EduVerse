const { Session } = require('../models');

const sessionController = {
  async getSessionStatus(req, res) {
    try {
      let session = await Session.findOne();
      if (!session) {
        session = await Session.create({ status: 'LOCKED', sessionCode: 'EDU-G-TEST' });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async toggleSession(req, res) {
    try {
      let session = await Session.findOne();
      if (!session) {
        session = await Session.create({ status: 'LOCKED', sessionCode: 'EDU-G-TEST' });
      }
      
      const newStatus = session.status === 'ACTIVE' ? 'LOCKED' : 'ACTIVE';
      session.status = newStatus;
      await session.save();

      res.json(session);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = sessionController;
