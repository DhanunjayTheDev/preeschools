import { useEffect, useState } from 'react';
import useAnnouncementStore from '../../stores/announcementStore';
import useAuthStore from '../../stores/authStore';
import { Button, Card, Badge, Modal, Input, DropdownTable, Pagination, Loading, ConfirmDialog } from '../../components/ui';
import { CLASSES, formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

const TYPES = ['GENERAL', 'ACADEMIC', 'EVENT', 'HOLIDAY', 'EMERGENCY'];
const DELIVERY = ['IN_APP', 'EMAIL', 'SMS', 'ALL'];

const ANN_META = {
  GENERAL:   { icon: '📢', bg: 'bg-blue-50',      border: 'border-blue-200',    badge: 'bg-blue-100 text-blue-700',       left: 'bg-blue-500' },
  ACADEMIC:  { icon: '📚', bg: 'bg-purple-50',    border: 'border-purple-200',  badge: 'bg-purple-100 text-purple-700',   left: 'bg-purple-500' },
  EVENT:     { icon: '🎉', bg: 'bg-pink-50',      border: 'border-pink-200',    badge: 'bg-pink-100 text-pink-700',       left: 'bg-pink-500' },
  HOLIDAY:   { icon: '🎊', bg: 'bg-yellow-50',    border: 'border-yellow-200',  badge: 'bg-yellow-100 text-yellow-700',   left: 'bg-yellow-500' },
  EMERGENCY: { icon: '🚨', bg: 'bg-red-50',       border: 'border-red-200',     badge: 'bg-red-100 text-red-700',         left: 'bg-red-500' },
};

const DELIVERY_META = {
  IN_APP:  { icon: '💬', color: 'blue' },
  EMAIL:   { icon: '📧', color: 'purple' },
  SMS:     { icon: '📱', color: 'green' },
  ALL:     { icon: '🌐', color: 'orange' },
};

export default function Announcements() {
  const {
    announcements, pagination, loading,
    fetchAnnouncements, createAnnouncement, deleteAnnouncement, fetchReadStats,
  } = useAnnouncementStore();
  const { user } = useAuthStore();

  const [showCreate, setShowCreate] = useState(false);
  const [selectedAnn, setSelectedAnn] = useState(null);
  const [readStats, setReadStats] = useState(null);
  const [filters, setFilters] = useState({ type: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [form, setForm] = useState({
    title: '', content: '', type: 'GENERAL',
    targetRoles: [], targetClasses: [],
    scheduledAt: '',
  });

  // Refresh announcement list and read stats
  useEffect(() => {
    fetchAnnouncements(filters);
  }, [fetchAnnouncements, filters]);

  // Auto-refresh read stats when modal is open
  useEffect(() => {
    if (!selectedAnn) return;

    console.log('📊 Starting auto-refresh for readStats:', selectedAnn._id);
    const refreshStatsInterval = setInterval(async () => {
      try {
        const stats = await fetchReadStats(selectedAnn._id);
        setReadStats(stats);
        console.log('🔄 ReadStats updated:', stats);
      } catch (err) {
        console.error('Error refreshing readStats:', err);
      }
    }, 2000); // Refresh every 2 seconds

    return () => {
      clearInterval(refreshStatsInterval);
      console.log('📊 Stopped auto-refresh for readStats');
    };
  }, [selectedAnn, fetchReadStats]);

  const resetForm = () => setForm({ title: '', content: '', type: 'GENERAL', targetRoles: [], targetClasses: [], scheduledAt: '' });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form };
      if (!data.scheduledAt) delete data.scheduledAt;
      if (data.targetClasses.length === 0) delete data.targetClasses;
      await createAnnouncement(data);
      toast.success('✅ Announcement created successfully');
      setShowCreate(false);
      resetForm();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = (id, title) => {
    setAnnouncementToDelete({ id, title });
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!announcementToDelete) return;
    setIsDeleting(true);
    try {
      await deleteAnnouncement(announcementToDelete.id);
      toast.success(`🗑️ Announcement "${announcementToDelete.title}" deleted successfully`);
      setShowDeleteConfirm(false);
      setAnnouncementToDelete(null);
    } catch (err) {
      toast.error('Failed to delete announcement');
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleRole = (role) => {
    setForm((prev) => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role) ? prev.targetRoles.filter((r) => r !== role) : [...prev.targetRoles, role],
    }));
  };

  const toggleClass = (cls) => {
    setForm((prev) => ({
      ...prev,
      targetClasses: prev.targetClasses.includes(cls) ? prev.targetClasses.filter((c) => c !== cls) : [...prev.targetClasses, cls],
    }));
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-amber-100 text-sm font-medium mb-1">Communications</p>
            <h1 className="text-4xl font-bold mb-2">Announcements</h1>
            <p className="text-amber-50">Send important updates and notices to parents and teachers</p>
          </div>
          <div className="text-6xl opacity-20">📢</div>
        </div>
      </div>

      {/* Stats + Create Button */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{pagination?.total || 0}</span> total announcements
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
          + New Announcement
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex gap-4 items-center">
        <DropdownTable 
          label="Type" 
          value={filters.type} 
          onChange={(val) => setFilters({ ...filters, type: val })} 
          placeholder="All Types" 
          icon="🏷️"
          options={TYPES.map((t) => ({ value: t, label: t, searchFields: [t] }))} 
          columns={[{ key: 'label', label: 'Type' }]}
        />
        {filters.type && (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setFilters({ type: '' })}
          >
            Clear
          </Button>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-16"><Loading /></div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500 font-medium">No announcements yet</p>
            <p className="text-gray-400 text-sm mt-1">Create your first announcement to get started</p>
          </div>
        ) : (
          announcements.map((ann) => {
            const meta = ANN_META[ann.type] || ANN_META.GENERAL;
            const deliveryMeta = DELIVERY_META[ann.delivery] || DELIVERY_META.IN_APP;
            return (
              <div
                key={ann._id}
                className={`bg-white rounded-xl border ${meta.border} shadow-sm overflow-hidden hover:shadow-md transition-all group cursor-pointer`}
                onClick={async () => {
                  setSelectedAnn(ann);
                  try {
                    const stats = await fetchReadStats(ann._id);
                    setReadStats(stats);
                  } catch {
                    setReadStats(null);
                  }
                }}
              >
                <div className="flex">
                  {/* Left accent */}
                  <div className={`w-1.5 flex-shrink-0 ${meta.left}`} />
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-lg ${meta.bg} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          {meta.icon}
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                            {ann.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${meta.badge}`}>
                              {ann.type}
                            </span>
                            <span className="text-xs text-gray-500">
                              {deliveryMeta.icon} {ann.delivery}
                            </span>
                            {ann.createdBy?.name && (
                              <span className="text-xs text-gray-400">by {ann.createdBy.name}</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-2.5 line-clamp-1">{ann.content}</p>
                        </div>
                      </div>
                      {/* Date + Delete */}
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <span className="text-xs text-gray-400">{formatDate(ann.createdAt)}</span>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(ann._id, ann.title);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {announcements.length > 0 && (
        <Pagination pagination={pagination} onPageChange={(p) => fetchAnnouncements({ ...filters, page: p })} />
      )}

      {/* Detail Modal */}
      <Modal 
        isOpen={!!selectedAnn} 
        onClose={() => { setSelectedAnn(null); setReadStats(null); }} 
        title={selectedAnn?.title} 
        size="lg"
        footer={
          readStats && readStats.total > 0 ? (
            <div className="px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-gray-700">📊 Read Rate</p>
                <p className="text-sm font-bold text-green-600">{Math.round((readStats.read / readStats.total) * 100)}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.round((readStats.read / readStats.total) * 100)}%` }} 
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">{readStats.read} of {readStats.total} recipients have read this</p>
            </div>
          ) : null
        }
      >
        {selectedAnn && (
          <div className="space-y-5">
            {/* Type & Delivery Badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${ANN_META[selectedAnn.type]?.badge || 'bg-blue-100 text-blue-700'}`}>
                {ANN_META[selectedAnn.type]?.icon} {selectedAnn.type}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">
                {DELIVERY_META[selectedAnn.delivery]?.icon} {selectedAnn.delivery}
              </span>
              {selectedAnn.scheduledAt && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-100 text-amber-700">
                  ⏰ Scheduled for {formatDate(selectedAnn.scheduledAt)}
                </span>
              )}
            </div>

            {/* Message */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap font-medium">{selectedAnn.content}</p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-xs text-blue-600 font-semibold">Created By</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{selectedAnn.createdBy?.name || user?.name || 'Unknown'}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <p className="text-xs text-green-600 font-semibold">Created On</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{formatDate(selectedAnn.createdAt)}</p>
              </div>
            </div>

            {/* Targets */}
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Target Roles</p>
                <div className="flex flex-wrap gap-2">
                  {selectedAnn.targetRoles?.map((role) => (
                    <span key={role} className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">
                      👤 {role}
                    </span>
                  ))}
                </div>
              </div>
              {selectedAnn.targetClasses?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Target Classes</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAnn.targetClasses.map((cls) => (
                      <span key={cls} className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                        📚 {cls}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Read Statistics */}
            {readStats && (
              <div className="pt-4 border-t">
                <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">📊 Delivery Statistics</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center border border-blue-200">
                    <p className="text-3xl font-bold text-blue-700">{readStats.total || 0}</p>
                    <p className="text-xs text-blue-600 font-semibold mt-1">Total Recipients</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center border border-green-200">
                    <p className="text-3xl font-bold text-green-700">{readStats.read || 0}</p>
                    <p className="text-xs text-green-600 font-semibold mt-1">Read</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 text-center border border-yellow-200">
                    <p className="text-3xl font-bold text-yellow-700">{readStats.delivered || 0}</p>
                    <p className="text-xs text-yellow-600 font-semibold mt-1">Delivered</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Modal */}
      <Modal 
        isOpen={showCreate} 
        onClose={() => { setShowCreate(false); resetForm(); }} 
        title="Create New Announcement" 
        size="lg"
        footer={
          <>
            <Button 
              variant="secondary" 
              type="button" 
              onClick={() => { setShowCreate(false); resetForm(); }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="create-announcement-form" 
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Create Announcement
            </Button>
          </>
        }
      >
        <form id="create-announcement-form" onSubmit={handleCreate} className="space-y-5">
          {/* Title */}
          <div>
            <Input 
              label="Title"
              value={form.title} 
              onChange={(e) => setForm({ ...form, title: e.target.value })} 
              required 
              placeholder="e.g., School Closure Due to Weather"
              className="w-full"
            />
          </div>

          {/* Type */}
          <div>
            <DropdownTable 
              label="Type"
              value={form.type} 
              onChange={(val) => setForm({ ...form, type: val })} 
              placeholder="Select type" 
              icon="📌"
              required
              options={TYPES.map((t) => ({ value: t, label: t, searchFields: [t] }))} 
              columns={[{ key: 'label', label: 'Type' }]}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Content
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 resize-none" 
              rows={4} 
              value={form.content} 
              onChange={(e) => setForm({ ...form, content: e.target.value })} 
              required 
              placeholder="Write your announcement message here..." 
            />
            <p className="text-xs text-gray-500 mt-1">{form.content.length}/1000 characters</p>
          </div>

          {/* Target Roles */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Target Roles
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="flex gap-3 flex-wrap">
              {['TEACHER', 'PARENT'].map((role) => (
                <label 
                  key={role} 
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all font-medium ${
                    form.targetRoles.includes(role) 
                      ? 'bg-purple-50 border-purple-500 text-purple-700' 
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <input type="checkbox" checked={form.targetRoles.includes(role)} onChange={() => toggleRole(role)} className="rounded cursor-pointer w-4 h-4" />
                  <span>{role}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Target Classes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-bold text-gray-900">Target Classes (Optional)</label>
              <button
                type="button"
                onClick={() => {
                  const allSelected = CLASSES.every((cls) => form.targetClasses.includes(cls));
                  setForm((prev) => ({
                    ...prev,
                    targetClasses: allSelected ? [] : [...CLASSES],
                  }));
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline underline-offset-2"
              >
                {CLASSES.every((cls) => form.targetClasses.includes(cls)) ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            <div className="flex gap-2.5 flex-wrap">
              {CLASSES.map((cls) => (
                <label 
                  key={cls} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 cursor-pointer transition-all text-xs font-semibold ${
                    form.targetClasses.includes(cls) 
                      ? 'bg-blue-50 border-blue-500 text-blue-700' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <input type="checkbox" checked={form.targetClasses.includes(cls)} onChange={() => toggleClass(cls)} className="rounded cursor-pointer w-3 h-3" />
                  <span>{cls}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Schedule (Optional)</label>
            <Input 
              type="datetime-local" 
              value={form.scheduledAt} 
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank to send immediately</p>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setAnnouncementToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Announcement"
        message={`Are you sure you want to delete "${announcementToDelete?.title}"? This action cannot be undone and all related notifications will also be deleted.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
