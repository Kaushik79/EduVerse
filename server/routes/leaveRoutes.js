const router = require('express').Router();
const leaveController = require('../controllers/leaveController');
const auth = require('../middleware/auth');

router.get('/', auth, leaveController.getAll);
router.post('/', auth, leaveController.create);
router.put('/:id/status', auth, leaveController.updateStatus);

module.exports = router;
