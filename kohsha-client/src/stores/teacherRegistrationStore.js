import { create } from 'zustand';
import api from '../lib/api';

const useTeacherRegistrationStore = create((set) => ({
  registrations: [],
  currentRegistration: null,
  stats: null,
  pagination: null,
  loading: false,
  error: null,

  fetchRegistrations: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/teacher-registrations', { params });
      set({ registrations: data.registrations, pagination: data.pagination, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, loading: false });
    }
  },

  fetchRegistrationById: async (id) => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/teacher-registrations/${id}`);
      set({ currentRegistration: data.registration, loading: false });
      return data.registration;
    } catch (error) {
      set({ error: error.response?.data?.message, loading: false });
    }
  },

  createRegistration: async (regData) => {
    const { data } = await api.post('/teacher-registrations', regData);
    set((state) => ({ registrations: [data.registration, ...state.registrations] }));
    return data.registration;
  },

  updateRegistration: async (id, updates) => {
    const { data } = await api.put(`/teacher-registrations/${id}`, updates);
    set((state) => ({
      registrations: state.registrations.map((r) => (r._id === id ? data.registration : r)),
      currentRegistration: data.registration,
    }));
    return data.registration;
  },

  updateStatus: async (id, status) => {
    const { data } = await api.patch(`/teacher-registrations/${id}/status`, { status });
    set((state) => ({
      registrations: state.registrations.map((r) => (r._id === id ? data.registration : r)),
      currentRegistration: data.registration,
    }));
  },

  addNote: async (id, text) => {
    const { data } = await api.post(`/teacher-registrations/${id}/notes`, { text });
    set((state) => ({
      registrations: state.registrations.map((r) => (r._id === id ? data.registration : r)),
      currentRegistration: data.registration,
    }));
  },

  deleteRegistration: async (id) => {
    await api.delete(`/teacher-registrations/${id}`);
    set((state) => ({
      registrations: state.registrations.filter((r) => r._id !== id),
    }));
  },

  fetchStats: async () => {
    try {
      const { data } = await api.get('/teacher-registrations/stats');
      set({ stats: data });
    } catch (error) {
      set({ error: error.response?.data?.message });
    }
  },
}));

export default useTeacherRegistrationStore;
