const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Announcement = sequelize.define('Announcement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  targetRole: {
    type: DataTypes.ENUM('all', 'student', 'teacher', 'admin', 'alumni'),
    defaultValue: 'all'
  },
  priority: {
    type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
    defaultValue: 'normal'
  }
}, {
  timestamps: true,
  tableName: 'announcements'
});

module.exports = Announcement;
