import { useEffect, useState } from 'react';
import useActivityStore from '../../stores/activityStore';
import useAnnouncementStore from '../../stores/announcementStore';
import { Loading } from '../../components/ui';
import useAuthStore from '../../stores/authStore';
import { formatDate } from '../../lib/utils';
import NotificationPopup from '../../components/NotificationPopup';
import { useNotificationListener } from '../../hooks/useNotificationListener';

const ANN_META = {
  EMERGENCY: { icon: '🚨', left: 'bg-red-500',    badge: 'bg-red-100 text-red-700' },
  URGENT:    { icon: '⚡',    left: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700' },
  GENERAL:   { icon: '📢', left: 'bg-blue-400',  badge: 'bg-blue-100 text-blue-700' },
  REMINDER:  { icon: '🔔', left: 'bg-yellow-400',badge: 'bg-yellow-100 text-yellow-700' },
};

export default function TeacherDashboard() {
  const { user } = useAuthStore();
  const { activities, loading: actLoading, fetchMyActivities } = useActivityStore();
  const { announcements, loading: annLoading, fetchAnnouncements } = useAnnouncementStore();
  const [displayedPopups, setDisplayedPopups] = useState([]);
  
  // Listen for new notifications
  const { newNotifications, removeNotification } = useNotificationListener(true, (notif) => {
    console.log('🎯 TeacherDashboard received notification callback:', notif.title);
    setDisplayedPopups((prev) => {
      console.log('📌 Adding popup, total now:', prev.length + 1);
      return [notif, ...prev];
    });
  });

  useEffect(() => {
    console.log('🎯 TeacherDashboard mounted, displayedPopups:', displayedPopups.length);
  }, [displayedPopups]);

  useEffect(() => {
    fetchMyActivities({ limit: 5 });
    fetchAnnouncements({ limit: 5 });
  }, [fetchMyActivities, fetchAnnouncements]);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="space-y-6">
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
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 text-white shadow-md">
        <p className="text-xs sm:text-sm text-violet-200 mb-1">{today}</p>
        <h1 className="text-xl sm:text-2xl font-bold">Hello, {user?.name?.split(' ')[0]} ✌️</h1>
        <p className="text-violet-200 text-xs sm:text-sm mt-1">You have {activities.length} activities this term</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {[{icon: '📚', label: 'My Activities', value: activities.length, grad: 'from-blue-500 to-blue-600'},
          {icon: '🏫', label: 'Assigned Classes', value: user?.assignedClasses?.length || 0, grad: 'from-violet-500 to-purple-600'},
          {icon: '📢', label: 'Announcements', value: announcements.length, grad: 'from-amber-500 to-orange-500'}]
          .map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.grad} rounded-2xl p-4 text-white shadow-sm`}>
            <div className="text-2xl mb-1">{s.icon}</div>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm opacity-80 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Assigned classes chips */}
      {user?.assignedClasses?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Your Classes</p>
          <div className="flex flex-wrap gap-2">
            {user.assignedClasses.map(cls => (
              <span key={cls._id || cls.className} className="px-3 py-1.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-full text-sm font-semibold">
                🏫 {typeof cls === 'string' ? cls : cls.className}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Activities */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Recent Activities</h3>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{activities.length}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {actLoading ? (
              <div className="p-6"><Loading /></div>
            ) : activities.length === 0 ? (
              <div className="px-5 py-10 text-center text-gray-400">
                <div className="text-3xl mb-2">📭</div>
                <p className="text-sm">No activities created yet</p>
              </div>
            ) : (
              activities.slice(0, 5).map((a) => (
                <div key={a._id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{a.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{a.className} • {a.type}</p>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="text-xs font-medium text-gray-600">{a.dueDate ? formatDate(a.dueDate) : '-'}</p>
                      <p className="text-xs text-gray-400">{a.submissions?.length || 0} submitted</p>
                    </div>
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
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{announcements.length}</span>
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
                const meta = ANN_META[a.type] || ANN_META.GENERAL;
                return (
                  <div key={a._id} className="flex px-5 py-3.5 hover:bg-gray-50 transition-colors gap-3">
                    <div className={`w-1 rounded-full flex-shrink-0 ${meta.left}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 truncate">{a.title}</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${meta.badge}`}>{a.type}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{a.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDate(a.createdAt)}</p>
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
