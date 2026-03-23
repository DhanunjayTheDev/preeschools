import { create } from 'zustand';
import api from '../lib/api';

const useCalendarStore = create((set) => ({
  events: [],
  holidays: [],
  loading: false,

  fetchEvents: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/calendar', { params });
      set({ events: data.events, loading: false });
    } catch { set({ loading: false }); }
  },

  fetchHolidays: async (params = {}) => {
    try {
      const { data } = await api.get('/calendar/holidays', { params });
      set({ holidays: data.holidays });
    } catch (error) {
      console.error('Failed to fetch holidays:', error);
    }
  },

  // Fetch events with holidays for a specific month/year
  // Backend already merges system holidays into /calendar response — no need for a second request
  fetchEventsWithHolidays: async (month, year) => {
    set({ loading: true });
    try {
      console.log(`📅 Fetching calendar events for ${month}/${year}...`);
      const { data } = await api.get('/calendar', { params: { month, year } });
      console.log(`✓ Fetched ${data.events?.length || 0} events`);
      set({ events: data.events, loading: false });
    } catch (error) {
      console.error('❌ Failed to fetch events:', error.response?.status, error.message);
      set({ loading: false });
    }
  },

  createEvent: async (eventData) => {
    const { data } = await api.post('/calendar', eventData);
    set((state) => ({ events: [...state.events, data.event] }));
    return data.event;
  },

  updateEvent: async (id, updates) => {
    const { data } = await api.put(`/calendar/${id}`, updates);
    set((state) => ({
      events: state.events.map((e) => (e._id === id ? data.event : e)),
    }));
  },

  deleteEvent: async (id) => {
    await api.delete(`/calendar/${id}`);
    set((state) => ({ events: state.events.filter((e) => e._id !== id) }));
  },
}));

export default useCalendarStore;
