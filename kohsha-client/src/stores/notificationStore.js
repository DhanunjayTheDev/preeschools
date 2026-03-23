import { create } from 'zustand';
import api from '../lib/api';

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async (params = {}) => {
    set({ loading: true });
    try {
      const queryParams = { ...params, unreadOnly: params.unreadOnly ?? 'false' };
      const { data } = await api.get('/notifications', { params: queryParams });
      set({ notifications: data.notifications, unreadCount: data.unreadCount, loading: false });
    } catch { set({ loading: false }); }
  },

  markAsRead: async (id) => {
    await api.patch(`/notifications/${id}/read`);
    set((state) => ({
      notifications: state.notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: async () => {
    await api.patch('/notifications/read-all');
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },
}));

export default useNotificationStore;
