import { create } from 'zustand';
import api from '../lib/api';

const useAnnouncementStore = create((set) => ({
  announcements: [],
  currentAnnouncement: null,
  pagination: null,
  loading: false,

  fetchAnnouncements: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/announcements', { params });
      set({ announcements: data.announcements, pagination: data.pagination, loading: false });
    } catch { set({ loading: false }); }
  },

  fetchMyAnnouncements: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/announcements/my', { params });
      set({ announcements: data.announcements, pagination: data.pagination, loading: false });
    } catch { set({ loading: false }); }
  },

  fetchById: async (id) => {
    const { data } = await api.get(`/announcements/${id}`);
    set({ currentAnnouncement: data.announcement });
    return data.announcement;
  },

  createAnnouncement: async (announcementData) => {
    const { data } = await api.post('/announcements', announcementData);
    set((state) => ({ announcements: [data.announcement, ...state.announcements] }));
    return data.announcement;
  },

  updateAnnouncement: async (id, updates) => {
    const { data } = await api.put(`/announcements/${id}`, updates);
    set((state) => ({
      announcements: state.announcements.map((a) => (a._id === id ? data.announcement : a)),
    }));
  },

  deleteAnnouncement: async (id) => {
    await api.delete(`/announcements/${id}`);
    set((state) => ({ announcements: state.announcements.filter((a) => a._id !== id) }));
  },

  fetchReadStats: async (id) => {
    const { data } = await api.get(`/announcements/${id}/read-stats`);
    return data;
  },
}));

export default useAnnouncementStore;
