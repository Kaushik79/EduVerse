const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, courseController.getAll);
router.get('/:id', auth, courseController.getById);
router.post('/', auth, roleCheck('admin', 'teacher'), courseController.create);
router.put('/:id', auth, roleCheck('admin', 'teacher'), courseController.update);
router.delete('/:id', auth, roleCheck('admin'), courseController.delete);

module.exports = router;
