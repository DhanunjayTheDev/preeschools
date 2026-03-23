const service = require('./activity.service');
const Student = require('../students/student.model');

const create = async (req, res, next) => {
  try {
    const activity = await service.createActivity(req.body, req.user._id);
    res.status(201).json({ message: 'Activity created', activity });
  } catch (error) { next(error); }
};

const getAll = async (req, res, next) => {
  try {
    const result = await service.getActivities(req.query);
    res.json(result);
  } catch (error) { next(error); }
};

const getMyActivities = async (req, res, next) => {
  try {
    const result = await service.getActivities({ ...req.query, createdBy: req.user._id });
    res.json(result);
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const activity = await service.getActivityById(req.params.id);
    res.json({ activity });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const activity = await service.updateActivity(req.params.id, req.body, req.user._id);
    res.json({ message: 'Activity updated', activity });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await service.deleteActivity(req.params.id, req.user._id, req.user.role);
    res.json({ message: 'Activity deleted' });
  } catch (error) { next(error); }
};

const addSubmission = async (req, res, next) => {
  try {
    const activity = await service.addSubmission(req.params.id, req.body, req.user._id);
    res.json({ message: 'Submission added', activity });
  } catch (error) { next(error); }
};

const getForParent = async (req, res, next) => {
  try {
    const students = await Student.find({ parentUser: req.user._id });
    const studentClasses = students.map((s) => ({ className: s.className, section: s.section }));
    const result = await service.getActivitiesForParent(studentClasses, req.query);
    res.json(result);
  } catch (error) { next(error); }
};

module.exports = { create, getAll, getMyActivities, getById, update, remove, addSubmission, getForParent };
