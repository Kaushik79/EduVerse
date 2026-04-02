const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, resourceController.getAll);
router.post('/', auth, roleCheck('teacher', 'admin'), resourceController.create);
router.put('/:id', auth, roleCheck('teacher', 'admin'), resourceController.update);
router.delete('/:id', auth, roleCheck('teacher', 'admin'), resourceController.delete);

module.exports = router;
