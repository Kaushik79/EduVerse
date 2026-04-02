const express = require('express');
const router = express.Router();
const odRequestController = require('../controllers/odRequestController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, odRequestController.getAll);
router.post('/', auth, roleCheck('student'), odRequestController.create);
router.patch('/:id/approve', auth, roleCheck('teacher', 'admin'), odRequestController.approve);
router.patch('/:id/reject', auth, roleCheck('teacher', 'admin'), odRequestController.reject);
router.delete('/:id', auth, odRequestController.delete);

module.exports = router;
