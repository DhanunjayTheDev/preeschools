import { useEffect, useState } from 'react';
import useStudentStore from '../../stores/studentStore';
import { Button, Card, Table, Badge, Pagination, Modal, Input, DropdownTable, ActionButton, ConfirmDialog } from '../../components/ui';
import { CLASSES, SECTIONS, formatDate } from '../../lib/utils';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function Students() {
  const { students, pagination, loading, fetchStudents, deleteStudent } = useStudentStore();
  const [showCreate, setShowCreate] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [filters, setFilters] = useState({ className: '', section: '', status: '', search: '' });
  const [form, setForm] = useState({
    name: '', dateOfBirth: '', gender: '', motherTongue: '', className: '', section: 'A',
    fatherName: '', fatherPhone: '', fatherEmail: '',
    motherName: '', motherPhone: '', motherEmail: '',
    address: { street: '', city: '', state: '', pincode: '' },
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState({ studentId: null, studentName: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchStudents(filters);
  }, [fetchStudents, filters]);

  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Validation - prevent submission if required fields are empty
    const errors = {};
    if (!form.name.trim()) errors.name = 'Student name is required';
    if (!form.className) errors.className = 'Class is required';
    if (!form.gender) errors.gender = 'Gender is required';
    if (!form.section) errors.section = 'Section is required';
    
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach(err => toast.error(err));
      return;
    }
    
    try {
      let response;
      if (photoFile) {
        const formData = new FormData();
        formData.append('photo', photoFile);
        Object.entries(form).forEach(([key, val]) => {
          if (key === 'address') {
            Object.entries(val).forEach(([aKey, aVal]) => {
              if (aVal) formData.append(`address[${aKey}]`, aVal);
            });
          } else if (val) {
            formData.append(key, val);
          }
        });
        response = await api.post('/students', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await api.post('/students', form);
      }
      toast.success(`✅ Student "${form.name}" created successfully! ID: ${response.data.student.studentId}`);
      setShowCreate(false);
      setPhotoFile(null);
      setForm({
        name: '', dateOfBirth: '', gender: '', motherTongue: '', className: '', section: 'A',
        fatherName: '', fatherPhone: '', fatherEmail: '',
        motherName: '', motherPhone: '', motherEmail: '',
        address: { street: '', city: '', state: '', pincode: '' },
      });
      fetchStudents(filters);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const columns = [
    { key: 'studentId', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'className', label: 'Class' },
    { key: 'section', label: 'Section' },
    { key: 'fatherName', label: 'Father' },
    { key: 'fatherPhone', label: 'Phone' },
    { key: 'status', label: 'Status', render: (row) => (
      <Badge color={row.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{row.status}</Badge>
    )},
    { key: 'admissionDate', label: 'Admitted', render: (row) => formatDate(row.admissionDate) },
    { key: 'actions', label: '', render: (row) => (
      <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(row._id, row.name); }} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
    )},
  ];

  const handleDeleteClick = (id, name) => {
    setConfirmData({ studentId: id, studentName: name });
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteStudent(confirmData.studentId);
      toast.success(`🗑️ Student "${confirmData.studentName}" deleted successfully`);
      setShowConfirm(false);
      setConfirmData({ studentId: null, studentName: '' });
      fetchStudents(filters);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete student');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-500 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">School</p>
            <h1 className="text-4xl font-bold mb-2">Students</h1>
            <p className="text-blue-50 text-sm">Manage student records and profiles</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-6xl opacity-20">🎓</div>
            <ActionButton onClick={() => setShowCreate(true)} color="blue">+ Add Student</ActionButton>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-4">
          <Input placeholder="Search students..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="flex-1 min-w-[200px]" />
          <div className="min-w-[160px]"><DropdownTable value={filters.className} onChange={(val) => setFilters({ ...filters, className: val })} placeholder="All Classes" icon="🏫" options={CLASSES.map((c) => ({ value: c, label: c, searchFields: [c] }))} columns={[{ key: 'label', label: 'Class' }]} /></div>
          <div className="min-w-[160px]"><DropdownTable value={filters.section} onChange={(val) => setFilters({ ...filters, section: val })} placeholder="All Sections" icon="📍" options={SECTIONS.map((s) => ({ value: s, label: `Section ${s}`, searchFields: [s] }))} columns={[{ key: 'label', label: 'Section' }]} /></div>
          <div className="min-w-[160px]"><DropdownTable value={filters.status} onChange={(val) => setFilters({ ...filters, status: val })} placeholder="All Status" icon="🔧" options={[{ value: 'ACTIVE', label: 'Active', searchFields: ['active'] }, { value: 'INACTIVE', label: 'Inactive', searchFields: ['inactive'] }]} columns={[{ key: 'label', label: 'Status' }]} /></div>
          {(filters.search || filters.className || filters.section || filters.status) && (
            <Button variant="secondary" size="sm" onClick={() => setFilters({ className: '', section: '', status: '', search: '' })}>Clear</Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table columns={columns} data={students} loading={loading} />
        <Pagination pagination={pagination} onPageChange={(p) => fetchStudents({ ...filters, page: p })} />
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add Student" size="xl"
        footer={<>
          <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button type="submit" form="create-student-form">Create Student</Button>
        </>}
      >
        <form id="create-student-form" onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Enter student name" />
            <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
            <DropdownTable label="Gender" value={form.gender} onChange={(val) => setForm({ ...form, gender: val })} placeholder="Select" icon="👤" required options={[{ value: 'Male', label: 'Male', searchFields: ['male', 'boy'] }, { value: 'Female', label: 'Female', searchFields: ['female', 'girl'] }, { value: 'Other', label: 'Other', searchFields: ['other'] }]} columns={[{ key: 'label', label: 'Gender' }]} />
            <Input label="Mother Tongue" value={form.motherTongue} onChange={(e) => setForm({ ...form, motherTongue: e.target.value })} />
            <DropdownTable label="Class" value={form.className} onChange={(val) => setForm({ ...form, className: val })} placeholder="Select" icon="🏫" required options={CLASSES.map((c) => ({ value: c, label: c, searchFields: [c] }))} columns={[{ key: 'label', label: 'Class' }]} />
            <DropdownTable label="Section" value={form.section} onChange={(val) => setForm({ ...form, section: val })} placeholder="Select" icon="📍" required options={SECTIONS.map((s) => ({ value: s, label: `Section ${s}`, searchFields: [s] }))} columns={[{ key: 'label', label: 'Section' }]} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
            <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
          <h4 className="font-medium text-gray-700 pt-2 border-t">Father Details</h4>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Name" value={form.fatherName} onChange={(e) => setForm({ ...form, fatherName: e.target.value })} placeholder="Father's full name" />
            <Input label="Phone" value={form.fatherPhone} onChange={(e) => setForm({ ...form, fatherPhone: e.target.value })} placeholder="10-digit phone number" />
            <Input label="Email" type="email" value={form.fatherEmail} onChange={(e) => setForm({ ...form, fatherEmail: e.target.value })} placeholder="father@email.com" />
          </div>
          <h4 className="font-medium text-gray-700 pt-2 border-t">Mother Details</h4>
          <div className="grid grid-cols-3 gap-4">
            <Input label="Name" value={form.motherName} onChange={(e) => setForm({ ...form, motherName: e.target.value })} placeholder="Mother's full name" />
            <Input label="Phone" value={form.motherPhone} onChange={(e) => setForm({ ...form, motherPhone: e.target.value })} placeholder="10-digit phone number" />
            <Input label="Email" type="email" value={form.motherEmail} onChange={(e) => setForm({ ...form, motherEmail: e.target.value })} placeholder="mother@email.com" />
          </div>
          <h4 className="font-medium text-gray-700 pt-2 border-t">Address (Optional)</h4>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Street" value={form.address.street} onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })} placeholder="Street address" />
            <Input label="City" value={form.address.city} onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })} placeholder="City name" />
            <Input label="State" value={form.address.state} onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })} placeholder="State name" />
            <Input label="Pincode" value={form.address.pincode} onChange={(e) => setForm({ ...form, address: { ...form.address, pincode: e.target.value } })} placeholder="6-digit pincode" />
          </div>
        </form>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => { setShowConfirm(false); setConfirmData({ studentId: null, studentName: '' }); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        message={`Are you sure you want to delete student "${confirmData.studentName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
