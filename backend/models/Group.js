const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const crypto = require('crypto');

const Group = sequelize.define('Group', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  inviteCode: {
    type: DataTypes.STRING(8),
    unique: true,
    field: 'invite_code'
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'created_by'
  }
}, {
  tableName: 'groups',
  hooks: {
    beforeCreate: (group) => {
      if (!group.inviteCode) {
        group.inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();
      }
    }
  }
});

module.exports = Group;
