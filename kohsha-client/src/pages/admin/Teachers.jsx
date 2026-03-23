import { useEffect, useState } from 'react';
import { Button, Card, Table, Badge, Modal, Loading, Input } from '../../components/ui';
import { CLASSES } from '../../lib/utils';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showAssign, setShowAssign] = useState(false);
  const [assignClasses, setAssignClasses] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users/teachers');
      setTeachers(data.users || []);
    } catch {
      toast.error('Failed to fetch teachers');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTeachers(); }, []);

  useEffect(() => {
    let result = teachers;
    if (search) result = result.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase()));
    if (statusFilter) result = result.filter((t) => statusFilter === 'active' ? t.isActive : !t.isActive);
    setFiltered(result);
  }, [teachers, search, statusFilter]);

  const handleToggleActive = async (id) => {
    try {
      await api.patch(`/users/${id}/toggle-active`);
      toast.success('Status updated');
      fetchTeachers();
    } catch { toast.error('Failed'); }
  };

  const openAssignModal = (teacher) => {
    setSelectedTeacher(teacher);
    setAssignClasses(teacher.assignedClasses || []);
    setShowAssign(true);
  };

  const toggleClass = (cls) => {
    setAssignClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  };

  const handleAssignClasses = async () => {
    try {
      await api.put(`/users/teachers/${selectedTeacher._id}/assign-classes`, { classes: assignClasses });
      toast.success('Classes assigned');
      setShowAssign(false);
      fetchTeachers();
    } catch { toast.error('Failed'); }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm font-medium mb-1">Staff</p>
            <h1 className="text-4xl font-bold mb-2">Teacher Management</h1>
            <p className="text-purple-50 text-sm">{filtered.length} teacher{filtered.length !== 1 ? 's' : ''} • Manage assignments and access</p>
          </div>
          <div className="text-6xl opacity-20">👨‍🏫</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[220px]"
          />
          <div className="flex gap-2">
            {['', 'active', 'inactive'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                  statusFilter === s
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-purple-400 hover:text-purple-600'
                }`}
              >
                {s === '' ? 'All' : s === 'active' ? '✅ Active' : '❌ Inactive'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table
          columns={[
            { key: 'name', label: 'Name', render: (r) => (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {r.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.email}</p>
                </div>
              </div>
            )},
            { key: 'phone', label: 'Phone', render: (r) => r.phone || <span className="text-gray-400">—</span> },
            { key: 'assignedClasses', label: 'Assigned Classes', render: (r) => (
              <div className="flex gap-1 flex-wrap">
                {r.assignedClasses?.length > 0
                  ? r.assignedClasses.map((c) => <Badge key={`${c.className}-${c.section}`} color="bg-blue-100 text-blue-700">{c.className}{c.section ? ` - ${c.section}` : ''}</Badge>)
                  : <span className="text-gray-400 text-sm">No classes assigned</span>}
              </div>
            )},
            { key: 'isActive', label: 'Status', render: (r) => (
              <Badge color={r.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>{r.isActive ? 'Active' : 'Inactive'}</Badge>
            )},
            { key: 'actions', label: 'Actions', render: (r) => (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => openAssignModal(r)}>Assign Classes</Button>
                <Button size="sm" variant={r.isActive ? 'danger' : 'success'} onClick={() => handleToggleActive(r._id)}>
                  {r.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            )},
          ]}
          data={filtered}
          loading={loading}
        />
      </div>

      {/* Assign Classes Modal */}
      <Modal isOpen={showAssign} onClose={() => setShowAssign(false)} title={`Assign Classes to ${selectedTeacher?.name}`}
        footer={<>
          <Button variant="secondary" onClick={() => setShowAssign(false)}>Cancel</Button>
          <Button onClick={handleAssignClasses} className="bg-gradient-to-r from-primary-600 to-blue-600">Save Assignments</Button>
        </>}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Select the classes this teacher will manage.</p>
          <div className="bg-gray-50 rounded-lg p-4 max-h-80 overflow-y-auto">
            <div className="space-y-3">
              {CLASSES.map((cls) => (
                <label key={cls} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  assignClasses.includes(cls)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                  <input
                    type="checkbox"
                    checked={assignClasses.includes(cls)}
                    onChange={() => toggleClass(cls)}
                    className="rounded border-gray-300 cursor-pointer"
                  />
                  <span className="font-medium text-base">{cls}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <strong>Selected:</strong> {assignClasses.length > 0 ? assignClasses.join(', ') : 'None'}
          </div>
        </div>
      </Modal>
    </div>
  );
}
