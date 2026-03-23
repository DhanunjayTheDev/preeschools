import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token on every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth
export const loginAdmin = (data) => api.post("/admin/login", data);
export const getProfile = () => api.get("/admin/profile");

// Admissions
export const getAdmissions = (params) => api.get("/admissions", { params });
export const getAdmissionStats = () => api.get("/admissions/stats");
export const updateAdmission = (id, data) => api.patch(`/admissions/${id}`, data);
export const deleteAdmission = (id) => api.delete(`/admissions/${id}`);

// Programs
export const getPrograms = () => api.get("/programs");
export const createProgram = (data) => api.post("/programs", data);
export const updateProgram = (id, data) => api.patch(`/programs/${id}`, data);

// Gallery
export const getGalleryImages = (category) => api.get("/gallery", { params: category ? { category } : {} });
export const uploadGalleryImage = (formData) =>
  api.post("/gallery/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
export const deleteGalleryImage = (id) => api.delete(`/gallery/${id}`);

// Testimonials
export const getTestimonials = () => api.get("/testimonials");
export const createTestimonial = (data) => api.post("/testimonials", data);
export const updateTestimonial = (id, data) => api.patch(`/testimonials/${id}`, data);
export const deleteTestimonial = (id) => api.delete(`/testimonials/${id}`);

export default api;
