import { create } from 'zustand';
import api from '../lib/api';

const useEnquiryStore = create((set, get) => ({
  enquiries: [],
  currentEnquiry: null,
  stats: null,
  pagination: null,
  loading: false,
  error: null,

  fetchEnquiries: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/enquiries', { params });
      set({ enquiries: data.enquiries, pagination: data.pagination, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message, loading: false });
    }
  },

  fetchEnquiryById: async (id) => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/enquiries/${id}`);
      set({ currentEnquiry: data.enquiry, loading: false });
      return data.enquiry;
    } catch (error) {
      set({ error: error.response?.data?.message, loading: false });
    }
  },

  createEnquiry: async (enquiryData) => {
    const { data } = await api.post('/enquiries', enquiryData);
    set((state) => ({ enquiries: [data.enquiry, ...state.enquiries] }));
    return data.enquiry;
  },

  updateEnquiry: async (id, updates) => {
    const { data } = await api.put(`/enquiries/${id}`, updates);
    set((state) => ({
      enquiries: state.enquiries.map((e) => (e._id === id ? data.enquiry : e)),
      currentEnquiry: data.enquiry,
    }));
    return data.enquiry;
  },

  updateStatus: async (id, status) => {
    const { data } = await api.patch(`/enquiries/${id}/status`, { status });
    set((state) => ({
      enquiries: state.enquiries.map((e) => (e._id === id ? data.enquiry : e)),
      currentEnquiry: data.enquiry,
    }));
  },

  addNote: async (id, text) => {
    const { data } = await api.post(`/enquiries/${id}/notes`, { text });
    set({ currentEnquiry: data.enquiry });
  },

  convertToStudent: async (id, section) => {
    const { data } = await api.post(`/enquiries/${id}/convert`, { section });
    set((state) => ({
      enquiries: state.enquiries.map((e) => (e._id === id ? data.enquiry : e)),
      currentEnquiry: data.enquiry,
    }));
    return data.student;
  },

  deleteEnquiry: async (id) => {
    await api.delete(`/enquiries/${id}`);
    set((state) => ({ enquiries: state.enquiries.filter((e) => e._id !== id) }));
  },

  fetchStats: async () => {
    const { data } = await api.get('/enquiries/stats');
    set({ stats: data });
  },
}));

export default useEnquiryStore;
