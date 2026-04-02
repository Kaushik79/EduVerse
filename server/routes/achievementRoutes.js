const router = require('express').Router();
const achievementController = require('../controllers/achievementController');
const auth = require('../middleware/auth');

router.get('/my', auth, achievementController.getByUser);
router.get('/user/:userId', auth, achievementController.getByUser);
router.post('/', auth, achievementController.create);
router.delete('/:id', auth, achievementController.delete);

module.exports = router;
