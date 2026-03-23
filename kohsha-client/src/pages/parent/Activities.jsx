import { useEffect, useState } from 'react';
import useActivityStore from '../../stores/activityStore';
import { Pagination, Loading } from '../../components/ui';
import { formatDate } from '../../lib/utils';

const TYPE_META = {
  HOMEWORK:   { icon: '📚', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  PROJECT:    { icon: '🔬', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  CLASSWORK:  { icon: '✏️', color: 'bg-green-100 text-green-700 border-green-200' },
  ASSIGNMENT: { icon: '📋', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  OTHER:      { icon: '📌', color: 'bg-gray-100 text-gray-600 border-gray-200' },
};

export default function ParentActivities() {
  const { activities, pagination, loading, fetchParentActivities } = useActivityStore();
  const [filter, setFilter] = useState('ALL');

  useEffect(() => { fetchParentActivities(); }, [fetchParentActivities]);

  const types = ['ALL', 'HOMEWORK', 'PROJECT', 'CLASSWORK', 'ASSIGNMENT', 'OTHER'];
  const filtered = filter === 'ALL' ? activities : activities.filter(a => a.type === filter);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activities & Homework</h1>
          <p className="text-sm text-gray-500 mt-0.5">{activities.length} total assignments</p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
              filter === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
            }`}>
            {t === 'ALL' ? 'All Types' : `${TYPE_META[t]?.icon} ${t}`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loading /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-gray-500">No activities yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => {
            const meta = TYPE_META[a.type] || TYPE_META.OTHER;
            const isOverdue = a.dueDate && new Date(a.dueDate) < new Date();
            return (
              <div key={a._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl flex-shrink-0">
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-bold text-gray-900">{a.title}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${meta.color}`}>{a.type}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{a.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">🏫 {a.className}</span>
                      {a.dueDate && (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          isOverdue ? 'bg-red-100 text-red-600' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {isOverdue ? '⚠️ Overdue' : '⏰ Due'} {formatDate(a.dueDate)}
                        </span>
                      )}
                      {a.maxPoints && <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">🏆 {a.maxPoints} pts</span>}
                      {a.createdBy?.name && <span className="text-xs text-gray-400">by {a.createdBy.name}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={(p) => fetchParentActivities({ page: p })} />
    </div>
  );
}
