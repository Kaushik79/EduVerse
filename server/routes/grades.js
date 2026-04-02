const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, gradeController.getAll);
router.post('/', auth, roleCheck('teacher', 'admin'), gradeController.create);
router.put('/:id', auth, roleCheck('teacher', 'admin'), gradeController.update);
router.delete('/:id', auth, roleCheck('admin'), gradeController.delete);

module.exports = router;
