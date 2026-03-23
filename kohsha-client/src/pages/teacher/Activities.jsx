import { useEffect, useState } from 'react';
import useActivityStore from '../../stores/activityStore';
import { Button, Modal, Input, Select, Pagination, Loading, ConfirmDialog } from '../../components/ui';
import { CLASSES, formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

const TYPES = ['HOMEWORK', 'CLASSWORK', 'PROJECT', 'ASSIGNMENT', 'OTHER'];
const TYPE_META = {
  HOMEWORK:   { icon: '📚', color: 'bg-blue-100 text-blue-700' },
  PROJECT:    { icon: '🔬', color: 'bg-purple-100 text-purple-700' },
  CLASSWORK:  { icon: '✏️', color: 'bg-green-100 text-green-700' },
  ASSIGNMENT: { icon: '📋', color: 'bg-amber-100 text-amber-700' },
  OTHER:      { icon: '📌', color: 'bg-gray-100 text-gray-600' },
};

export default function TeacherActivities() {
  const { activities, pagination, loading, fetchMyActivities, createActivity, deleteActivity } = useActivityStore();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', type: 'HOMEWORK', className: '', section: '', dueDate: '', maxPoints: '',
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState({ activityId: null, activityTitle: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => { fetchMyActivities(); }, [fetchMyActivities]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form };
      if (data.maxPoints) data.maxPoints = Number(data.maxPoints);
      else delete data.maxPoints;
      if (!data.section) delete data.section;
      await createActivity(data);
      toast.success('Activity created');
      setShowCreate(false);
      setForm({ title: '', description: '', type: 'HOMEWORK', className: '', section: '', dueDate: '', maxPoints: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = (id, title) => {
    setConfirmData({ activityId: id, activityTitle: title });
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteActivity(confirmData.activityId);
      toast.success(`Activity "${confirmData.activityTitle}" deleted`);
      setShowConfirm(false);
      setConfirmData({ activityId: null, activityTitle: '' });
    } catch { toast.error('Failed'); }
    finally { setIsDeleting(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Activities</h1>
          <p className="text-sm text-gray-500 mt-0.5">{activities.length} activities created</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors">
          + New Activity
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loading /></div>
      ) : activities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="text-4xl mb-3">📚</div>
          <p className="text-gray-500 font-medium">No activities yet</p>
          <p className="text-gray-400 text-sm mt-1">Create your first activity to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              {['Activity','Type','Class','Due Date','Submissions',''].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {activities.map(a => {
                const meta = TYPE_META[a.type] || TYPE_META.OTHER;
                const isOverdue = a.dueDate && new Date(a.dueDate) < new Date();
                return (
                  <tr key={a._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-gray-900">{a.title}</p>
                      {a.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{a.description}</p>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${meta.color}`}>{meta.icon} {a.type}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-gray-700">{a.className}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      {a.dueDate ? (
                        <span className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-gray-600'}`}>
                          {isOverdue ? '⚠️ ' : '⏰ '}{formatDate(a.dueDate)}
                        </span>
                      ) : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-bold text-gray-700">{a.submissions?.length || 0}</span>
                      <span className="text-xs text-gray-400 ml-1">submitted</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => handleDelete(a._id, a.title)}
                        className="text-xs px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-gray-100">
            <Pagination pagination={pagination} onPageChange={(p) => fetchMyActivities({ page: p })} />
          </div>
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Activity" size="md"
        footer={<>
          <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button type="submit" form="teacher-create-activity-form" className="bg-violet-600 hover:bg-violet-700">Create Activity</Button>
        </>}
      >
        <form id="teacher-create-activity-form" onSubmit={handleCreate} className="space-y-4">
          <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none text-sm"
              rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} options={TYPES.map(t => ({ value: t, label: t }))} />
            <Select label="Class *" value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} placeholder="Select" options={CLASSES.map(c => ({ value: c, label: c }))} required />
            <Input label="Due Date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            <Input label="Max Points" type="number" value={form.maxPoints} onChange={(e) => setForm({ ...form, maxPoints: e.target.value })} />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => { setShowConfirm(false); setConfirmData({ activityId: null, activityTitle: '' }); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Activity"
        message={`Are you sure you want to delete activity "${confirmData.activityTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
