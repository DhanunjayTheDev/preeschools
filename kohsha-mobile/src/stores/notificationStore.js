import { create } from 'zustand';
import api from '../lib/api';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  pagination: null,

  fetchNotifications: async (page = 1, unreadOnly = false) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/notifications', {
        params: { page, limit: 20, unreadOnly },
      });
      if (page === 1) {
        set({
          notifications: data.notifications,
          unreadCount: data.unreadCount,
          pagination: data.pagination,
          loading: false,
        });
      } else {
        set((state) => ({
          notifications: [...state.notifications, ...data.notifications],
          unreadCount: data.unreadCount,
          pagination: data.pagination,
          loading: false,
        }));
      }
    } catch {
      set({ loading: false });
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {
      // Silent fail
    }
  },

  markAllAsRead: async () => {
    try {
      await api.patch('/notifications/read-all');
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          isRead: true,
          readAt: new Date(),
        })),
        unreadCount: 0,
      }));
    } catch {
      // Silent fail
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  reset: () => set({ notifications: [], unreadCount: 0, pagination: null }),
}));

export default useNotificationStore;
