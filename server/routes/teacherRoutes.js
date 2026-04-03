const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const auth = require('../middleware/auth');

router.get('/leaderboard', auth, teacherController.getLeaderboard);

module.exports = router;
