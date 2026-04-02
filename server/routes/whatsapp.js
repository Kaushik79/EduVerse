const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// WhatsApp Routes - Placeholder
router.post('/send-reminder', auth, roleCheck('teacher', 'admin'), whatsappController.sendReminder);
router.get('/queue', auth, roleCheck('teacher', 'admin'), whatsappController.getQueue);
router.post('/toggle-auto', auth, roleCheck('teacher', 'admin'), whatsappController.toggleAutoReminders);
router.get('/status', auth, roleCheck('teacher', 'admin'), whatsappController.getStatus);

module.exports = router;
