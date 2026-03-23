"use client";
import { useEffect, useState } from "react";
import { getPrograms, createProgram, updateProgram } from "@/lib/api";
import toast from "react-hot-toast";
import { Plus, Save, X } from "lucide-react";

const programNames = ["Daycare", "Toddler Club", "Nursery", "K1", "K2", "After School Activities"];

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ programName: "", ageGroup: "", price: "", description: "" });

  const fetchPrograms = async () => {
    try {
      const res = await getPrograms();
      setPrograms(res.data);
    } catch {
      toast.error("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrograms(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProgram(editingId, { ...form, price: Number(form.price) });
        toast.success("Program updated");
      } else {
        await createProgram({ ...form, price: Number(form.price) });
        toast.success("Program created");
      }
      setShowForm(false);
      setEditingId(null);
      setForm({ programName: "", ageGroup: "", price: "", description: "" });
      fetchPrograms();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save");
    }
  };

  const startEdit = (program) => {
    setForm({
      programName: program.programName,
      ageGroup: program.ageGroup,
      price: String(program.price),
      description: program.description,
    });
    setEditingId(program._id);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
          <p className="text-gray-500 mt-1">Manage program pricing and details</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ programName: "", ageGroup: "", price: "", description: "" }); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add Program"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">{editingId ? "Edit Program" : "Add New Program"}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Name</label>
              <select
                name="programName"
                required
                value={form.programName}
                onChange={handleChange}
                disabled={!!editingId}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none disabled:bg-gray-50"
              >
                <option value="">Select program</option>
                {programNames.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
              <input
                name="ageGroup"
                required
                value={form.ageGroup}
                onChange={handleChange}
                placeholder="e.g. 1 - 3 Years"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹/month)</label>
              <input
                name="price"
                type="number"
                required
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="4500"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                name="description"
                required
                value={form.description}
                onChange={handleChange}
                placeholder="Brief description"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
              >
                <Save size={16} />
                {editingId ? "Update Program" : "Create Program"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program) => (
            <div key={program._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">{program.programName}</h3>
              <p className="text-primary text-sm font-medium mt-1">{program.ageGroup}</p>
              <p className="text-gray-500 text-sm mt-3">{program.description}</p>
              <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-50">
                <div>
                  <span className="text-2xl font-bold text-gray-900">₹{program.price?.toLocaleString()}</span>
                  <span className="text-sm text-gray-400">/month</span>
                </div>
                <button
                  onClick={() => startEdit(program)}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
