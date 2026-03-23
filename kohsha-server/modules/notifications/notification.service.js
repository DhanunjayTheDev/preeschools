const Notification = require('./notification.model');

const getNotifications = async (userId, { page = 1, limit = 20, unreadOnly }) => {
  console.log(`📬 Fetching notifications for user:`, userId, { page, limit, unreadOnly });
  const filter = { user: userId };
  if (unreadOnly === 'true') filter.isRead = false;
  const skip = (Number(page) - 1) * Number(limit);
  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Notification.countDocuments(filter),
    Notification.countDocuments({ user: userId, isRead: false }),
  ]);
  console.log(`✅ Returned ${notifications.length} notifications (total: ${total}, unread: ${unreadCount})`);
  if (notifications.length > 0) {
    console.log('📋 Latest notifications:', notifications.slice(0, 3).map(n => ({ title: n.title, isRead: n.isRead, createdAt: n.createdAt })));
  }
  return {
    notifications,
    unreadCount,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  };
};

const markAsRead = async (notificationId, userId) => {
  await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true, readAt: new Date() }
  );
};

const markAllAsRead = async (userId) => {
  await Notification.updateMany({ user: userId, isRead: false }, { isRead: true, readAt: new Date() });
};

module.exports = { getNotifications, markAsRead, markAllAsRead };
