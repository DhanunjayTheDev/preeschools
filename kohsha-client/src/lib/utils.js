import { clsx } from 'clsx';

export function cn(...inputs) {
  return clsx(inputs);
}

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  PARENT: 'PARENT',
};

export const ENQUIRY_STATUSES = [
  { value: 'NEW', label: 'New', color: 'bg-blue-100 text-blue-800' },
  { value: 'CONTACTED', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'INTERESTED', label: 'Interested', color: 'bg-green-100 text-green-800' },
  { value: 'NOT_INTERESTED', label: 'Not Interested', color: 'bg-red-100 text-red-800' },
  { value: 'FOLLOW_UP', label: 'Follow Up', color: 'bg-purple-100 text-purple-800' },
  { value: 'CONVERTED', label: 'Converted', color: 'bg-emerald-100 text-emerald-800' },
];

export const PAYMENT_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'PARTIAL', label: 'Partial', color: 'bg-orange-100 text-orange-800' },
  { value: 'PAID', label: 'Paid', color: 'bg-green-100 text-green-800' },
  { value: 'OVERDUE', label: 'Overdue', color: 'bg-red-100 text-red-800' },
];

export const TEACHER_REG_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'REVIEWED', label: 'Reviewed', color: 'bg-blue-100 text-blue-800' },
  { value: 'SHORTLISTED', label: 'Shortlisted', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'INTERVIEW', label: 'Interview', color: 'bg-purple-100 text-purple-800' },
  { value: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-800' },
  { value: 'HIRED', label: 'Hired', color: 'bg-green-100 text-green-800' },
];

export const CLASSES = [
  'Playgroup', 'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
];

export const SECTIONS = ['A', 'B', 'C', 'D'];

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getStatusColor = (status, statuses) => {
  const found = statuses.find((s) => s.value === status);
  return found?.color || 'bg-gray-100 text-gray-800';
};
