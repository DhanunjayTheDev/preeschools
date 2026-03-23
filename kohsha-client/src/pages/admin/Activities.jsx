import { useEffect, useState } from 'react';
import useActivityStore from '../../stores/activityStore';
import { Button, Card, Table, Badge, Modal, Input, DropdownTable, Pagination, Loading, ActionButton, ConfirmDialog } from '../../components/ui';
import { CLASSES, SECTIONS, formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

const TYPES = ['HOMEWORK', 'CLASSWORK', 'PROJECT', 'ASSIGNMENT', 'OTHER'];

export default function Activities() {
  const { activities, pagination, loading, fetchActivities, createActivity, deleteActivity } = useActivityStore();
  const [showCreate, setShowCreate] = useState(false);
  const [filters, setFilters] = useState({ type: '', className: '', search: '' });
  const [form, setForm] = useState({
    title: '', description: '', type: 'HOMEWORK', className: '', section: '',
    dueDate: '', maxPoints: '',
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState({ activityId: null, activityTitle: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchActivities(filters);
  }, [fetchActivities, filters]);

  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.className) {
      toast.error('Class is required');
      return;
    }
    
    try {
      const data = { ...form };
      if (data.maxPoints) data.maxPoints = Number(data.maxPoints);
      else delete data.maxPoints;
      if (!data.section) delete data.section;
      await createActivity(data);
      toast.success(`✅ Activity "${form.title}" created successfully`);
      setShowCreate(false);
      setForm({ title: '', description: '', type: 'HOMEWORK', className: '', section: '', dueDate: '', maxPoints: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDeleteClick = (id, title) => {
    setConfirmData({ activityId: id, activityTitle: title });
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteActivity(confirmData.activityId);
      toast.success(`🗑️ Activity "${confirmData.activityTitle}" deleted successfully`);
      setShowConfirm(false);
      setConfirmData({ activityId: null, activityTitle: '' });
      fetchActivities(filters);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete activity');
    } finally {
      setIsDeleting(false);
    }
  };

  const TYPE_META = {
    HOMEWORK: { bg: 'bg-blue-100 text-blue-700', icon: '📚' },
    CLASSWORK: { bg: 'bg-green-100 text-green-700', icon: '✍️' },
    PROJECT: { bg: 'bg-purple-100 text-purple-700', icon: '📁' },
    ASSIGNMENT: { bg: 'bg-orange-100 text-orange-700', icon: '📋' },
    OTHER: { bg: 'bg-gray-100 text-gray-700', icon: '📌' },
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-violet-100 text-sm font-medium mb-1">Academic</p>
            <h1 className="text-4xl font-bold mb-2">Activities & Homework</h1>
            <p className="text-violet-50 text-sm">Manage assignments and class activities</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-6xl opacity-20">📖</div>
            <ActionButton onClick={() => setShowCreate(true)} color="violet">+ New Activity</ActionButton>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <Input placeholder="Search by title..." value={filters.search || ''} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="flex-1 min-w-[200px]" />
          <div className="min-w-[180px]">
            <DropdownTable
              value={filters.type}
              onChange={(val) => setFilters({ ...filters, type: val })}
              placeholder="All Types"
              icon="📝"
              options={TYPES.map((t) => ({ value: t, label: t, searchFields: [t] }))}
              columns={[{ key: 'label', label: 'Type' }]}
            />
          </div>
          <div className="min-w-[180px]">
            <DropdownTable
              value={filters.className}
              onChange={(val) => setFilters({ ...filters, className: val })}
              placeholder="All Classes"
              icon="🏫"
              options={CLASSES.map((c) => ({ value: c, label: c, searchFields: [c] }))}
              columns={[{ key: 'label', label: 'Class' }]}
            />
          </div>
          {(filters.search || filters.type || filters.className) && (
            <Button variant="secondary" size="sm" onClick={() => setFilters({ type: '', className: '', search: '' })}>Clear</Button>
          )}
        </div>
      </div>

      {/* Activities Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table
          columns={[
            { key: 'title', label: 'Title', render: (r) => (
              <div className="flex items-center gap-3">
                <span className="text-xl">{TYPE_META[r.type]?.icon || '📌'}</span>
                <span className="font-semibold text-gray-900">{r.title}</span>
              </div>
            )},
            { key: 'type', label: 'Type', render: (r) => (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${TYPE_META[r.type]?.bg || 'bg-gray-100 text-gray-700'}`}>{r.type}</span>
            )},
            { key: 'className', label: 'Class', render: (r) => (
              <span className="font-medium text-gray-700">{r.className}{r.section ? ` – ${r.section}` : ''}</span>
            )},
            { key: 'dueDate', label: 'Due Date', render: (r) => r.dueDate ? (
              <span className="text-sm font-medium text-gray-900">{formatDate(r.dueDate)}</span>
            ) : <span className="text-gray-400">—</span> },
            { key: 'maxPoints', label: 'Points', render: (r) => r.maxPoints ? (
              <span className="text-sm font-semibold text-purple-600">{r.maxPoints} pts</span>
            ) : <span className="text-gray-400">—</span> },
            { key: 'submissions', label: 'Submissions', render: (r) => (
              <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{r.submissions?.length || 0}</span>
            )},
            { key: 'createdBy', label: 'By', render: (r) => r.createdBy?.name || <span className="text-gray-400">—</span> },
            { key: 'actions', label: '', render: (r) => (
              <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(r._id, r.title); }} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors text-base" title="Delete">
                🗑️
              </button>
            )},
          ]}
          data={activities}
          loading={loading}
        />
        <Pagination pagination={pagination} onPageChange={(p) => fetchActivities({ ...filters, page: p })} />
      </div>

      {/* Create Activity Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Activity" size="lg"
        footer={<>
          <Button variant="secondary" type="button" onClick={() => { setShowCreate(false); setForm({ title: '', description: '', type: 'HOMEWORK', className: '', section: '', dueDate: '', maxPoints: '' }); }}>Cancel</Button>
          <Button type="submit" form="create-activity-form" className="bg-gradient-to-r from-primary-600 to-blue-600">Create Activity</Button>
        </>}
      >
        <form id="create-activity-form" onSubmit={handleCreate} className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="e.g., Math Chapter 5 Assignment" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required placeholder="Enter activity details..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DropdownTable 
              label="Type" 
              value={form.type} 
              onChange={(val) => setForm({ ...form, type: val })} 
              placeholder="Select type" 
              icon="📝"
              options={TYPES.map((t) => ({ value: t, label: t, searchFields: [t] }))} 
              columns={[{ key: 'label', label: 'Type' }]}
              required
            />
            <DropdownTable 
              label="Class" 
              value={form.className} 
              onChange={(val) => setForm({ ...form, className: val })} 
              placeholder="Select class" 
              icon="🏫"
              options={CLASSES.map((c) => ({ value: c, label: c, searchFields: [c] }))} 
              columns={[{ key: 'label', label: 'Class' }]}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <DropdownTable 
              label="Section" 
              value={form.section} 
              onChange={(val) => setForm({ ...form, section: val })} 
              placeholder="Select section" 
              icon="📍"
              options={SECTIONS.map((s) => ({ value: s, label: `Section ${s}`, searchFields: [s] }))} 
              columns={[{ key: 'label', label: 'Section' }]}
            />
            <Input label="Due Date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            <Input label="Max Points" type="number" value={form.maxPoints} onChange={(e) => setForm({ ...form, maxPoints: e.target.value })} placeholder="100" />
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
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
