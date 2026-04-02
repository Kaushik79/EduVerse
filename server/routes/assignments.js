const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, assignmentController.getAll);
router.get('/:id', auth, assignmentController.getById);
router.post('/', auth, roleCheck('teacher', 'admin'), assignmentController.create);
router.put('/:id', auth, roleCheck('teacher', 'admin'), assignmentController.update);
router.delete('/:id', auth, roleCheck('teacher', 'admin'), assignmentController.delete);
router.post('/:id/submit', auth, roleCheck('student'), assignmentController.submit);
router.patch('/:id/submissions/:submissionId/grade', auth, roleCheck('teacher'), assignmentController.grade);

module.exports = router;
