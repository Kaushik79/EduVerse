const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const auth = require('../middleware/auth');

router.get('/', auth, sessionController.getSessionStatus);
router.post('/toggle', auth, sessionController.toggleSession);

module.exports = router;
