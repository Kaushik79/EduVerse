const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, userController.getAll);
router.get('/:id', auth, userController.getById);
router.put('/:id', auth, userController.update);
router.delete('/:id', auth, roleCheck('admin'), userController.delete);
router.patch('/:id/verify', auth, roleCheck('admin'), userController.verify);

module.exports = router;
