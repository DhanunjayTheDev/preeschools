const service = require('./teacherRegistration.service');

const create = async (req, res, next) => {
  try {
    const registration = await service.create(req.body);
    res.status(201).json({ message: 'Teacher registration created', registration });
  } catch (error) { next(error); }
};

const getAll = async (req, res, next) => {
  try {
    const result = await service.getAll(req.query);
    res.json(result);
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const registration = await service.getById(req.params.id);
    res.json({ registration });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const registration = await service.update(req.params.id, req.body);
    res.json({ message: 'Registration updated', registration });
  } catch (error) { next(error); }
};

const updateStatus = async (req, res, next) => {
  try {
    const registration = await service.updateStatus(req.params.id, req.body.status, req.user._id);
    res.json({ message: 'Status updated', registration });
  } catch (error) { next(error); }
};

const addNote = async (req, res, next) => {
  try {
    const registration = await service.addNote(req.params.id, req.body.text, req.user._id);
    res.json({ message: 'Note added', registration });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.json({ message: 'Registration deleted' });
  } catch (error) { next(error); }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await service.getStats();
    res.json(stats);
  } catch (error) { next(error); }
};

module.exports = { create, getAll, getById, update, updateStatus, addNote, remove, getStats };
