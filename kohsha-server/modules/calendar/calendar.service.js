const CalendarEvent = require('./calendarEvent.model');
const { AppError } = require('../../middleware/errorHandler');
const { getFormattedHolidays } = require('./holidays.service');

const createEvent = async (data, userId) => {
  return CalendarEvent.create({ ...data, createdBy: userId });
};

const getEvents = async ({ month, year, type, targetClass }) => {
  const filter = {};
  if (type) filter.type = type;
  if (targetClass) {
    filter.$or = [
      { targetClasses: { $size: 0 } },
      { targetClasses: targetClass },
    ];
  }
  if (month && year) {
    const startOfMonth = new Date(Number(year), Number(month) - 1, 1);
    const endOfMonth = new Date(Number(year), Number(month), 0, 23, 59, 59);
    filter.$or = filter.$or || [];
    filter.$and = [
      { $or: [
        { startDate: { $gte: startOfMonth, $lte: endOfMonth } },
        { endDate: { $gte: startOfMonth, $lte: endOfMonth } },
        { startDate: { $lte: startOfMonth }, endDate: { $gte: endOfMonth } },
      ]},
    ];
  }

  const dbEvents = await CalendarEvent.find(filter)
    .populate('createdBy', 'name')
    .sort({ startDate: 1 });

  // Include system holidays from Google Calendar if year is specified
  if (year && (!type || type === 'HOLIDAY')) {
    const systemHolidays = await getFormattedHolidays(Number(year));
    const filteredHolidays = systemHolidays.filter(holiday => {
      const holidayDate = new Date(holiday.startDate);
      return holidayDate.getMonth() === (Number(month) - 1) || !month;
    });
    return [...dbEvents, ...filteredHolidays].sort((a, b) => 
      new Date(a.startDate) - new Date(b.startDate)
    );
  }

  return dbEvents;
};

const getHolidays = async ({ year }) => {
  const filter = { type: 'HOLIDAY' };
  if (year) {
    filter.startDate = { $gte: new Date(Number(year), 0, 1) };
    filter.endDate = { $lte: new Date(Number(year), 11, 31, 23, 59, 59) };
  }
  
  const dbHolidays = await CalendarEvent.find(filter).sort({ startDate: 1 });
  
  // Include system holidays
  if (year) {
    const systemHolidays = await getFormattedHolidays(Number(year));
    return [...dbHolidays, ...systemHolidays].sort((a, b) => 
      new Date(a.startDate) - new Date(b.startDate)
    );
  }

  return dbHolidays;
};

const getEventById = async (id) => {
  const event = await CalendarEvent.findById(id).populate('createdBy', 'name');
  if (!event) throw new AppError('Event not found', 404);
  return event;
};

const updateEvent = async (id, data) => {
  const event = await CalendarEvent.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!event) throw new AppError('Event not found', 404);
  return event;
};

const deleteEvent = async (id) => {
  const event = await CalendarEvent.findByIdAndDelete(id);
  if (!event) throw new AppError('Event not found', 404);
  return event;
};

module.exports = { createEvent, getEvents, getHolidays, getEventById, updateEvent, deleteEvent };
