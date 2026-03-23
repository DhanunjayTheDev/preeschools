import { useEffect, useState } from 'react';
import useCalendarStore from '../../stores/calendarStore';
import GoogleCalendar from '../../components/GoogleCalendar';
import { Modal, Button, Input } from '../../components/ui';

export default function ParentCalendar() {
  const { events, fetchEventsWithHolidays } = useCalendarStore();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  useEffect(() => {
    fetchEventsWithHolidays(month, year);
  }, [month, year, fetchEventsWithHolidays]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowDetail(true);
  };

  const handleMonthChange = (newMonth, newYear) => {
    setMonth(newMonth);
    setYear(newYear);
  };

  return (
    <div className="h-screen bg-gray-50">
      <GoogleCalendar
        events={events}
        onEventClick={handleEventClick}
        isReadOnly={true}
        onMonthChange={handleMonthChange}
      />

      {/* Event Detail Modal */}
      <Modal
        isOpen={showDetail && selectedEvent}
        onClose={() => {
          setShowDetail(false);
          setSelectedEvent(null);
        }}
        title="Event Details"
        size="lg"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedEvent.title}</h3>
              {selectedEvent.description && (
                <p className="text-gray-700 mb-3">{selectedEvent.description}</p>
              )}
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-semibold">START DATE</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(selectedEvent.startDate).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-semibold">END DATE</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(selectedEvent.endDate || selectedEvent.startDate).toLocaleDateString(
                      'en-IN',
                      { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-semibold mb-1">TYPE</p>
                <p className="text-sm font-bold text-gray-900">{selectedEvent.type}</p>
              </div>
              {selectedEvent.targetClasses?.length > 0 && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold mb-1">CLASSES</p>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedEvent.targetClasses.join(', ')}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => {
                  setShowDetail(false);
                  setSelectedEvent(null);
                }}
                variant="secondary"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
