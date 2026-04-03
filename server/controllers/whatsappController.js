const { User } = require('../models');
const { Op } = require('sequelize');

// Lazily initialise Twilio so the server still starts even without credentials
function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) return null;
  const twilio = require('twilio');
  return twilio(accountSid, authToken);
}

const whatsappController = {
  /**
   * POST /api/whatsapp/send-reminder
   * Body: { filter: 'all' | 'section' | 'batch', value: string, message: string }
   */
  async sendReminder(req, res) {
    try {
      const { filter = 'all', value, message } = req.body;

      if (!message || !message.trim()) {
        return res.status(400).json({ message: 'Message body is required.' });
      }

      // Build Sequelize where clause
      const where = { role: 'student' };
      if (filter === 'section' && value) {
        where.section = value;
      } else if (filter === 'batch' && value) {
        where.batch = value;
      }

      const students = await User.findAll({
        where,
        attributes: ['id', 'name', 'phone'],
      });

      if (!students.length) {
        return res.status(404).json({ message: 'No matching students found.' });
      }

      const client = getTwilioClient();
      const from = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;

      const results = [];

      for (const student of students) {
        if (!student.phone) {
          results.push({ name: student.name, status: 'skipped', reason: 'No phone number' });
          continue;
        }

        const personalised = message.replace(/{name}/gi, student.name);

        if (client) {
          try {
            const msg = await client.messages.create({
              from,
              to: `whatsapp:${student.phone}`,
              body: personalised,
            });
            results.push({ name: student.name, status: 'sent', sid: msg.sid });
          } catch (err) {
            console.error(`Twilio Error sending to ${student.phone}:`, err.message);
            results.push({ name: student.name, status: 'failed', reason: err.message });
          }
        } else {
          // Twilio not configured — simulate delivery (dev mode)
          console.log(`[DEV] WhatsApp to ${student.name} (${student.phone}): ${personalised}`);
          results.push({ name: student.name, status: 'simulated' });
        }
      }

      const sent = results.filter(r => r.status === 'sent').length;
      const simulated = results.filter(r => r.status === 'simulated').length;
      const failed = results.filter(r => r.status === 'failed').length;
      const skipped = results.filter(r => r.status === 'skipped').length;

      return res.json({
        success: true,
        totalStudents: students.length,
        sent,
        simulated,
        failed,
        skipped,
        results,
      });
    } catch (error) {
      console.error('sendReminder error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  async getQueue(req, res) {
    res.json({ queue: [], count: 0 });
  },

  async toggleAutoReminders(req, res) {
    const { enabled } = req.body;
    res.json({ enabled: enabled || false });
  },

  /** GET /api/whatsapp/status */
  async getStatus(req, res) {
    const connected = !!getTwilioClient();
    res.json({ connected });
  },
};

module.exports = whatsappController;
