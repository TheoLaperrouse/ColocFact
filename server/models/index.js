const { sequelize } = require('../config/database');
const User = require('./User');
const Group = require('./Group');
const GroupMember = require('./GroupMember');
const Expense = require('./Expense');
const ExpenseShare = require('./ExpenseShare');
const Payment = require('./Payment');
const Notification = require('./Notification');

// User - Group (Many-to-Many through GroupMember)
User.belongsToMany(Group, {
  through: GroupMember,
  foreignKey: 'userId',
  otherKey: 'groupId',
  as: 'groups'
});

Group.belongsToMany(User, {
  through: GroupMember,
  foreignKey: 'groupId',
  otherKey: 'userId',
  as: 'members'
});

// GroupMember associations
GroupMember.belongsTo(User, { foreignKey: 'userId', as: 'user' });
GroupMember.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });
User.hasMany(GroupMember, { foreignKey: 'userId', as: 'memberships' });
Group.hasMany(GroupMember, { foreignKey: 'groupId', as: 'memberships' });

// Group - Creator
Group.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Expense associations
Expense.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });
Group.hasMany(Expense, { foreignKey: 'groupId', as: 'expenses' });

Expense.belongsTo(User, { foreignKey: 'paidBy', as: 'payer' });
User.hasMany(Expense, { foreignKey: 'paidBy', as: 'paidExpenses' });

// ExpenseShare associations
ExpenseShare.belongsTo(Expense, { foreignKey: 'expenseId', as: 'expense' });
Expense.hasMany(ExpenseShare, { foreignKey: 'expenseId', as: 'shares' });

ExpenseShare.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(ExpenseShare, { foreignKey: 'userId', as: 'expenseShares' });

// Payment associations
Payment.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });
Group.hasMany(Payment, { foreignKey: 'groupId', as: 'payments' });

Payment.belongsTo(User, { foreignKey: 'fromUser', as: 'sender' });
Payment.belongsTo(User, { foreignKey: 'toUser', as: 'receiver' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });

module.exports = {
  sequelize,
  User,
  Group,
  GroupMember,
  Expense,
  ExpenseShare,
  Payment,
  Notification
};
