import { useEffect, useState } from 'react';
import useActivityStore from '../../stores/activityStore';
import useAnnouncementStore from '../../stores/announcementStore';
import useAuthStore from '../../stores/authStore';
import { Badge, Loading } from '../../components/ui';
import { formatDate } from '../../lib/utils';
import NotificationPopup from '../../components/NotificationPopup';
import { useNotificationListener } from '../../hooks/useNotificationListener';

const TYPE_COLORS = {
  HOMEWORK: 'bg-blue-100 text-blue-700',
  PROJECT: 'bg-purple-100 text-purple-700',
  CLASSWORK: 'bg-green-100 text-green-700',
  ASSIGNMENT: 'bg-amber-100 text-amber-700',
  OTHER: 'bg-gray-100 text-gray-600',
};

const ANN_COLORS = {
  EMERGENCY: { bg: 'bg-red-50 border-red-200', dot: 'bg-red-500', text: 'text-red-700' },
  URGENT: { bg: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500', text: 'text-orange-700' },
  GENERAL: { bg: 'bg-blue-50 border-blue-200', dot: 'bg-blue-500', text: 'text-blue-700' },
  REMINDER: { bg: 'bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500', text: 'text-yellow-700' },
};

export default function ParentDashboard() {
  const { user } = useAuthStore();
  const { activities, loading: actLoading, fetchParentActivities } = useActivityStore();
  const { announcements, loading: annLoading, fetchAnnouncements } = useAnnouncementStore();
  const [displayedPopups, setDisplayedPopups] = useState([]);
  
  // Listen for new notifications
  const { newNotifications, removeNotification } = useNotificationListener(true, (notif) => {
    console.log('🎯 ParentDashboard received notification callback:', notif.title);
    setDisplayedPopups((prev) => {
      console.log('📌 Adding popup, total now:', prev.length + 1);
      return [notif, ...prev];
    });
  });

  useEffect(() => {
    fetchParentActivities({ limit: 5 });
    fetchAnnouncements({ limit: 5 });
  }, [fetchParentActivities, fetchAnnouncements]);

  const pending = activities.filter(a => a.dueDate && new Date(a.dueDate) > new Date()).length;
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 p-1">
      {/* Display notification popups */}
      {displayedPopups.map((popup) => (
        <NotificationPopup
          key={popup._id}
          notification={popup}
          shouldAutoClose={false}
          onClose={() => {
            removeNotification(popup._id);
            setDisplayedPopups((prev) => prev.filter((p) => p._id !== popup._id));
          }}
        />
      ))}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 text-white shadow-md">
        <p className="text-xs sm:text-sm text-blue-200 mb-1">{today}</p>
        <h1 className="text-xl sm:text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-blue-200 text-xs sm:text-sm mt-1">Stay updated with your child's progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {[{icon: '👶', label: 'Children', value: user?.children?.length || 0, color: 'from-blue-500 to-blue-600'},
          {icon: '📚', label: 'Pending Tasks', value: pending, color: 'from-amber-500 to-orange-500'},
          {icon: '📢', label: 'Announcements', value: announcements.length, color: 'from-violet-500 to-purple-600'}]
          .map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4 text-white shadow-sm`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm opacity-80 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Activities */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Recent Activities</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{activities.length} total</span>
          </div>
          <div className="divide-y divide-gray-50">
            {actLoading ? (
              <div className="p-6"><Loading /></div>
            ) : activities.length === 0 ? (
              <div className="px-5 py-10 text-center text-gray-400">
                <div className="text-3xl mb-2">📭</div>
                <p className="text-sm">No activities assigned</p>
              </div>
            ) : (
              activities.slice(0, 5).map((a) => (
                <div key={a._id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{a.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{a.description}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLORS[a.type] || TYPE_COLORS.OTHER}`}>
                      {a.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{a.className}</span>
                    {a.dueDate && <span className={`text-xs font-medium ${new Date(a.dueDate) < new Date() ? 'text-red-500' : 'text-gray-500'}`}>Due {formatDate(a.dueDate)}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Announcements</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{announcements.length} total</span>
          </div>
          <div className="divide-y divide-gray-50">
            {annLoading ? (
              <div className="p-6"><Loading /></div>
            ) : announcements.length === 0 ? (
              <div className="px-5 py-10 text-center text-gray-400">
                <div className="text-3xl mb-2">🔕</div>
                <p className="text-sm">No announcements</p>
              </div>
            ) : (
              announcements.slice(0, 5).map((a) => {
                const c = ANN_COLORS[a.type] || ANN_COLORS.GENERAL;
                return (
                  <div key={a._id} className={`px-5 py-3.5 border-l-4 ${c.bg} border-l-4`} style={{borderLeftColor: ''}}>
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${c.dot}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 truncate">{a.title}</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${c.text} bg-white border flex-shrink-0`}>{a.type}</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{a.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(a.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
