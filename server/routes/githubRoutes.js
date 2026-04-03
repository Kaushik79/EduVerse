const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');
const auth = require('../middleware/auth');

router.get('/repos', auth, githubController.getRepos);
router.post('/analyze-commits', auth, githubController.analyzeCommits);

module.exports = router;
