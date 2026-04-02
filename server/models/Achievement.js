const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Achievement = sequelize.define('Achievement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('leetcode', 'certification', 'hackathon', 'internship', 'publication', 'award', 'other'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  issuer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dateAchieved: {
    type: DataTypes.DATE,
    allowNull: true
  },
  proofUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true,
  tableName: 'achievements'
});

module.exports = Achievement;
