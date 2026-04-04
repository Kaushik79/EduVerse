const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const auth = require('../middleware/auth');

router.post('/generate', auth, testController.generateTest);
router.post('/submit', auth, testController.submitTest);

module.exports = router;
