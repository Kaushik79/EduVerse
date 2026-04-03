const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

router.get('/my', auth, async (req, res) => {
    try {
        const { Grade, Course } = require('../models');
        const grades = await Grade.findAll({
            where: { studentId: req.user.id },
            include: [{ model: Course, as: 'course', attributes: ['id', 'name', 'code'] }]
        });
        res.json(grades);
    } catch (e) { res.status(500).json({ message: e.message }); }
});
router.get('/', auth, gradeController.getAll);
router.post('/', auth, roleCheck('teacher', 'admin'), gradeController.create);
router.put('/:id', auth, roleCheck('teacher', 'admin'), gradeController.update);
router.delete('/:id', auth, roleCheck('admin'), gradeController.delete);

module.exports = router;
