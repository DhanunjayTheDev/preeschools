import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://preeschools.onrender.com/api",
});

export const getPrograms = () => API.get("/programs");
export const getGallery = () => API.get("/gallery");
export const getTestimonials = () => API.get("/testimonials");
export const submitAdmission = (data) => API.post("/admissions", data);

export default API;
