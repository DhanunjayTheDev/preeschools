import { useEffect, useState, useMemo } from 'react';
import useCalendarStore from '../../stores/calendarStore';
import { Button, Modal, Input, Badge, DropdownTable, ConfirmDialog } from '../../components/ui';
import { formatDate, CLASSES, SECTIONS } from '../../lib/utils';
import GoogleCalendar from '../../components/GoogleCalendar';
import toast from 'react-hot-toast';

const EVENT_TYPES = ['HOLIDAY', 'EVENT', 'EXAM', 'ACTIVITY', 'OTHER'];

export default function Calendar() {
  const { events, loading, fetchEventsWithHolidays, createEvent, deleteEvent } = useCalendarStore();
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [form, setForm] = useState({
    title: '', description: '', type: 'EVENT', startDate: '', endDate: '', isRecurring: false, targetClasses: [],
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmData, setConfirmData] = useState({ eventId: null, eventTitle: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchEventsWithHolidays(month, year);
  }, [month, year, fetchEventsWithHolidays]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form };
      if (!data.endDate) data.endDate = data.startDate;
      if (!data.description) delete data.description;
      if (data.targetClasses?.length === 0) delete data.targetClasses;
      await createEvent(data);
      toast.success('Event created');
      setShowCreate(false);
      setForm({ title: '', description: '', type: 'EVENT', startDate: '', endDate: '', isRecurring: false, targetClasses: [] });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleDeleteClick = (id, title) => {
    setConfirmData({ eventId: id, eventTitle: title });
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteEvent(confirmData.eventId);
      toast.success('Event deleted');
      setShowDetail(false);
      setShowConfirm(false);
      setConfirmData({ eventId: null, eventTitle: '' });
    } catch (err) { toast.error('Failed'); }
    finally { setIsDeleting(false); }
  };

  const classesOptions = CLASSES.map(c => ({ value: c, label: c, searchFields: [c] }));
  const selectedClasses = form.targetClasses?.length > 0 ? form.targetClasses.join(', ') : 'All Classes';

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowDetail(true);
  };

  const handleMonthChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  return (
    <div className="h-full min-h-screen bg-gray-50">
      <GoogleCalendar
        events={events}
        onEventClick={handleEventClick}
        isReadOnly={false}
        onCreateClick={() => setShowCreate(true)}
        onMonthChange={handleMonthChange}
      />

      {/* Event Detail Modal */}
      <Modal isOpen={showDetail && selectedEvent && !Array.isArray(selectedEvent)} onClose={() => { setShowDetail(false); setSelectedEvent(null); }} title="Event Details" size="lg">
        {selectedEvent && !Array.isArray(selectedEvent) && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge>{selectedEvent.type}</Badge>
                    {selectedEvent.isRecurring && <Badge>🔄 Recurring</Badge>}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Start Date</p>
                <p className="font-medium text-gray-900">{formatDate(selectedEvent.startDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">End Date</p>
                <p className="font-medium text-gray-900">{formatDate(selectedEvent.endDate)}</p>
              </div>
            </div>

            {selectedEvent.description && (
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Description</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedEvent.description}</p>
              </div>
            )}

            {/* Target Classes & Sections */}
            <div className="border-t pt-4">
              <p className="text-xs text-gray-500 uppercase font-semibold mb-3">Applicable To</p>
              {selectedEvent.targetClasses?.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.targetClasses.map((cls) => (
                      <div
                        key={cls}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg px-3 py-2 font-medium text-blue-900"
                      >
                        {cls}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3 text-green-900 font-medium">
                  ✓ All Classes & Sections
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="danger" onClick={() => handleDeleteClick(selectedEvent._id, selectedEvent.title)}>Delete Event</Button>
              <Button type="button" onClick={() => { setShowDetail(false); setSelectedEvent(null); }}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Event Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Calendar Event" size="lg"
        footer={<>
          <Button variant="secondary" type="button" onClick={() => { setShowCreate(false); setForm({ title: '', description: '', type: 'EVENT', startDate: '', endDate: '', isRecurring: false, targetClasses: [] }); }}>Cancel</Button>
          <Button type="submit" form="create-event-form" className="bg-gradient-to-r from-primary-600 to-blue-600">Create Event</Button>
        </>}
      >
        <form id="create-event-form" onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Event Title *"
            placeholder="e.g., Annual Day, Mid-term Exam"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <DropdownTable
            label="Event Type *"
            value={form.type}
            onChange={(val) => setForm({ ...form, type: val })}
            placeholder="Select type"
            icon="📌"
            options={EVENT_TYPES.map((t) => ({
              value: t,
              label: t,
              searchFields: [t, t.toLowerCase()],
            }))}
            columns={[{ key: 'label', label: 'Type', render: (opt) => `${opt.label}` }]}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={3}
              placeholder="Add event details..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date *"
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Classes (Leave empty for all)</label>
            <DropdownTable
              value=""
              onChange={(val) => {
                const newClasses = [...(form.targetClasses || [])];
                if (!newClasses.includes(val)) newClasses.push(val);
                setForm({ ...form, targetClasses: newClasses });
              }}
              placeholder="+ Add Class"
              icon="🏫"
              options={classesOptions.filter(c => !form.targetClasses?.includes(c.value))}
              columns={[{ key: 'label', label: 'Class' }]}
            />
            {form.targetClasses?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {form.targetClasses.map((cls) => (
                  <Badge key={cls}>
                    {cls}
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, targetClasses: form.targetClasses.filter(c => c !== cls) })}
                      className="ml-2 hover:opacity-70"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="checkbox"
              checked={form.isRecurring}
              onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
            />
            <span className="font-medium text-gray-700">🔄 This is a recurring event</span>
          </label>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => { setShowConfirm(false); setConfirmData({ eventId: null, eventTitle: '' }); }}
        onConfirm={handleDeleteConfirm}
        title="Delete Event"
        message={`Are you sure you want to delete event "${confirmData.eventTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
