const { Expo } = require('expo-server-sdk');
const User = require('../auth/user.model');

const expo = new Expo();

/**
 * Send push notifications to specific users
 * @param {string[]} userIds - Array of user ObjectIds
 * @param {object} notification - { title, body, data }
 */
const sendPushToUsers = async (userIds, { title, body, data = {} }) => {
  try {
    // Get push tokens for these users
    const users = await User.find({
      _id: { $in: userIds },
      'pushTokens.0': { $exists: true },
    }).select('pushTokens');

    const messages = [];

    for (const user of users) {
      for (const tokenObj of user.pushTokens) {
        if (!Expo.isExpoPushToken(tokenObj.token)) {
          console.warn(`Invalid Expo push token: ${tokenObj.token}`);
          continue;
        }

        messages.push({
          to: tokenObj.token,
          sound: 'default',
          title,
          body,
          data: { ...data, userId: user._id.toString() },
          priority: 'high',
          channelId: data.channelId || 'default',
        });
      }
    }

    if (messages.length === 0) return;

    // Send in chunks
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending push notification chunk:', error);
      }
    }

    // Check for errors and remove invalid tokens
    const invalidTokens = [];
    tickets.forEach((ticket, idx) => {
      if (ticket.status === 'error') {
        if (ticket.details?.error === 'DeviceNotRegistered') {
          invalidTokens.push(messages[idx].to);
        }
        console.error(`Push notification error: ${ticket.message}`);
      }
    });

    // Clean up invalid tokens
    if (invalidTokens.length > 0) {
      await User.updateMany(
        { 'pushTokens.token': { $in: invalidTokens } },
        { $pull: { pushTokens: { token: { $in: invalidTokens } } } }
      );
      console.log(`Removed ${invalidTokens.length} invalid push tokens`);
    }

    return tickets;
  } catch (error) {
    console.error('Error in sendPushToUsers:', error);
  }
};

/**
 * Send push notification for an announcement
 */
const sendAnnouncementPush = async (announcement, recipientUserIds) => {
  await sendPushToUsers(recipientUserIds, {
    title: `📢 ${announcement.title}`,
    body: announcement.content?.substring(0, 100) + (announcement.content?.length > 100 ? '...' : ''),
    data: {
      type: 'ANNOUNCEMENT',
      announcementId: announcement._id.toString(),
      channelId: 'announcements',
    },
  });
};

/**
 * Send push notification for fee-related updates
 */
const sendFeePush = async (userIds, { studentName, amount, message }) => {
  await sendPushToUsers(userIds, {
    title: '💰 Fee Update',
    body: message || `Fee update for ${studentName}: ₹${amount}`,
    data: {
      type: 'FEE',
      channelId: 'fees',
    },
  });
};

/**
 * Send push notification for activity updates
 */
const sendActivityPush = async (userIds, { activity, message }) => {
  await sendPushToUsers(userIds, {
    title: `📚 ${activity.type === 'HOMEWORK' ? 'New Homework' : 'New Activity'}`,
    body: message || activity.title,
    data: {
      type: 'ACTIVITY',
      activityId: activity._id.toString(),
      channelId: 'activities',
    },
  });
};

module.exports = {
  sendPushToUsers,
  sendAnnouncementPush,
  sendFeePush,
  sendActivityPush,
};
