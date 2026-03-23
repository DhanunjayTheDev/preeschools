"use client";
import { useEffect, useState } from "react";
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/api";
import toast from "react-hot-toast";
import { Plus, Save, X, Trash2, Edit, Star } from "lucide-react";

const programNames = ["Daycare", "Toddler Club", "Nursery", "K1", "K2", "After School Activities"];

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ parentName: "", review: "", rating: "5", childProgram: "" });

  const fetchTestimonials = async () => {
    try {
      const res = await getTestimonials();
      setTestimonials(res.data);
    } catch {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, rating: Number(form.rating) };
      if (editingId) {
        await updateTestimonial(editingId, data);
        toast.success("Updated");
      } else {
        await createTestimonial(data);
        toast.success("Created");
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ parentName: "", review: "", rating: "5", childProgram: "" });
      fetchTestimonials();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save");
    }
  };

  const startEdit = (t) => {
    setForm({ parentName: t.parentName, review: t.review, rating: String(t.rating), childProgram: t.childProgram });
    setEditingId(t._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      toast.success("Deleted");
      fetchTestimonials();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-500 mt-1">Manage parent testimonials</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ parentName: "", review: "", rating: "5", childProgram: "" }); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add Testimonial"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">{editingId ? "Edit Testimonial" : "Add Testimonial"}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
                <input
                  name="parentName"
                  required
                  value={form.parentName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                <select
                  name="childProgram"
                  required
                  value={form.childProgram}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                >
                  <option value="">Select</option>
                  {programNames.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select
                  name="rating"
                  value={form.rating}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                >
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
              <textarea
                name="review"
                required
                rows={3}
                maxLength={500}
                value={form.review}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              <Save size={16} />
              {editingId ? "Update" : "Create"}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">&ldquo;{t.review}&rdquo;</p>
              <div className="flex items-end justify-between pt-3 border-t border-gray-50">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{t.parentName}</p>
                  <p className="text-xs text-primary">{t.childProgram}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => startEdit(t)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(t._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {testimonials.length === 0 && (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-100">
              <p className="text-gray-400">No testimonials yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
