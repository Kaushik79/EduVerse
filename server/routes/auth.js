const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/profile', auth, authController.getProfile);
router.get('/github', authController.githubLogin);
router.get('/github/callback', authController.githubCallback);

module.exports = router;
