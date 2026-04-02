const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, scheduleController.getAll);
router.get('/:id', auth, scheduleController.getById);
router.post('/', auth, roleCheck('admin', 'teacher'), scheduleController.create);
router.put('/:id', auth, roleCheck('admin', 'teacher'), scheduleController.update);
router.delete('/:id', auth, roleCheck('admin'), scheduleController.delete);

module.exports = router;
