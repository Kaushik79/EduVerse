const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  section: {
    type: DataTypes.STRING,
    allowNull: true
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  teacherId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  studentCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  tableName: 'classes'
});

module.exports = Class;
