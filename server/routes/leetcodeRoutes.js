const router = require('express').Router();
const leetcodeController = require('../controllers/leetcodeController');
const auth = require('../middleware/auth');

router.get('/my', auth, leetcodeController.getMyStats);
router.get('/user/:userId', auth, leetcodeController.getStatsForUser);
router.post('/refresh', auth, leetcodeController.refresh);

module.exports = router;
