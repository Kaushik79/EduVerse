const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Finance = sequelize.define('Finance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('tuition', 'fee', 'scholarship', 'fine', 'refund'),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  paidDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'overdue', 'waived'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true,
  tableName: 'finances'
});

module.exports = Finance;
