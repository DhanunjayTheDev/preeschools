const TeacherRegistration = require('./teacherRegistration.model');
const { AppError } = require('../../middleware/errorHandler');
const { TEACHER_REGISTRATION_STATUS } = require('../../config/constants');

const create = async (data) => {
  return TeacherRegistration.create(data);
};

const getAll = async ({ page = 1, limit = 20, status, search, sortBy = 'createdAt', sortOrder = -1 }) => {
  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { qualification: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [registrations, total] = await Promise.all([
    TeacherRegistration.find(filter)
      .populate('assignedTo', 'name')
      .populate('notes.addedBy', 'name')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit)),
    TeacherRegistration.countDocuments(filter),
  ]);

  return {
    registrations,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getById = async (id) => {
  const registration = await TeacherRegistration.findById(id)
    .populate('assignedTo', 'name email')
    .populate('notes.addedBy', 'name')
    .populate('convertedToUser', 'name email');
  if (!registration) throw new AppError('Teacher registration not found', 404);
  return registration;
};

const update = async (id, data) => {
  const registration = await TeacherRegistration.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!registration) throw new AppError('Teacher registration not found', 404);
  return registration;
};

const updateStatus = async (id, status, userId) => {
  const registration = await TeacherRegistration.findById(id);
  if (!registration) throw new AppError('Teacher registration not found', 404);
  registration.status = status;
  registration.notes.push({ text: `Status changed to ${status}`, addedBy: userId });
  await registration.save();
  return registration;
};

const addNote = async (id, text, userId) => {
  const registration = await TeacherRegistration.findById(id);
  if (!registration) throw new AppError('Teacher registration not found', 404);
  registration.notes.push({ text, addedBy: userId });
  await registration.save();
  return registration;
};

const remove = async (id) => {
  const registration = await TeacherRegistration.findByIdAndDelete(id);
  if (!registration) throw new AppError('Teacher registration not found', 404);
  return registration;
};

const getStats = async () => {
  const stats = await TeacherRegistration.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const total = await TeacherRegistration.countDocuments();
  const thisMonth = await TeacherRegistration.countDocuments({
    createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
  });

  return {
    byStatus: stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
    total,
    thisMonth,
  };
};

module.exports = { create, getAll, getById, update, updateStatus, addNote, remove, getStats };
