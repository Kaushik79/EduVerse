const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Exam = sequelize.define('Exam', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in minutes'
  },
  type: {
    type: DataTypes.ENUM('midterm', 'final', 'quiz', 'practical'),
    defaultValue: 'midterm'
  },
  totalMarks: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  venue: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'exams'
});

module.exports = Exam;
