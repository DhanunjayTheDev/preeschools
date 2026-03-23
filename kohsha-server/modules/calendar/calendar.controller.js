const service = require('./calendar.service');

const create = async (req, res, next) => {
  try {
    const event = await service.createEvent(req.body, req.user._id);
    res.status(201).json({ message: 'Event created', event });
  } catch (error) { next(error); }
};

const getAll = async (req, res, next) => {
  try {
    const events = await service.getEvents(req.query);
    res.json({ events });
  } catch (error) { next(error); }
};

const getHolidays = async (req, res, next) => {
  try {
    const holidays = await service.getHolidays(req.query);
    res.json({ holidays });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const event = await service.getEventById(req.params.id);
    res.json({ event });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const event = await service.updateEvent(req.params.id, req.body);
    res.json({ message: 'Event updated', event });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await service.deleteEvent(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) { next(error); }
};

module.exports = { create, getAll, getHolidays, getById, update, remove };
