const express = require('express');
const router = express.Router();
const financeController = require('../controllers/financeController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/', auth, financeController.getAll);
router.get('/:id', auth, financeController.getById);
router.post('/', auth, roleCheck('admin'), financeController.create);
router.put('/:id', auth, roleCheck('admin'), financeController.update);
router.delete('/:id', auth, roleCheck('admin'), financeController.delete);

module.exports = router;
