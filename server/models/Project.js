const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
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
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('recruiting', 'in_progress', 'completed'),
    defaultValue: 'recruiting'
  },
  type: {
    type: DataTypes.ENUM('hackathon', 'academic', 'personal', 'club', 'senior_project'),
    defaultValue: 'personal'
  },
  techStack: {
    type: DataTypes.TEXT, // JSON array
    allowNull: true
  },
  maxMembers: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  repoUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'projects'
});

module.exports = Project;
