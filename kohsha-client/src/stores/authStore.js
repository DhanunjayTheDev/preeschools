import { create } from 'zustand';
import api from '../lib/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('kohsha_user') || 'null'),
  token: localStorage.getItem('kohsha_token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('kohsha_token', data.token);
      localStorage.setItem('kohsha_user', JSON.stringify(data.user));
      set({ user: data.user, token: data.token, loading: false });
      return data.user;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  logout: () => {
    localStorage.removeItem('kohsha_token');
    localStorage.removeItem('kohsha_user');
    set({ user: null, token: null });
  },

  fetchProfile: async () => {
    try {
      const { data } = await api.get('/auth/profile');
      localStorage.setItem('kohsha_user', JSON.stringify(data.user));
      set({ user: data.user });
    } catch {
      get().logout();
    }
  },

  updateProfile: async (updates) => {
    const { data } = await api.put('/auth/profile', updates);
    localStorage.setItem('kohsha_user', JSON.stringify(data.user));
    set({ user: data.user });
  },

  changePassword: async (currentPassword, newPassword) => {
    await api.put('/auth/change-password', { currentPassword, newPassword });
  },

  isAdmin: () => {
    const { user } = get();
    return user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  },

  isTeacher: () => get().user?.role === 'TEACHER',
  isParent: () => get().user?.role === 'PARENT',
}));

export default useAuthStore;
