const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, classController.getAll);
router.get('/:id', auth, classController.getById);
router.post('/', auth, roleCheck('admin', 'teacher'), classController.create);
router.put('/:id', auth, roleCheck('admin', 'teacher'), classController.update);
router.delete('/:id', auth, roleCheck('admin'), classController.delete);

module.exports = router;
