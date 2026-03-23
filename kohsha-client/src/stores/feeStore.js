import { create } from 'zustand';
import api from '../lib/api';

const useFeeStore = create((set) => ({
  feePlans: [],
  assignments: [],
  payments: [],
  studentFees: [],
  stats: null,
  pagination: null,
  loading: false,

  // Fee Plans
  fetchFeePlans: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/fees/plans', { params });
      set({ feePlans: data.plans, loading: false });
    } catch { set({ loading: false }); }
  },

  createFeePlan: async (planData) => {
    const { data } = await api.post('/fees/plans', planData);
    set((state) => ({ feePlans: [...state.feePlans, data.plan] }));
    return data.plan;
  },

  updateFeePlan: async (id, updates) => {
    const { data } = await api.put(`/fees/plans/${id}`, updates);
    set((state) => ({
      feePlans: state.feePlans.map((p) => (p._id === id ? data.plan : p)),
    }));
  },

  deleteFeePlan: async (id) => {
    await api.delete(`/fees/plans/${id}`);
    set((state) => ({ feePlans: state.feePlans.filter((p) => p._id !== id) }));
  },

  // Fee Assignments
  assignFeePlan: async (studentId, feePlanId) => {
    const { data } = await api.post('/fees/assign', { studentId, feePlanId });
    return data.assignment;
  },

  fetchAssignments: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/fees/assignments', { params });
      set({ assignments: data.assignments, pagination: data.pagination, loading: false });
    } catch { set({ loading: false }); }
  },

  fetchStudentFees: async (studentId) => {
    const { data } = await api.get(`/fees/student/${studentId}`);
    set({ studentFees: data.fees });
    return data.fees;
  },

  fetchMyFees: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get('/fees/my-fees');
      set({ studentFees: data.studentFees, loading: false });
    } catch { set({ loading: false }); }
  },

  // Payments
  recordPayment: async (paymentData) => {
    const { data } = await api.post('/fees/payments', paymentData);
    return data;
  },

  fetchPayments: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await api.get('/fees/payments', { params });
      set({ payments: data.payments, pagination: data.pagination, loading: false });
    } catch { set({ loading: false }); }
  },

  fetchStats: async () => {
    const { data } = await api.get('/fees/stats');
    set({ stats: data });
  },

  fetchStudentPayments: async (studentId) => {
    set({ loading: true });
    try {
      const { data } = await api.get(`/fees/payments/student/${studentId}`);
      set({ payments: data.payments, loading: false });
      return data.payments;
    } catch { set({ loading: false }); }
  },

  downloadReceipt: async (paymentId) => {
    const response = await api.get(`/fees/payments/${paymentId}/receipt`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `receipt-${paymentId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
}));

export default useFeeStore;
