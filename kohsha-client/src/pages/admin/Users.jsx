import { useEffect, useState } from 'react';
import { Button, Card, Table, Badge, Modal, Input, DropdownTable, Pagination, Loading, ActionButton, ConfirmDialog } from '../../components/ui';
import { formatDate } from '../../lib/utils';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const ROLES = ['ADMIN', 'TEACHER', 'PARENT'];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({ role: '', search: '' });
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'TEACHER' });
  const [editForm, setEditForm] = useState({ name: '', phone: '', role: '' });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState({ userId: null, userName: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async (params) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      const p = { ...filters, ...params };
      Object.entries(p).forEach(([k, v]) => { if (v) query.set(k, v); });
      const { data } = await api.get(`/users?${query.toString()}`);
      setUsers(data.users || []);
      setPagination(data.pagination || {});
    } catch {
      toast.error('Failed to fetch users');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [filters]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      toast.success('User created');
      setShowCreate(false);
      setForm({ name: '', email: '', password: '', phone: '', role: 'TEACHER' });
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleToggleActive = async (id) => {
    try {
      await api.patch(`/users/${id}/toggle-active`);
      toast.success('Status updated');
      fetchUsers();
    } catch { toast.error('Failed'); }
  };

  const handleDeleteClick = (id, name) => {
    setConfirmData({ userId: id, userName: name });
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/users/${confirmData.userId}`);
      toast.success('User deleted');
      setShowConfirm(false);
      setConfirmData({ userId: null, userName: '' });
      fetchUsers();
    } catch { toast.error('Failed to delete'); }
    finally { setIsDeleting(false); }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({ name: user.name, phone: user.phone || '', role: user.role });
    setShowEdit(true);
  };

  const openDetailModal = async (id) => {
    try {
      const { data } = await api.get(`/users/${id}`);
      setSelectedUser(data.user || data);
      setShowDetail(true);
    } catch { toast.error('Failed to fetch user details'); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${selectedUser._id}`, editForm);
      toast.success('User updated');
      setShowEdit(false);
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-sm font-medium mb-1">Administration</p>
            <h1 className="text-4xl font-bold mb-2">User Management</h1>
            <p className="text-indigo-50 text-sm">{users.length} users registered</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-6xl opacity-20">👥</div>
            <ActionButton onClick={() => setShowCreate(true)} color="indigo">+ Create User</ActionButton>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <Input placeholder="Search by name, email, phone..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="flex-1 min-w-[220px]" />
          <div className="min-w-[180px]">
            <DropdownTable
              value={filters.role}
              onChange={(val) => setFilters({ ...filters, role: val })}
              placeholder="All Roles"
              icon="👤"
              options={ROLES.map((r) => ({ value: r, label: r, icon: r === 'ADMIN' ? '👨‍💼' : r === 'TEACHER' ? '👨‍🏫' : '👨‍👩‍👧', searchFields: [r, r.toLowerCase()] }))}
              columns={[{ key: 'role', label: 'Role', render: (opt) => opt.icon + ' ' + opt.label }]}
            />
          </div>
          {(filters.search || filters.role) && (
            <Button variant="secondary" size="sm" onClick={() => setFilters({ role: '', search: '' })}>Clear</Button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table
          columns={[
            { key: 'name', label: 'Name', render: (r) => (
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                  r.role === 'SUPER_ADMIN' ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
                  r.role === 'ADMIN' ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
                  r.role === 'TEACHER' ? 'bg-gradient-to-br from-green-500 to-green-700' :
                  'bg-gradient-to-br from-orange-400 to-orange-600'
                }`}>{r.name?.charAt(0)?.toUpperCase()}</div>
                <div>
                  <p className="font-semibold text-gray-900">{r.name}</p>
                  <p className="text-xs text-gray-500">{r.email}</p>
                </div>
              </div>
            )},
            { key: 'phone', label: 'Phone', render: (r) => r.phone || <span className="text-gray-400">—</span> },
            { key: 'role', label: 'Role', render: (r) => (
              <Badge color={r.role === 'SUPER_ADMIN' ? 'purple' : r.role === 'ADMIN' ? 'blue' : r.role === 'TEACHER' ? 'green' : 'yellow'}>{r.role}</Badge>
            )},
            { key: 'isActive', label: 'Status', render: (r) => (
              <Badge color={r.isActive ? 'green' : 'red'}>{r.isActive ? 'Active' : 'Inactive'}</Badge>
            )},
            { key: 'createdAt', label: 'Created', render: (r) => formatDate(r.createdAt) },
            { key: 'actions', label: 'Actions', render: (r) => (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button title="View Details" onClick={() => openDetailModal(r._id)} className="p-2 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors text-base">
                  👁️
                </button>
                <button title="Edit" onClick={() => openEditModal(r)} className="p-2 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition-colors text-base">
                  ✏️
                </button>
                <button
                  title={r.isActive ? 'Deactivate' : 'Activate'}
                  onClick={() => handleToggleActive(r._id)}
                  className={`p-2 rounded-lg transition-colors text-base ${r.isActive ? 'hover:bg-red-50 text-gray-400 hover:text-red-600' : 'hover:bg-green-50 text-gray-400 hover:text-green-600'}`}
                >
                  {r.isActive ? '🔴' : '✅'}
                </button>
                {r.role !== 'SUPER_ADMIN' && (
                  <button title="Delete" onClick={() => handleDeleteClick(r._id, r.name)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors text-base">
                    🗑️
                  </button>
                )}
              </div>
            )},
          ]}
          data={users}
          loading={loading}
        />
        <Pagination pagination={pagination} onPageChange={(p) => fetchUsers({ page: p })} />
      </div>

      {/* Create User Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create User"
        footer={<>
          <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button type="submit" form="create-user-form">Create User</Button>
        </>}
      >
        <form id="create-user-form" onSubmit={handleCreate} className="space-y-4">
          <Input label="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Email *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input label="Password *" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <DropdownTable 
            label="Role *" 
            value={form.role} 
            onChange={(val) => setForm({ ...form, role: val })} 
            placeholder="Select role" 
            icon="👤" 
            options={ROLES.map((r) => ({ 
              value: r, 
              label: r, 
              icon: r === 'ADMIN' ? '👨‍💼' : r === 'TEACHER' ? '👨‍🏫' : r === 'PARENT' ? '👨‍👩‍👧' : '👤', 
              searchFields: [r] 
            }))} 
            columns={[{ 
              key: 'role', 
              label: 'Role', 
              render: (opt) => opt.icon + ' ' + opt.label 
            }]} 
          />
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title={`Edit User: ${selectedUser?.name}`}
        footer={<>
          <Button variant="secondary" type="button" onClick={() => setShowEdit(false)}>Cancel</Button>
          <Button type="submit" form="edit-user-form">Save Changes</Button>
        </>}
      >
        <form id="edit-user-form" onSubmit={handleEdit} className="space-y-4">
          <Input label="Full Name *" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
          <Input label="Phone" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
          <DropdownTable 
            label="Role" 
            value={editForm.role} 
            onChange={(val) => setEditForm({ ...editForm, role: val })} 
            placeholder="Select role" 
            icon="👤" 
            options={ROLES.map((r) => ({ value: r, label: r, icon: r === 'ADMIN' ? '👨‍💼' : r === 'TEACHER' ? '👨‍🏫' : r === 'PARENT' ? '👨‍👩‍👧' : '👤', searchFields: [r] }))} 
            columns={[{ key: 'role', label: 'Role', render: (opt) => opt.icon + ' ' + opt.label }]} 
          />
        </form>
      </Modal>

      {/* User Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => { setShowDetail(false); setSelectedUser(null); }} title="User Details" size="lg">
        {selectedUser && (
          <div className="space-y-5">
            {/* User Card */}
            <div className={`rounded-xl p-5 text-white ${
              selectedUser.role === 'SUPER_ADMIN' ? 'bg-gradient-to-r from-purple-500 to-purple-700' :
              selectedUser.role === 'ADMIN' ? 'bg-gradient-to-r from-blue-500 to-blue-700' :
              selectedUser.role === 'TEACHER' ? 'bg-gradient-to-r from-green-500 to-green-700' :
              'bg-gradient-to-r from-orange-400 to-orange-600'
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
                  {selectedUser.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <p className="text-white/80 text-sm">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-1.5">
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">{selectedUser.role}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${selectedUser.isActive ? 'bg-green-400/30' : 'bg-red-400/30'}`}>
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-500 font-semibold uppercase">Phone</p>
                <p className="font-semibold text-gray-900 mt-1">{selectedUser.phone || '—'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-500 font-semibold uppercase">Last Login</p>
                <p className="font-semibold text-gray-900 mt-1">{selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Never'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <p className="text-xs text-gray-500 font-semibold uppercase">Created</p>
                <p className="font-semibold text-gray-900 mt-1">{formatDate(selectedUser.createdAt)}</p>
              </div>
            </div>
            {selectedUser.assignedClasses?.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">Assigned Classes</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedUser.assignedClasses.map((c) => <Badge key={c} color="blue">{c}</Badge>)}
                </div>
              </div>
            )}
            {selectedUser.children?.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-500 mb-2">Children (Students)</p>
                <div className="space-y-2">
                  {selectedUser.children.map((child) => (
                    <div key={child._id} className="flex items-center gap-3 p-2 rounded bg-gray-50">
                      <span className="font-medium text-gray-900">{child.name || child.studentId}</span>
                      {child.className && <Badge>{child.className}-{child.section}</Badge>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => { setShowConfirm(false); setConfirmData({ userId: null, userName: '' }); }}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to permanently delete user "${confirmData.userName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
