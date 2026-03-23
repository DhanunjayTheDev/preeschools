import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useEnquiryStore from '../../stores/enquiryStore';
import { Button, Card, Badge, DropdownTable, Input, Textarea, Loading, Modal } from '../../components/ui';
import { ENQUIRY_STATUSES, SECTIONS, getStatusColor, formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function EnquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentEnquiry, loading, fetchEnquiryById, updateStatus, addNote, convertToStudent } = useEnquiryStore();
  const [noteText, setNoteText] = useState('');
  const [convertSection, setConvertSection] = useState('A');
  const [showConvert, setShowConvert] = useState(false);

  useEffect(() => {
    fetchEnquiryById(id);
  }, [id, fetchEnquiryById]);

  if (loading || !currentEnquiry) return <Loading />;

  const enquiry = currentEnquiry;

  const handleStatusChange = async (status) => {
    try {
      await updateStatus(id, status);
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    try {
      await addNote(id, noteText);
      setNoteText('');
      toast.success('Note added');
    } catch { toast.error('Failed to add note'); }
  };

  const handleConvert = async () => {
    try {
      const student = await convertToStudent(id, convertSection);
      toast.success(`Converted! Student ID: ${student.studentId}`);
      setShowConvert(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Conversion failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/enquiries')} className="text-gray-500 hover:text-gray-700">
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{enquiry.studentName}</h2>
          <Badge color={getStatusColor(enquiry.status, ENQUIRY_STATUSES)}>{enquiry.status}</Badge>
        </div>
        {enquiry.status !== 'CONVERTED' && (
          <Button onClick={() => setShowConvert(true)} variant="success">Convert to Student</Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Student Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Name:</span> <span className="font-medium">{enquiry.studentName}</span></div>
              <div><span className="text-gray-500">DOB:</span> <span className="font-medium">{formatDate(enquiry.dateOfBirth)}</span></div>
              <div><span className="text-gray-500">Gender:</span> <span className="font-medium">{enquiry.gender || '-'}</span></div>
              <div><span className="text-gray-500">Mother Tongue:</span> <span className="font-medium">{enquiry.motherTongue || '-'}</span></div>
              <div><span className="text-gray-500">Admission Class:</span> <span className="font-medium">{enquiry.admissionClass}</span></div>
              <div><span className="text-gray-500">Previous Class:</span> <span className="font-medium">{enquiry.previousClass || '-'}</span></div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Parent Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Father</h4>
                <div className="space-y-1 text-sm">
                  <p>{enquiry.fatherName || '-'}</p>
                  <p className="text-gray-500">{enquiry.fatherPhone}</p>
                  <p className="text-gray-500">{enquiry.fatherEmail}</p>
                  <p className="text-gray-500">{enquiry.fatherProfession}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Mother</h4>
                <div className="space-y-1 text-sm">
                  <p>{enquiry.motherName || '-'}</p>
                  <p className="text-gray-500">{enquiry.motherPhone}</p>
                  <p className="text-gray-500">{enquiry.motherEmail}</p>
                  <p className="text-gray-500">{enquiry.motherProfession}</p>
                </div>
              </div>
            </div>
          </Card>

          {enquiry.address && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Address</h3>
              <p className="text-sm text-gray-700">
                {[enquiry.address.street, enquiry.address.city, enquiry.address.state, enquiry.address.pincode].filter(Boolean).join(', ')}
              </p>
            </Card>
          )}
        </div>

        {/* Sidebar - Actions & Notes */}
        <div className="space-y-6">
          {/* Status Update */}
          {enquiry.status !== 'CONVERTED' && (
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
              <DropdownTable
                value={enquiry.status}
                onChange={(val) => handleStatusChange(val)}
                placeholder="Select status"
                icon="📊"
                options={ENQUIRY_STATUSES.filter((s) => s.value !== 'CONVERTED').map((s) => ({ value: s.value, label: s.label, searchFields: [s.label, s.value] }))}
                columns={[{ key: 'label', label: 'Status' }]}
              />
            </Card>
          )}

          {/* Add Note */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Add Note</h3>
            <form onSubmit={handleAddNote}>
              <Textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Type a note..." />
              <Button type="submit" size="sm" className="mt-2">Add Note</Button>
            </form>
          </Card>

          {/* Notes History */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Notes ({enquiry.notes?.length || 0})</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {enquiry.notes?.slice().reverse().map((note, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{note.text}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {note.addedBy?.name || 'System'} · {formatDate(note.addedAt)}
                  </p>
                </div>
              ))}
              {(!enquiry.notes || enquiry.notes.length === 0) && (
                <p className="text-sm text-gray-400">No notes yet</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Convert Modal */}
      <Modal isOpen={showConvert} onClose={() => setShowConvert(false)} title="Convert to Student"
        footer={<>
          <Button variant="secondary" onClick={() => setShowConvert(false)}>Cancel</Button>
          <Button variant="success" onClick={handleConvert} className="bg-gradient-to-r from-emerald-600 to-green-600">Convert to Student</Button>
        </>}
      >
        <div className="space-y-4">
          <p className="text-gray-600">Assign a section for <strong>{enquiry.studentName}</strong> in <strong>{enquiry.admissionClass}</strong>:</p>
          <DropdownTable
            label="Section *"
            value={convertSection}
            onChange={(val) => setConvertSection(val)}
            placeholder="Select section"
            icon="📍"
            options={SECTIONS.map((s) => ({ value: s, label: `Section ${s}`, searchFields: [s] }))}
            columns={[{ key: 'label', label: 'Section' }]}
            required
          />
        </div>
      </Modal>
    </div>
  );
}
