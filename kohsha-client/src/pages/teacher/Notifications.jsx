import { useEffect, useState } from 'react';
import useNotificationStore from '../../stores/notificationStore';
import { Button, Badge, Loading, Modal } from '../../components/ui';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

const NOTIFICATION_TYPES = {
  ANNOUNCEMENT: { icon: '📢', color: 'bg-blue-100 text-blue-700' },
  FEE: { icon: '💳', color: 'bg-orange-100 text-orange-700' },
  ACTIVITY: { icon: '📝', color: 'bg-violet-100 text-violet-700' },
  ENQUIRY: { icon: '❓', color: 'bg-amber-100 text-amber-700' },
  SYSTEM: { icon: '⚙️', color: 'bg-gray-100 text-gray-700' },
};

export default function Notifications() {
  const { notifications, unreadCount, loading, fetchNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    fetchNotifications({ limit: 100 });
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      toast.success('✅ Marked as read');
    } catch (err) {
      toast.error('Failed to mark as read');
    }
  };

  const handleViewNotification = async (notification) => {
    // Mark as read automatically when opening view
    if (!notification.isRead) {
      try {
        await markAsRead(notification._id);
      } catch (err) {
        console.log('Error marking as read:', err);
      }
    }
    setSelectedNotification(notification);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('✅ All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const notificationType = (type) => NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.SYSTEM;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'No unread notifications'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="secondary">
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { value: 'all', label: 'All', count: notifications.length },
          { value: 'unread', label: 'Unread', count: unreadCount },
          { value: 'read', label: 'Read', count: notifications.filter(n => n.isRead).length },
        ].map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              filter === btn.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {btn.label}
            {btn.count > 0 && <span className="ml-2 text-sm">({btn.count})</span>}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loading />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">🔕</div>
          <p className="text-gray-500 mb-1">
            {filter === 'all' ? 'No notifications yet' : `No ${filter} notifications`}
          </p>
          <p className="text-sm text-gray-400">
            {filter === 'unread' && 'Keep up-to-date with all your notifications!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const typeInfo = notificationType(notif.type);
            return (
              <div
                key={notif._id}
                className={`bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-all duration-200 ${
                  notif.isRead ? 'border-gray-100 opacity-75' : 'border-blue-200 bg-blue-50/30'
                }`}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl ${typeInfo.color}`}>
                    {typeInfo.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className={`font-bold text-lg ${notif.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                          {notif.title}
                        </p>
                        <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                          {notif.message}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-xs text-gray-400">
                            {formatDate(notif.createdAt)}
                          </span>
                          <Badge color={notif.isRead ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}>
                            {notif.type}
                          </Badge>
                          {!notif.isRead && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-blue-600 rounded-full" />
                              <span className="text-xs font-medium text-blue-600">New</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {!notif.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notif._id)}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => handleViewNotification(notif)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-center"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Notification Details Modal */}
      <Modal
        isOpen={!!selectedNotification}
        onClose={() => setSelectedNotification(null)}
        title="Notification Details"
        size="lg"
      >
        {selectedNotification && (
          <div className="space-y-5">
            {/* Type Badge */}
            <div className="flex items-center gap-3">
              <div className={`text-3xl ${notificationType(selectedNotification.type).color.replace('text-', 'bg-')}`}>
                {notificationType(selectedNotification.type).icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedNotification.title}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <Badge color={notificationType(selectedNotification.type).color}>
                    {selectedNotification.type}
                  </Badge>
                  <span className="text-sm text-gray-500">{formatDate(selectedNotification.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                {selectedNotification.message}
              </p>
            </div>

            {/* Metadata if available */}
            {selectedNotification.metadata && Object.keys(selectedNotification.metadata).filter(k => k !== 'announcementId').length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-3 text-sm">Additional Information</h3>
                <div className="space-y-2">
                  {Object.entries(selectedNotification.metadata)
                    .filter(([key]) => key !== 'announcementId')
                    .map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start">
                      <span className="text-sm font-medium text-blue-700 capitalize">{key}:</span>
                      <span className="text-sm text-blue-600 text-right">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              {selectedNotification.link && (
                <a
                  href={selectedNotification.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Go to Link →
                </a>
              )}
              <button
                onClick={() => setSelectedNotification(null)}
                className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
