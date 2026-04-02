const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Submission = sequelize.define('Submission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  assignmentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  grade: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('submitted', 'graded', 'pending', 'late'),
    defaultValue: 'submitted'
  },
  submittedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  tableName: 'submissions'
});

module.exports = Submission;
