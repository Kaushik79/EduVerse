require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const classRoutes = require('./routes/classes');
const assignmentRoutes = require('./routes/assignments');
const examRoutes = require('./routes/exams');
const scheduleRoutes = require('./routes/schedule');
const financeRoutes = require('./routes/finances');
const odRequestRoutes = require('./routes/odRequests');
const announcementRoutes = require('./routes/announcements');
const gradeRoutes = require('./routes/grades');
const resourceRoutes = require('./routes/resources');
const whatsappRoutes = require('./routes/whatsapp');
const projectRoutes = require('./routes/projectRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const leetcodeRoutes = require('./routes/leetcodeRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const githubRoutes = require('./routes/githubRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/finances', financeRoutes);
app.use('/api/od-requests', odRequestRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/leetcode', leetcodeRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/github', githubRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'EduVerse API is running' });
});

const PORT = process.env.PORT || 5000;

// Sync database and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
    // Start server anyway for development
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (without database)`);
    });
  });

module.exports = app;
