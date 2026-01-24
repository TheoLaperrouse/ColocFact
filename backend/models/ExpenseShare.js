const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ExpenseShare = sequelize.define('ExpenseShare', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  expenseId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'expense_id'
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'expense_shares',
  indexes: [
    {
      unique: true,
      fields: ['expense_id', 'user_id']
    }
  ]
});

module.exports = ExpenseShare;
