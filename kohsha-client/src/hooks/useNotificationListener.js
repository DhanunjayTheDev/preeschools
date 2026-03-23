import { useEffect, useState, useRef, useCallback } from 'react';
import api from '../lib/api';
import { playNotificationSound } from '../lib/notificationSound';

export const useNotificationListener = (enabled = true, onNewNotification = null, pollInterval = 3000) => {
  const [newNotifications, setNewNotifications] = useState([]);
  const [isListening, setIsListening] = useState(enabled);
  const lastNotificationIdRef = useRef(null);
  const pollTimerRef = useRef(null);

  const fetchAndCheckNotifications = useCallback(async () => {
    try {
      const { data } = await api.get('/notifications', { params: { limit: 20, page: 1, unreadOnly: 'false' } });
      
      if (!data || !data.notifications) {
        console.error('❌ Invalid API response:', data);
        return;
      }
      
      console.log('📬 API Response:', {
        total: data.notifications.length,
        latest: data.notifications[0]?.title,
        timestamp: new Date().toISOString(),
      });

      if (data.notifications.length === 0) {
        if (!lastNotificationIdRef.current) {
          console.log('📬 First fetch - no notifications yet, setting marker');
          lastNotificationIdRef.current = 'NO_INITIAL';
        }
        return;
      }

      const latest = data.notifications[0]; // Most recent first

      // Initialize on first check
      if (!lastNotificationIdRef.current) {
        lastNotificationIdRef.current = latest._id;
        console.log('✅ First fetch - initialized, latest notification:', latest._id, latest.title);
        return;
      }

      // Check if latest is new compared to what we tracked
      if (latest._id !== lastNotificationIdRef.current) {
        console.log('🔔 NEW NOTIFICATION S! Latest ID changed from', lastNotificationIdRef.current, 'to', latest._id);
        
        // Find all notifications that are newer than what we last saw
        const oldNotifIndex = data.notifications.findIndex(
          (n) => n._id === lastNotificationIdRef.current
        );

        const newNotifs = oldNotifIndex === -1 
          ? [latest] // If old not found, just latest is new
          : data.notifications.slice(0, oldNotifIndex);

        if (newNotifs.length > 0) {
          console.log(`🎉 Found ${newNotifs.length} new notification(s):`, newNotifs.map(n => ({ title: n.title, id: n._id })));
          lastNotificationIdRef.current = latest._id;

          // Play sound and trigger callback
          playNotificationSound();
          newNotifs.reverse().forEach((notif) => {
            if (onNewNotification) {
              console.log('📢 Triggering onNewNotification callback:', notif.title);
              onNewNotification(notif);
            }
          });
        }
      } else {
        console.log('📬 No new notifications (latest ID unchanged)');
      }
    } catch (error) {
      console.error('❌ Error checking notifications:', error?.response?.data || error?.message);
    }
  }, [onNewNotification]);

  useEffect(() => {
    if (!enabled) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    
    // Initial check
    fetchAndCheckNotifications();

    // Set up polling (reduced to 3 seconds for better real-time feel)
    pollTimerRef.current = setInterval(fetchAndCheckNotifications, pollInterval);

    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, [enabled, pollInterval, fetchAndCheckNotifications]);

  const removeNotification = useCallback((notificationId) => {
    setNewNotifications((prev) => prev.filter((n) => n._id !== notificationId));
  }, []);

  return {
    newNotifications,
    isListening,
    removeNotification,
    refetch: fetchAndCheckNotifications,
  };
};
