const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CalendarEvent = sequelize.define('CalendarEvent', {
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
  type: {
    type: DataTypes.ENUM('assignment', 'exam', 'club', 'academic', 'holiday', 'event', 'deadline'),
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  allDay: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'calendar_events'
});

module.exports = CalendarEvent;
