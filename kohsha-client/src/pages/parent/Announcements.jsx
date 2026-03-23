import { useEffect } from 'react';
import useAnnouncementStore from '../../stores/announcementStore';
import { Pagination, Loading } from '../../components/ui';
import { formatDate } from '../../lib/utils';

const ANN_META = {
  EMERGENCY: { icon: '🚨', bg: 'bg-red-50',     border: 'border-red-200',    badge: 'bg-red-500 text-white',    left: 'bg-red-500' },
  URGENT:    { icon: '⚡', bg: 'bg-orange-50',  border: 'border-orange-200', badge: 'bg-orange-500 text-white', left: 'bg-orange-500' },
  GENERAL:   { icon: '📢', bg: 'bg-blue-50',    border: 'border-blue-100',   badge: 'bg-blue-500 text-white',   left: 'bg-blue-400' },
  REMINDER:  { icon: '🔔', bg: 'bg-yellow-50',  border: 'border-yellow-200', badge: 'bg-yellow-500 text-white', left: 'bg-yellow-400' },
  EVENT:     { icon: '🎉', bg: 'bg-purple-50',  border: 'border-purple-200', badge: 'bg-purple-500 text-white', left: 'bg-purple-400' },
};

export default function ParentAnnouncements() {
  const { announcements, pagination, loading, fetchAnnouncements } = useAnnouncementStore();

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        <p className="text-sm text-gray-500 mt-0.5">Stay updated with school notices</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loading /></div>
      ) : announcements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-4xl mb-3">🔕</div>
          <p className="text-gray-500">No announcements at the moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => {
            const meta = ANN_META[a.type] || ANN_META.GENERAL;
            return (
              <div key={a._id} className={`bg-white rounded-2xl border ${meta.border} shadow-sm overflow-hidden hover:shadow-md transition-shadow`}>
                <div className="flex">
                  {/* Left accent bar */}
                  <div className={`w-1 flex-shrink-0 ${meta.left}`} />
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center text-lg flex-shrink-0`}>
                          {meta.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{a.title}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.badge}`}>{a.type}</span>
                            {a.createdBy?.name && <span className="text-xs text-gray-400">by {a.createdBy.name}</span>}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(a.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-3 leading-relaxed whitespace-pre-wrap">{a.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={(p) => fetchAnnouncements({ page: p })} />
    </div>
  );
}
