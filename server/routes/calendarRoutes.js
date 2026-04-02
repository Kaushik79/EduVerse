const router = require('express').Router();
const calendarController = require('../controllers/calendarController');
const auth = require('../middleware/auth');

router.get('/', auth, calendarController.getEvents);
router.post('/', auth, calendarController.create);
router.delete('/:id', auth, calendarController.delete);

module.exports = router;
