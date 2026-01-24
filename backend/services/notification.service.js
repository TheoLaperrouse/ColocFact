const webPush = require('web-push');
const nodemailer = require('nodemailer');
const { Notification, User } = require('../models');

// Configure web-push (only if VAPID keys are set)
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webPush.setVapidDetails(
    process.env.VAPID_EMAIL || 'mailto:admin@coloc-factures.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// Configure nodemailer (only if SMTP is configured)
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

/**
 * Create a notification for a user
 */
const createNotification = async (userId, type, title, message, data = null) => {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      data
    });

    // Try to send push notification
    await sendPushNotification(userId, { title, body: message, data });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

/**
 * Send push notification to a user
 */
const sendPushNotification = async (userId, payload) => {
  try {
    const user = await User.findByPk(userId);
    if (!user || !user.pushSubscription) return;

    const subscription = JSON.parse(user.pushSubscription);

    await webPush.sendNotification(
      subscription,
      JSON.stringify({
        title: payload.title,
        body: payload.body,
        icon: '/icon-192x192.png',
        badge: '/badge.png',
        data: payload.data
      })
    );
  } catch (error) {
    // Handle expired subscriptions
    if (error.statusCode === 410) {
      const user = await User.findByPk(userId);
      if (user) {
        await user.update({ pushSubscription: null });
      }
    }
    console.error('Push notification error:', error.message);
  }
};

/**
 * Send email notification
 */
const sendEmailNotification = async (to, subject, html) => {
  if (!transporter) {
    console.log('Email transport not configured');
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@coloc-factures.com',
      to,
      subject,
      html
    });
  } catch (error) {
    console.error('Email notification error:', error);
  }
};

/**
 * Notify group members about a new expense
 */
const notifyNewExpense = async (expense, payer, shares) => {
  for (const share of shares) {
    if (share.userId !== payer.id) {
      await createNotification(
        share.userId,
        'expense_added',
        'New Expense Added',
        `${payer.firstName} added "${expense.description}" for ${expense.amount}€. Your share: ${share.amount}€`,
        { expenseId: expense.id, groupId: expense.groupId }
      );
    }
  }
};

/**
 * Notify user about a payment received
 */
const notifyPaymentReceived = async (payment, sender) => {
  await createNotification(
    payment.toUser,
    'payment_received',
    'Payment Received',
    `${sender.firstName} sent you a payment of ${payment.amount}€`,
    { paymentId: payment.id, groupId: payment.groupId }
  );
};

/**
 * Notify user about a payment request (when payment needs confirmation)
 */
const notifyPaymentRequest = async (payment, sender) => {
  await createNotification(
    payment.toUser,
    'payment_request',
    'Payment Pending Confirmation',
    `${sender.firstName} recorded a payment of ${payment.amount}€ to you. Please confirm.`,
    { paymentId: payment.id, groupId: payment.groupId }
  );
};

/**
 * Send reminder notification
 */
const sendReminder = async (userId, groupId, amount, creditor) => {
  await createNotification(
    userId,
    'reminder',
    'Payment Reminder',
    `You owe ${creditor.firstName} ${amount}€. Don't forget to settle up!`,
    { groupId }
  );
};

module.exports = {
  createNotification,
  sendPushNotification,
  sendEmailNotification,
  notifyNewExpense,
  notifyPaymentReceived,
  notifyPaymentRequest,
  sendReminder
};
