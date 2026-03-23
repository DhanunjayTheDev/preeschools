import { useEffect, useState } from 'react';
import useTeacherRegistrationStore from '../../stores/teacherRegistrationStore';
import { Button, Card, Table, Badge, Pagination, Modal, Input, DropdownTable, Textarea, ActionButton, ConfirmDialog, StatCard } from '../../components/ui';
import { TEACHER_REG_STATUSES, CLASSES, getStatusColor, formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

const INITIAL_FORM = {
  name: '', email: '', phone: '', dateOfBirth: '', gender: '',
  qualification: '', specialization: '', experienceYears: '', previousSchool: '',
  subjects: '', preferredClasses: [],
  address: { street: '', city: '', state: '', pincode: '', country: 'India' },
  source: 'Walk-in', expectedSalary: '', availableFrom: '',
};

export default function TeacherRegistrations() {
  const { registrations, pagination, stats, loading, fetchRegistrations, createRegistration, updateRegistration, updateStatus, addNote, deleteRegistration, fetchStats } = useTeacherRegistrationStore();
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [form, setForm] = useState(INITIAL_FORM);
  const [noteText, setNoteText] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState({ id: null, name: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchRegistrations(filters);
    fetchStats();
  }, [fetchRegistrations, fetchStats, filters]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    if (!form.phone.trim()) { toast.error('Phone is required'); return; }
    if (!form.qualification.trim()) { toast.error('Qualification is required'); return; }

    try {
      const submitData = {
        ...form,
        experienceYears: form.experienceYears ? Number(form.experienceYears) : 0,
        expectedSalary: form.expectedSalary ? Number(form.expectedSalary) : undefined,
        subjects: form.subjects ? form.subjects.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };
      await createRegistration(submitData);
      toast.success('Teacher registration created');
      setShowCreate(false);
      setForm(INITIAL_FORM);
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create registration');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus(id, status);
      toast.success(`Status updated to ${status}`);
      if (selected?._id === id) {
        setSelected({ ...selected, status });
      }
      fetchStats();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      await addNote(selected._id, noteText);
      setNoteText('');
      const updated = registrations.find((r) => r._id === selected._id);
      if (updated) setSelected(updated);
      toast.success('Note added');
    } catch {
      toast.error('Failed to add note');
    }
  };

  const handleDeleteClick = (id, name) => {
    setConfirmData({ id, name });
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteRegistration(confirmData.id);
      toast.success('Registration deleted');
      setShowConfirm(false);
      setConfirmData({ id: null, name: '' });
      if (selected?._id === confirmData.id) {
        setShowDetail(false);
        setSelected(null);
      }
      fetchStats();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  const openDetail = (row) => {
    setSelected(row);
    setShowDetail(true);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'qualification', label: 'Qualification' },
    { key: 'experienceYears', label: 'Experience', render: (row) => `${row.experienceYears || 0} yrs` },
    { key: 'source', label: 'Source' },
    { key: 'status', label: 'Status', render: (row) => <Badge color={getStatusColor(row.status, TEACHER_REG_STATUSES)}>{row.status}</Badge> },
    { key: 'createdAt', label: 'Applied', render: (row) => formatDate(row.createdAt) },
    {
      key: 'actions', label: '', render: (row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => openDetail(row)} className="text-primary-600 hover:text-primary-800 text-sm font-medium">View</button>
          <button onClick={() => handleDeleteClick(row._id, row.name)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-violet-100 text-sm font-medium mb-1">Recruitment</p>
            <h1 className="text-4xl font-bold mb-2">Teacher Applications</h1>
            <p className="text-violet-50 text-sm">Manage teacher job registrations and applications</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-6xl opacity-20">📝</div>
            <Button onClick={() => setShowCreate(true)} className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">+ New Registration</Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Applications" value={stats.total || 0} icon="📋" color="blue" />
          <StatCard title="This Month" value={stats.thisMonth || 0} icon="📅" color="green" />
          <StatCard title="Shortlisted" value={stats.byStatus?.SHORTLISTED || 0} icon="⭐" color="indigo" />
          <StatCard title="Hired" value={stats.byStatus?.HIRED || 0} icon="✅" color="emerald" />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <Input placeholder="Search by name, phone, email..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="flex-1 min-w-[200px]" />
          <DropdownTable
            value={filters.status}
            onChange={(val) => setFilters({ ...filters, status: val })}
            placeholder="All Statuses"
            icon="📊"
            options={TEACHER_REG_STATUSES.map((s) => ({ value: s.value, label: s.label, searchFields: [s.label, s.value] }))}
            columns={[{ key: 'label', label: 'Status' }]}
          />
          {(filters.search || filters.status) && (
            <Button variant="secondary" size="sm" onClick={() => setFilters({ status: '', search: '' })}>Clear</Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table columns={columns} data={registrations} loading={loading} onRowClick={openDetail} />
        <Pagination pagination={pagination} onPageChange={(p) => fetchRegistrations({ ...filters, page: p })} />
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Teacher Registration" size="xl"
        footer={<>
          <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button type="submit" form="create-teacher-reg-form" className="bg-gradient-to-r from-purple-600 to-fuchsia-600">Create Registration</Button>
        </>}
      >
        <form id="create-teacher-reg-form" onSubmit={handleCreate} className="space-y-4">
          {/* Personal Info */}
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
            <h4 className="font-semibold text-violet-900 mb-3">👤 Personal Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Full name" />
              <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required type="tel" placeholder="10-digit number" />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
              <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
              <DropdownTable
                label="Gender"
                value={form.gender}
                onChange={(val) => setForm({ ...form, gender: val })}
                placeholder="Select gender"
                icon="👤"
                options={[{ value: 'Male', label: 'Male', searchFields: ['male'] }, { value: 'Female', label: 'Female', searchFields: ['female'] }, { value: 'Other', label: 'Other', searchFields: ['other'] }]}
                columns={[{ key: 'label', label: 'Gender' }]}
              />
            </div>
          </div>

          {/* Professional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3">🎓 Professional Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Qualification" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} required placeholder="e.g., B.Ed, M.Ed, B.A" />
              <Input label="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="e.g., Mathematics, English" />
              <Input label="Experience (Years)" type="number" value={form.experienceYears} onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} placeholder="0" min="0" />
              <Input label="Previous School" value={form.previousSchool} onChange={(e) => setForm({ ...form, previousSchool: e.target.value })} placeholder="School name" />
              <Input label="Subjects (comma separated)" value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} placeholder="Math, English, Science" className="col-span-2" />
              <DropdownTable
                label="Preferred Classes"
                value={form.preferredClasses.join(', ')}
                onChange={(val) => {
                  const classes = form.preferredClasses.includes(val) ? form.preferredClasses.filter((c) => c !== val) : [...form.preferredClasses, val];
                  setForm({ ...form, preferredClasses: classes });
                }}
                placeholder="Select classes"
                icon="🏫"
                options={CLASSES.map((c) => ({ value: c, label: c, searchFields: [c] }))}
                columns={[{ key: 'label', label: 'Class' }]}
              />
            </div>
          </div>

          {/* Address */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-orange-900 mb-3">📍 Address</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Street" value={form.address.street} onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })} placeholder="Street address" />
              <Input label="City" value={form.address.city} onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })} placeholder="City" />
              <Input label="State" value={form.address.state} onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })} placeholder="State" />
              <Input label="Pincode" value={form.address.pincode} onChange={(e) => setForm({ ...form, address: { ...form.address, pincode: e.target.value } })} placeholder="6-digit code" />
            </div>
          </div>

          {/* Application Details */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-3">📋 Application Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <DropdownTable
                label="Source"
                value={form.source}
                onChange={(val) => setForm({ ...form, source: val })}
                placeholder="Select source"
                icon="📍"
                options={['Walk-in', 'Phone', 'Website', 'Referral', 'Job Portal', 'Social Media', 'Other'].map((s) => ({ value: s, label: s, searchFields: [s.toLowerCase()] }))}
                columns={[{ key: 'label', label: 'Source' }]}
              />
              <Input label="Expected Salary (₹)" type="number" value={form.expectedSalary} onChange={(e) => setForm({ ...form, expectedSalary: e.target.value })} placeholder="Monthly salary" />
              <Input label="Available From" type="date" value={form.availableFrom} onChange={(e) => setForm({ ...form, availableFrom: e.target.value })} />
            </div>
          </div>
        </form>
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={showDetail} onClose={() => { setShowDetail(false); setSelected(null); }} title="Teacher Application Details" size="xl"
        footer={<>
          <Button variant="secondary" onClick={() => { setShowDetail(false); setSelected(null); }}>Close</Button>
          <Button variant="danger" onClick={() => { setShowDetail(false); handleDeleteClick(selected?._id, selected?.name); }}>Delete</Button>
        </>}
      >
        {selected && (
          <div className="space-y-4">
            {/* Status Bar */}
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                <Badge color={getStatusColor(selected.status, TEACHER_REG_STATUSES)}>{selected.status}</Badge>
              </div>
              <DropdownTable
                value={selected.status}
                onChange={(val) => handleStatusChange(selected._id, val)}
                placeholder="Change Status"
                icon="🔄"
                options={TEACHER_REG_STATUSES.map((s) => ({ value: s.value, label: s.label, searchFields: [s.label] }))}
                columns={[{ key: 'label', label: 'Status' }]}
              />
            </div>

            {/* Personal Info */}
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
              <h4 className="font-semibold text-violet-900 mb-3">👤 Personal Information</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Name:</span> <span className="font-medium">{selected.name}</span></div>
                <div><span className="text-gray-500">Phone:</span> <span className="font-medium">{selected.phone}</span></div>
                <div><span className="text-gray-500">Email:</span> <span className="font-medium">{selected.email || '-'}</span></div>
                <div><span className="text-gray-500">Date of Birth:</span> <span className="font-medium">{formatDate(selected.dateOfBirth)}</span></div>
                <div><span className="text-gray-500">Gender:</span> <span className="font-medium">{selected.gender || '-'}</span></div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">🎓 Professional Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Qualification:</span> <span className="font-medium">{selected.qualification}</span></div>
                <div><span className="text-gray-500">Specialization:</span> <span className="font-medium">{selected.specialization || '-'}</span></div>
                <div><span className="text-gray-500">Experience:</span> <span className="font-medium">{selected.experienceYears || 0} years</span></div>
                <div><span className="text-gray-500">Previous School:</span> <span className="font-medium">{selected.previousSchool || '-'}</span></div>
                <div><span className="text-gray-500">Subjects:</span> <span className="font-medium">{selected.subjects?.join(', ') || '-'}</span></div>
                <div><span className="text-gray-500">Preferred Classes:</span> <span className="font-medium">{selected.preferredClasses?.join(', ') || '-'}</span></div>
                <div><span className="text-gray-500">Expected Salary:</span> <span className="font-medium">{selected.expectedSalary ? `₹${selected.expectedSalary.toLocaleString('en-IN')}` : '-'}</span></div>
                <div><span className="text-gray-500">Available From:</span> <span className="font-medium">{formatDate(selected.availableFrom)}</span></div>
              </div>
            </div>

            {/* Address */}
            {selected.address && (selected.address.street || selected.address.city) && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-3">📍 Address</h4>
                <p className="text-sm text-gray-700">
                  {[selected.address.street, selected.address.city, selected.address.state, selected.address.pincode, selected.address.country].filter(Boolean).join(', ')}
                </p>
              </div>
            )}

            {/* Application Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3">📋 Application Info</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Source:</span> <span className="font-medium">{selected.source || '-'}</span></div>
                <div><span className="text-gray-500">Applied:</span> <span className="font-medium">{formatDate(selected.createdAt)}</span></div>
                {selected.interviewDate && <div><span className="text-gray-500">Interview Date:</span> <span className="font-medium">{formatDate(selected.interviewDate)}</span></div>}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">📝 Notes</h4>
              {selected.notes?.length > 0 ? (
                <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                  {selected.notes.map((note, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-2 text-sm border">
                      <p>{note.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{note.addedBy?.name || 'System'} — {formatDate(note.addedAt)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 mb-3">No notes yet</p>
              )}
              <div className="flex gap-2">
                <Input placeholder="Add a note..." value={noteText} onChange={(e) => setNoteText(e.target.value)} className="flex-1" />
                <Button onClick={handleAddNote} size="sm">Add</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => { setShowConfirm(false); setConfirmData({ id: null, name: '' }); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Registration"
        message={`Are you sure you want to delete "${confirmData.name}"'s registration? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
