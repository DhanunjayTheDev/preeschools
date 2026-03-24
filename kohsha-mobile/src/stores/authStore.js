import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../lib/api';

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loading: true,
  error: null,

  initialize: async () => {
    try {
      const [token, userStr] = await AsyncStorage.multiGet([
        'kohsha_token',
        'kohsha_user',
      ]);
      if (token[1] && userStr[1]) {
        const user = JSON.parse(userStr[1]);
        set({ user, token: token[1], loading: false });
      } else {
        set({ loading: false });
      }
    } catch {
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { user, token } = data;

      // Only allow PARENT and TEACHER roles
      if (user.role !== 'PARENT' && user.role !== 'TEACHER') {
        set({ loading: false, error: 'This app is for parents and teachers only' });
        throw new Error('This app is for parents and teachers only');
      }

      await AsyncStorage.multiSet([
        ['kohsha_token', token],
        ['kohsha_user', JSON.stringify(user)],
      ]);
      set({ user, token, loading: false });
      return user;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Login failed';
      set({ error: msg, loading: false });
      throw new Error(msg);
    }
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['kohsha_token', 'kohsha_user', 'kohsha_push_token']);
    set({ user: null, token: null });
  },

  fetchProfile: async () => {
    try {
      const { data } = await api.get('/auth/profile');
      await AsyncStorage.setItem('kohsha_user', JSON.stringify(data.user));
      set({ user: data.user });
    } catch {
      get().logout();
    }
  },

  updateProfile: async (updates) => {
    const { data } = await api.put('/auth/profile', updates);
    await AsyncStorage.setItem('kohsha_user', JSON.stringify(data.user));
    set({ user: data.user });
    return data.user;
  },

  changePassword: async (currentPassword, newPassword) => {
    await api.put('/auth/change-password', { currentPassword, newPassword });
  },

  isTeacher: () => get().user?.role === 'TEACHER',
  isParent: () => get().user?.role === 'PARENT',

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
