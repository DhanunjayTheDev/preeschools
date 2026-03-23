import { useEffect, useState } from 'react';
import { Card } from '../../components/ui';
import useEnquiryStore from '../../stores/enquiryStore';
import useStudentStore from '../../stores/studentStore';
import useFeeStore from '../../stores/feeStore';
import { formatCurrency } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { stats: enquiryStats, fetchStats: fetchEnquiryStats } = useEnquiryStore();
  const { stats: studentStats, fetchStats: fetchStudentStats } = useStudentStore();
  const { stats: feeStats, fetchStats: fetchFeeStats } = useFeeStore();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([fetchEnquiryStats(), fetchStudentStats(), fetchFeeStats()])
      .then(() => setLoaded(true))
      .catch(() => setLoaded(true));
  }, [fetchEnquiryStats, fetchStudentStats, fetchFeeStats]);

  const getEnquiryStatusCount = (status) => {
    if (!enquiryStats?.stats) return 0;
    const found = enquiryStats.stats.find((s) => s._id === status);
    return found?.count || 0;
  };

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-bold">Welcome back! 👋</h2>
            <p className="text-primary-100 mt-1">Kohsha Academy Management System</p>
            <p className="text-primary-200 text-sm mt-1">{today}</p>
          </div>
          <div className="text-right">
            <p className="text-primary-100 text-sm">Academic Year</p>
            <p className="text-white font-bold text-lg">2025 - 26</p>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Add Student', icon: '🎓', path: '/admin/students', color: 'from-blue-500 to-blue-600' },
          { label: 'New Enquiry', icon: '📋', path: '/admin/enquiries', color: 'from-yellow-500 to-orange-500' },
          { label: 'Record Payment', icon: '💳', path: '/admin/fees', color: 'from-emerald-500 to-green-600' },
          { label: 'Announcement', icon: '📢', path: '/admin/announcements', color: 'from-purple-500 to-indigo-600' },
        ].map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className={`bg-gradient-to-r ${action.color} text-white rounded-xl p-4 text-center font-medium text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200`}
          >
            <div className="text-2xl mb-1">{action.icon}</div>
            {action.label}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Students</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{studentStats?.active || 0}</p>
              <p className="text-blue-500 text-xs mt-1">Active enrollment</p>
            </div>
            <div className="text-3xl">🎓</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-5 border border-yellow-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Active Enquiries</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">{enquiryStats?.total || 0}</p>
              {enquiryStats?.followUpsToday > 0 && <p className="text-yellow-600 text-xs mt-1">⚠️ {enquiryStats.followUpsToday} follow-ups today</p>}
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-5 border border-emerald-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-emerald-600 text-sm font-medium">Fee Collected</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">{formatCurrency(feeStats?.totalCollected || 0)}</p>
              <p className="text-emerald-500 text-xs mt-1">This academic year</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-5 border border-red-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Fee Pending</p>
              <p className="text-2xl font-bold text-red-900 mt-1">{formatCurrency(feeStats?.totalDue || 0)}</p>
              <p className="text-red-500 text-xs mt-1">{feeStats?.overdueCount || 0} overdue</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enquiry Pipeline */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900">📋 Enquiry Pipeline</h3>
            <button onClick={() => navigate('/dashboard/enquiries')} className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All →</button>
          </div>
          <div className="space-y-3">
            {[
              { status: 'NEW', label: 'New Enquiries', color: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700' },
              { status: 'CONTACTED', label: 'Contacted', color: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-700' },
              { status: 'INTERESTED', label: 'Interested', color: 'bg-green-500', badge: 'bg-green-100 text-green-700' },
              { status: 'FOLLOW_UP', label: 'Follow Up', color: 'bg-purple-500', badge: 'bg-purple-100 text-purple-700' },
              { status: 'CONVERTED', label: 'Converted', color: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700' },
            ].map((item) => {
              const count = getEnquiryStatusCount(item.status);
              const total = enquiryStats?.total || 1;
              const width = Math.max((count / total) * 100, 2);
              return (
                <div key={item.status}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${item.badge}`}>{count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className={`${item.color} h-2.5 rounded-full transition-all duration-700`} style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Student Overview */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900">🎓 Student Overview</h3>
            <button onClick={() => navigate('/dashboard/students')} className="text-sm text-primary-600 hover:text-primary-700 font-medium">View All →</button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2"><span className="text-lg">👥</span><span className="text-sm text-gray-600 font-medium">Total Students</span></div>
              <span className="text-lg font-bold text-gray-900">{studentStats?.total || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2"><span className="text-lg">✅</span><span className="text-sm text-emerald-700 font-medium">Active</span></div>
              <span className="text-lg font-bold text-emerald-700">{studentStats?.active || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-center gap-2"><span className="text-lg">❌</span><span className="text-sm text-red-700 font-medium">Inactive</span></div>
              <span className="text-lg font-bold text-red-700">{studentStats?.inactive || 0}</span>
            </div>
          </div>
          {studentStats?.byClass && studentStats.byClass.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Students by Class</h4>
              <div className="grid grid-cols-2 gap-2">
                {studentStats.byClass.map((item) => (
                  <div key={`${item._id.className}-${item._id.section}`} className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 flex justify-between items-center">
                    <span className="text-xs text-blue-700 font-medium">{item._id.className} {item._id.section}</span>
                    <span className="text-sm font-bold text-blue-800">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Fee Summary */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900">💳 Fee Summary</h3>
          <button onClick={() => navigate('/dashboard/fees')} className="text-sm text-primary-600 hover:text-primary-700 font-medium">Manage Fees →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200">
            <div className="text-3xl mb-2">💰</div>
            <p className="text-sm text-emerald-600 font-semibold">Total Collected</p>
            <p className="text-2xl font-bold text-emerald-800 mt-1">{formatCurrency(feeStats?.totalCollected || 0)}</p>
          </div>
          <div className="text-center p-5 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm text-red-600 font-semibold">Total Due</p>
            <p className="text-2xl font-bold text-red-800 mt-1">{formatCurrency(feeStats?.totalDue || 0)}</p>
          </div>
          <div className="text-center p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200">
            <div className="text-3xl mb-2">⚠️</div>
            <p className="text-sm text-yellow-600 font-semibold">Overdue Students</p>
            <p className="text-2xl font-bold text-yellow-800 mt-1">{feeStats?.overdueCount || 0}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
