const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, examController.getAll);
router.get('/:id', auth, examController.getById);
router.post('/', auth, roleCheck('admin', 'teacher'), examController.create);
router.put('/:id', auth, roleCheck('admin', 'teacher'), examController.update);
router.delete('/:id', auth, roleCheck('admin'), examController.delete);

module.exports = router;
