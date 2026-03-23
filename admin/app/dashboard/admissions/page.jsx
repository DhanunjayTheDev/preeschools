"use client";
import { useEffect, useState } from "react";
import { getAdmissions, updateAdmission, deleteAdmission } from "@/lib/api";
import toast from "react-hot-toast";
import { Trash2, Check, X } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchAdmissions = async () => {
    try {
      const params = filter ? { status: filter } : {};
      const res = await getAdmissions(params);
      setAdmissions(res.data.admissions);
    } catch {
      toast.error("Failed to load admissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [filter]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAdmission(id, { status });
      toast.success(`Admission ${status}`);
      fetchAdmissions();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this admission?")) return;
    try {
      await deleteAdmission(id);
      toast.success("Deleted");
      fetchAdmissions();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admissions</h1>
          <p className="text-gray-500 mt-1">Manage admission applications</p>
        </div>
        <div className="flex gap-2">
          {["", "pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setLoading(true); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {f ? f.charAt(0).toUpperCase() + f.slice(1) : "All"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Parent Name", "Child Name", "Program", "Phone", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {admissions.map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{a.parentName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{a.childName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{a.program}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{a.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[a.status]}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {a.status !== "approved" && (
                          <button
                            onClick={() => handleStatusUpdate(a._id, "approved")}
                            className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        {a.status !== "rejected" && (
                          <button
                            onClick={() => handleStatusUpdate(a._id, "rejected")}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <X size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {admissions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      No admissions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
