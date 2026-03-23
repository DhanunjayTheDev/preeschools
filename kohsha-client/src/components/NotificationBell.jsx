import { useEffect, useRef, useState } from 'react';
import useNotificationStore from '../stores/notificationStore';
import { formatDate } from '../lib/utils';
import toast from 'react-hot-toast';

const NOTIFICATION_TYPES = {
  ANNOUNCEMENT: { icon: '📢', color: 'bg-blue-100 text-blue-700' },
  FEE: { icon: '💳', color: 'bg-orange-100 text-orange-700' },
  ACTIVITY: { icon: '📝', color: 'bg-violet-100 text-violet-700' },
  ENQUIRY: { icon: '❓', color: 'bg-amber-100 text-amber-700' },
  SYSTEM: { icon: '⚙️', color: 'bg-gray-100 text-gray-700' },
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, loading } = useNotificationStore();

  useEffect(() => {
    fetchNotifications({ limit: 10 });
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications({ limit: 10 });
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await markAsRead(notificationId);
    } catch (err) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      toast.success('All notifications marked as read');
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const notificationType = (type) => NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.SYSTEM;

  return (
    <div ref={wrapperRef} className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
        title="Notifications"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Count Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-[500px] flex flex-col">
          {/* Header */}
          <div className="sticky top-0 px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Notifications</h3>
              {unreadCount > 0 && <p className="text-xs text-gray-500">{unreadCount} unread</p>}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 px-2 py-1 hover:bg-blue-50 rounded transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <svg className="animate-spin h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-3xl mb-2">🔕</div>
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif) => {
                  const typeInfo = notificationType(notif.type);
                  return (
                    <div
                      key={notif._id}
                      onClick={() => !notif.isRead && handleMarkAsRead(notif._id, { stopPropagation: () => {} })}
                      className={`px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer ${
                        notif.isRead ? 'opacity-60' : 'bg-blue-50/30'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-lg ${typeInfo.color}`}>
                          {typeInfo.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`font-semibold text-sm truncate ${notif.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                              {notif.title}
                            </p>
                            {!notif.isRead && (
                              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(notif.createdAt)}
                          </p>
                          {notif.link && (
                            <a
                              href={notif.link}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-1 inline-block"
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                              }}
                            >
                              View →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="sticky bottom-0 px-5 py-3 border-t border-gray-100 bg-white rounded-b-2xl text-center">
              <a
                href="/notifications"
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                View all notifications →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
