const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Test = sequelize.define('Test', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  repoName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  challengeType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  challengeData: {
    type: DataTypes.JSON,
    allowNull: false
  },
  studentAnswer: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'COMPLETED'),
    allowNull: false,
    defaultValue: 'PENDING'
  }
}, {
  timestamps: true,
  tableName: 'tests'
});

module.exports = Test;
