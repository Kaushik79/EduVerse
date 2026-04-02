const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Grade = sequelize.define('Grade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  grade: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Letter grade (A, B, C, etc.)'
  },
  gradePoints: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  semester: {
    type: DataTypes.STRING,
    allowNull: true
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'grades'
});

module.exports = Grade;
