const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeetcodeStats = sequelize.define('LeetcodeStats', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  totalSolved: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  easySolved: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  mediumSolved: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  hardSolved: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalEasy: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalMedium: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalHard: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ranking: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  streak: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastFetched: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'leetcode_stats'
});

module.exports = LeetcodeStats;
