const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, announcementController.getAll);
router.post('/', auth, roleCheck('teacher', 'admin'), announcementController.create);
router.put('/:id', auth, roleCheck('teacher', 'admin'), announcementController.update);
router.delete('/:id', auth, roleCheck('teacher', 'admin'), announcementController.delete);

module.exports = router;
