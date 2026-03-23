const service = require('./announcement.service');

const create = async (req, res, next) => {
  try {
    const announcement = await service.createAnnouncement(req.body, req.user._id);
    res.status(201).json({ message: 'Announcement created', announcement });
  } catch (error) { next(error); }
};

const getAll = async (req, res, next) => {
  try {
    const result = await service.getAnnouncements(req.query);
    res.json(result);
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const announcement = await service.getAnnouncementById(req.params.id, req.user._id);
    res.json({ announcement });
  } catch (error) { next(error); }
};

const getMy = async (req, res, next) => {
  try {
    const result = await service.getMyAnnouncements(req.user._id, req.user.role, req.query);
    res.json(result);
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const announcement = await service.updateAnnouncement(req.params.id, req.body);
    res.json({ message: 'Announcement updated', announcement });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await service.deleteAnnouncement(req.params.id);
    res.json({ message: 'Announcement deleted' });
  } catch (error) { next(error); }
};

const readStats = async (req, res, next) => {
  try {
    const stats = await service.getReadStats(req.params.id);
    res.json(stats);
  } catch (error) { next(error); }
};

module.exports = { create, getAll, getById, getMy, update, remove, readStats };
