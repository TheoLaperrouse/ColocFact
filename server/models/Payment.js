const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
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
  fromUser: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'from_user'
  },
  toUser: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'to_user'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'rejected'),
    defaultValue: 'pending'
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'payments'
});

module.exports = Payment;
