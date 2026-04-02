const sequelize = require('../config/database');
const User = require('./User');
const Course = require('./Course');
const Class = require('./Class');
const Assignment = require('./Assignment');
const Submission = require('./Submission');
const Exam = require('./Exam');
const Schedule = require('./Schedule');
const Finance = require('./Finance');
const OdRequest = require('./OdRequest');
const Announcement = require('./Announcement');
const Grade = require('./Grade');
const Resource = require('./Resource');
const Project = require('./Project');
const ProjectMember = require('./ProjectMember');
const Achievement = require('./Achievement');
const LeetcodeStats = require('./LeetcodeStats');
const CalendarEvent = require('./CalendarEvent');
const LeaveRequest = require('./LeaveRequest');

// ═══ Existing Associations ═══

// User - Course (Teacher teaches courses)
User.hasMany(Course, { foreignKey: 'teacherId', as: 'taughtCourses' });
Course.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

// Course - Class
Course.hasMany(Class, { foreignKey: 'courseId', as: 'classes' });
Class.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// User - Class (Teacher owns class)
User.hasMany(Class, { foreignKey: 'teacherId', as: 'taughtClasses' });
Class.belongsTo(User, { foreignKey: 'teacherId', as: 'teacher' });

// Course - Assignment
Course.hasMany(Assignment, { foreignKey: 'courseId', as: 'assignments' });
Assignment.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Class - Assignment
Class.hasMany(Assignment, { foreignKey: 'classId', as: 'assignments' });
Assignment.belongsTo(Class, { foreignKey: 'classId', as: 'class' });

// Assignment - Submission
Assignment.hasMany(Submission, { foreignKey: 'assignmentId', as: 'submissions' });
Submission.belongsTo(Assignment, { foreignKey: 'assignmentId', as: 'assignment' });

// User - Submission (Student submits)
User.hasMany(Submission, { foreignKey: 'studentId', as: 'submissions' });
Submission.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// Course - Exam
Course.hasMany(Exam, { foreignKey: 'courseId', as: 'exams' });
Exam.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// User - Schedule
User.hasMany(Schedule, { foreignKey: 'userId', as: 'schedules' });
Schedule.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Course - Schedule
Course.hasMany(Schedule, { foreignKey: 'courseId', as: 'schedules' });
Schedule.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// User - Finance
User.hasMany(Finance, { foreignKey: 'studentId', as: 'finances' });
Finance.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// User - OdRequest
User.hasMany(OdRequest, { foreignKey: 'studentId', as: 'odRequests' });
OdRequest.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// User - Announcement
User.hasMany(Announcement, { foreignKey: 'authorId', as: 'announcements' });
Announcement.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// User - Grade
User.hasMany(Grade, { foreignKey: 'studentId', as: 'grades' });
Grade.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

// Course - Grade
Course.hasMany(Grade, { foreignKey: 'courseId', as: 'grades' });
Grade.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// Course - Resource
Course.hasMany(Resource, { foreignKey: 'courseId', as: 'resources' });
Resource.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// User - Resource
User.hasMany(Resource, { foreignKey: 'uploadedBy', as: 'uploadedResources' });
Resource.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

// ═══ New Associations ═══

// User - Project (owner)
User.hasMany(Project, { foreignKey: 'ownerId', as: 'ownedProjects' });
Project.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

// Project - ProjectMember
Project.hasMany(ProjectMember, { foreignKey: 'projectId', as: 'members' });
ProjectMember.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

// User - ProjectMember
User.hasMany(ProjectMember, { foreignKey: 'userId', as: 'projectMemberships' });
ProjectMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - Achievement
User.hasMany(Achievement, { foreignKey: 'userId', as: 'achievements' });
Achievement.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - LeetcodeStats
User.hasOne(LeetcodeStats, { foreignKey: 'userId', as: 'leetcodeStats' });
LeetcodeStats.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User - CalendarEvent
User.hasMany(CalendarEvent, { foreignKey: 'createdBy', as: 'calendarEvents' });
CalendarEvent.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Course - CalendarEvent
Course.hasMany(CalendarEvent, { foreignKey: 'courseId', as: 'calendarEvents' });
CalendarEvent.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });

// User - LeaveRequest
User.hasMany(LeaveRequest, { foreignKey: 'studentId', as: 'leaveRequests' });
LeaveRequest.belongsTo(User, { foreignKey: 'studentId', as: 'student' });

module.exports = {
  sequelize,
  User,
  Course,
  Class,
  Assignment,
  Submission,
  Exam,
  Schedule,
  Finance,
  OdRequest,
  Announcement,
  Grade,
  Resource,
  Project,
  ProjectMember,
  Achievement,
  LeetcodeStats,
  CalendarEvent,
  LeaveRequest
};
