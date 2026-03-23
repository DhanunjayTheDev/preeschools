import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEnquiryStore from '../../stores/enquiryStore';
import { Button, Card, Table, Badge, Pagination, Modal, Input, DropdownTable, Textarea, ActionButton, ConfirmDialog } from '../../components/ui';
import { ENQUIRY_STATUSES, CLASSES, getStatusColor, formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function Enquiries() {
  const { enquiries, pagination, loading, fetchEnquiries, createEnquiry, deleteEnquiry } = useEnquiryStore();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = useState(false);
  const [filters, setFilters] = useState({ status: '', admissionClass: '', search: '' });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState({ enquiryId: null, enquiryName: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [form, setForm] = useState({
    studentName: '', dateOfBirth: '', gender: '', motherTongue: '', admissionClass: '', previousClass: '', previousSchool: '',
    fatherName: '', fatherPhone: '', fatherEmail: '', fatherProfession: '',
    motherName: '', motherPhone: '', motherEmail: '', motherProfession: '',
    address: { street: '', city: '', state: '', pincode: '', country: 'India' },
    source: 'Walk-in',
  });

  useEffect(() => {
    fetchEnquiries(filters);
  }, [fetchEnquiries, filters]);

  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.studentName.trim()) {
      toast.error('Student name is required');
      return;
    }
    if (!form.admissionClass) {
      toast.error('Admission class is required');
      return;
    }
    if (!form.gender) {
      toast.error('Gender is required');
      return;
    }
    
    try {
      await createEnquiry(form);
      toast.success('Enquiry created');
      setShowCreate(false);
      setForm({ studentName: '', dateOfBirth: '', gender: '', motherTongue: '', admissionClass: '', previousClass: '', previousSchool: '', fatherName: '', fatherPhone: '', fatherEmail: '', fatherProfession: '', motherName: '', motherPhone: '', motherEmail: '', motherProfession: '', address: { street: '', city: '', state: '', pincode: '', country: 'India' }, source: 'Walk-in' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create enquiry');
    }
  };

  const handleDeleteClick = (id, name) => {
    setConfirmData({ enquiryId: id, enquiryName: name });
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteEnquiry(confirmData.enquiryId);
      toast.success('Enquiry deleted');
      setShowConfirm(false);
      setConfirmData({ enquiryId: null, enquiryName: '' });
    } catch {
      toast.error('Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: 'studentName', label: 'Student Name' },
    { key: 'admissionClass', label: 'Class' },
    { key: 'fatherName', label: 'Father' },
    { key: 'fatherPhone', label: 'Phone' },
    { key: 'source', label: 'Source' },
    { key: 'status', label: 'Status', render: (row) => <Badge color={getStatusColor(row.status, ENQUIRY_STATUSES)}>{row.status}</Badge> },
    { key: 'followUpDate', label: 'Follow Up', render: (row) => formatDate(row.followUpDate) },
    { key: 'createdAt', label: 'Date', render: (row) => formatDate(row.createdAt) },
    {
      key: 'actions', label: '', render: (row) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => navigate(`/admin/enquiries/${row._id}`)} className="text-primary-600 hover:text-primary-800 text-sm font-medium">View</button>
          <button onClick={() => handleDeleteClick(row._id, row.studentName)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-teal-100 text-sm font-medium mb-1">Admissions</p>
            <h1 className="text-4xl font-bold mb-2">Enquiries</h1>
            <p className="text-teal-50 text-sm">Track and manage admission enquiries</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-6xl opacity-20">📝</div>
            <ActionButton onClick={() => setShowCreate(true)} color="teal">+ New Enquiry</ActionButton>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <Input placeholder="Search by name, phone..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="flex-1 min-w-[200px]" />
          <DropdownTable
            value={filters.status}
            onChange={(val) => setFilters({ ...filters, status: val })}
            placeholder="All Statuses"
            icon="📊"
            options={ENQUIRY_STATUSES.map((s) => ({ value: s.value, label: s.label, searchFields: [s.label, s.value] }))}
            columns={[{ key: 'label', label: 'Status' }]}
          />
          <DropdownTable
            value={filters.admissionClass}
            onChange={(val) => setFilters({ ...filters, admissionClass: val })}
            placeholder="All Classes"
            icon="🏫"
            options={CLASSES.map((c) => ({ value: c, label: c, searchFields: [c] }))}
            columns={[{ key: 'label', label: 'Class' }]}
          />
          {(filters.search || filters.status || filters.admissionClass) && (
            <Button variant="secondary" size="sm" onClick={() => setFilters({ status: '', admissionClass: '', search: '' })}>Clear</Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table columns={columns} data={enquiries} loading={loading} onRowClick={(row) => navigate(`/admin/enquiries/${row._id}`)} />
        <Pagination pagination={pagination} onPageChange={(p) => fetchEnquiries({ ...filters, page: p })} />
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Enquiry" size="xl"
        footer={<>
          <Button variant="secondary" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
          <Button type="submit" form="create-enquiry-form" className="bg-gradient-to-r from-primary-600 to-blue-600">Create Enquiry</Button>
        </>}
      >
        <form id="create-enquiry-form" onSubmit={handleCreate} className="space-y-4">
          {/* Student Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3">Student Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Student Name *" value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} required placeholder="Full name" />
              <Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
              <DropdownTable 
                label="Gender *" 
                value={form.gender} 
                onChange={(val) => setForm({ ...form, gender: val })} 
                placeholder="Select gender" 
                icon="👤"
                options={[{ value: 'Male', label: 'Male', searchFields: ['male', 'boy'] }, { value: 'Female', label: 'Female', searchFields: ['female', 'girl'] }, { value: 'Other', label: 'Other', searchFields: ['other'] }]} 
                columns={[{ key: 'label', label: 'Gender' }]}
              />
              <DropdownTable 
                label="Mother Tongue" 
                value={form.motherTongue} 
                onChange={(val) => setForm({ ...form, motherTongue: val })} 
                placeholder="Select language" 
                icon="🗣️"
                options={['English', 'Hindi', 'Tamil', 'Kannada', 'Telugu', 'Malayalam', 'Marathi', 'Gujarati', 'Bengali', 'Punjabi', 'Urdu', 'Odia', 'Assamese', 'Sanskrit', 'Other'].map((lang) => ({ value: lang, label: lang, searchFields: [lang.toLowerCase()] }))} 
                columns={[{ key: 'label', label: 'Language' }]}
              />
              <DropdownTable 
                label="Admission Class *" 
                value={form.admissionClass} 
                onChange={(val) => setForm({ ...form, admissionClass: val })} 
                placeholder="Select class" 
                icon="🏫"
                options={CLASSES.map((c) => ({ value: c, label: c, searchFields: [c] }))} 
                columns={[{ key: 'label', label: 'Class' }]}
              />
              <DropdownTable 
                label="Previous Class" 
                value={form.previousClass} 
                onChange={(val) => setForm({ ...form, previousClass: val })} 
                placeholder="Select class" 
                icon="📚"
                options={CLASSES.map((c) => ({ value: c, label: c, searchFields: [c] }))} 
                columns={[{ key: 'label', label: 'Class' }]}
              />
              <Input label="Previous School" value={form.previousSchool} onChange={(e) => setForm({ ...form, previousSchool: e.target.value })} placeholder="School name" />
            </div>
          </div>

          {/* Father Details */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-3">👨 Father Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Father Name" value={form.fatherName} onChange={(e) => setForm({ ...form, fatherName: e.target.value })} placeholder="Full name" />
              <Input label="Father Phone" value={form.fatherPhone} onChange={(e) => setForm({ ...form, fatherPhone: e.target.value })} type="tel" placeholder="10-digit number" />
              <Input label="Father Email" type="email" value={form.fatherEmail} onChange={(e) => setForm({ ...form, fatherEmail: e.target.value })} placeholder="email@example.com" />
              <Input label="Father Profession" value={form.fatherProfession} onChange={(e) => setForm({ ...form, fatherProfession: e.target.value })} placeholder="e.g., Engineer" />
            </div>
          </div>

          {/* Mother Details */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-3">👩 Mother Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Mother Name" value={form.motherName} onChange={(e) => setForm({ ...form, motherName: e.target.value })} placeholder="Full name" />
              <Input label="Mother Phone" value={form.motherPhone} onChange={(e) => setForm({ ...form, motherPhone: e.target.value })} type="tel" placeholder="10-digit number" />
              <Input label="Mother Email" type="email" value={form.motherEmail} onChange={(e) => setForm({ ...form, motherEmail: e.target.value })} placeholder="email@example.com" />
              <Input label="Mother Profession" value={form.motherProfession} onChange={(e) => setForm({ ...form, motherProfession: e.target.value })} placeholder="e.g., Doctor" />
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
              <Input label="Country" value={form.address.country} onChange={(e) => setForm({ ...form, address: { ...form.address, country: e.target.value } })} placeholder="Country" />
            </div>
          </div>

          {/* Enquiry Details */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h4 className="font-semibold text-indigo-900 mb-3">📋 Enquiry Details</h4>
            <DropdownTable 
              label="Source" 
              value={form.source} 
              onChange={(val) => setForm({ ...form, source: val })} 
              placeholder="Select source" 
              icon="📍"
              options={['Walk-in', 'Phone', 'Website', 'Referral', 'Social Media', 'Other'].map((s) => ({ value: s, label: s, searchFields: [s.toLowerCase()] }))} 
              columns={[{ key: 'label', label: 'Source' }]}
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => { setShowConfirm(false); setConfirmData({ enquiryId: null, enquiryName: '' }); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Enquiry"
        message={`Are you sure you want to delete enquiry for "${confirmData.enquiryName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
