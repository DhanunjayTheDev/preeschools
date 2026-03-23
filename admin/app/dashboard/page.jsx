"use client";
import { useEffect, useState } from "react";
import { getAdmissionStats, getGalleryImages, getPrograms } from "@/lib/api";
import { Users, Clock, Image, GraduationCap } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [galleryCount, setGalleryCount] = useState(0);
  const [programCount, setProgramCount] = useState(0);

  useEffect(() => {
    getAdmissionStats().then((r) => setStats(r.data)).catch(() => {});
    getGalleryImages().then((r) => setGalleryCount(r.data.length)).catch(() => {});
    getPrograms().then((r) => setProgramCount(r.data.length)).catch(() => {});
  }, []);

  const cards = [
    { label: "Total Admissions", value: stats.total, icon: Users, color: "bg-primary", textColor: "text-primary" },
    { label: "Pending Admissions", value: stats.pending, icon: Clock, color: "bg-yellow-500", textColor: "text-yellow-600" },
    { label: "Gallery Images", value: galleryCount, icon: Image, color: "bg-accent", textColor: "text-cyan-600" },
    { label: "Programs", value: programCount, icon: GraduationCap, color: "bg-green-500", textColor: "text-green-600" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to Kohsha Academy admin panel</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="text-white" size={24} />
              </div>
            </div>
            <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Admission Breakdown</h3>
          <div className="space-y-4">
            {[
              { label: "Approved", value: stats.approved, color: "bg-green-500", total: stats.total },
              { label: "Pending", value: stats.pending, color: "bg-yellow-500", total: stats.total },
              { label: "Rejected", value: stats.rejected, color: "bg-red-500", total: stats.total },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "View Admissions", href: "/dashboard/admissions", color: "bg-primary/5 text-primary hover:bg-primary/10" },
              { label: "Manage Programs", href: "/dashboard/programs", color: "bg-green-50 text-green-600 hover:bg-green-100" },
              { label: "Upload Gallery", href: "/dashboard/gallery", color: "bg-cyan-50 text-cyan-600 hover:bg-cyan-100" },
              { label: "Testimonials", href: "/dashboard/testimonials", color: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className={`p-4 rounded-xl text-sm font-medium text-center transition-colors ${action.color}`}
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
