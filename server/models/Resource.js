const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resource = sequelize.define('Resource', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  uploadedBy: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true,
  tableName: 'resources'
});

module.exports = Resource;
