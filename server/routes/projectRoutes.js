const router = require('express').Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

router.get('/', auth, projectController.getAll);
router.get('/my', auth, projectController.getMyProjects);
router.post('/', auth, projectController.create);
router.post('/:projectId/join', auth, projectController.join);
router.put('/members/:memberId/approve', auth, projectController.approveMember);

module.exports = router;
