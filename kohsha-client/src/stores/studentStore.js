import { create } from 'zustand';
import api from '../lib/api';

const useStudentStore = create((set) => ({
  students: [],
  currentStudent: null,
  stats: null,
  pagination: null,
  loading: false,

  fetchStudents: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/students', { params });
      set({ students: data.students, pagination: data.pagination, loading: false });
    } catch { set({ loading: false }); }
  },

  fetchStudentById: async (id) => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/students/${id}`);
      set({ currentStudent: data.student, loading: false });
      return data.student;
    } catch { set({ loading: false }); }
  },

  createStudent: async (studentData) => {
    const { data } = await api.post('/students', studentData);
    set((state) => ({ students: [data.student, ...state.students] }));
    return data.student;
  },

  updateStudent: async (id, updates) => {
    const { data } = await api.put(`/students/${id}`, updates);
    set((state) => ({
      students: state.students.map((s) => (s._id === id ? data.student : s)),
      currentStudent: data.student,
    }));
    return data.student;
  },

  deleteStudent: async (id) => {
    await api.delete(`/students/${id}`);
    set((state) => ({ students: state.students.filter((s) => s._id !== id) }));
  },

  fetchMyChildren: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/students/my-children');
      set({ students: data.students, loading: false });
    } catch { set({ loading: false }); }
  },

  fetchStats: async () => {
    const { data } = await api.get('/students/stats');
    set({ stats: data });
  },
}));

export default useStudentStore;
