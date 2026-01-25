const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  groupId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'group_id'
  },
  paidBy: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'paid_by'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM(
      'water',
      'electricity',
      'gas',
      'home_insurance',
      'other'
    ),
    defaultValue: 'other'
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  splitType: {
    type: DataTypes.ENUM('equal', 'percentage', 'exact'),
    defaultValue: 'equal',
    field: 'split_type'
  }
}, {
  tableName: 'expenses'
});

module.exports = Expense;
