import { create } from 'zustand';
import api from '../lib/api';

const useActivityStore = create((set) => ({
  activities: [],
  currentActivity: null,
  pagination: null,
  loading: false,

  fetchActivities: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/activities', { params });
      set({ activities: data.activities, pagination: data.pagination, loading: false });
    } catch { set({ loading: false }); }
  },

  fetchMyActivities: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/activities/my', { params });
      set({ activities: data.activities, pagination: data.pagination, loading: false });
    } catch { set({ loading: false }); }
  },

  fetchParentActivities: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/activities/parent', { params });
      set({ activities: data.activities, pagination: data.pagination, loading: false });
    } catch { set({ loading: false }); }
  },

  fetchById: async (id) => {
    const { data } = await api.get(`/activities/${id}`);
    set({ currentActivity: data.activity });
    return data.activity;
  },

  createActivity: async (activityData) => {
    const { data } = await api.post('/activities', activityData);
    set((state) => ({ activities: [data.activity, ...state.activities] }));
    return data.activity;
  },

  updateActivity: async (id, updates) => {
    const { data } = await api.put(`/activities/${id}`, updates);
    set((state) => ({
      activities: state.activities.map((a) => (a._id === id ? data.activity : a)),
    }));
  },

  deleteActivity: async (id) => {
    await api.delete(`/activities/${id}`);
    set((state) => ({ activities: state.activities.filter((a) => a._id !== id) }));
  },

  addSubmission: async (activityId, submissionData) => {
    const { data } = await api.post(`/activities/${activityId}/submissions`, submissionData);
    set({ currentActivity: data.activity });
  },
}));

export default useActivityStore;
