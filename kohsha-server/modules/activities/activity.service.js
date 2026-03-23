const Activity = require('./activity.model');
const { AppError } = require('../../middleware/errorHandler');

const createActivity = async (data, userId) => {
  return Activity.create({ ...data, createdBy: userId });
};

const getActivities = async ({ page = 1, limit = 20, type, className, section, search, createdBy }) => {
  const filter = { isActive: true };
  if (type) filter.type = type;
  if (className) filter.className = className;
  if (section) filter.section = section;
  if (createdBy) filter.createdBy = createdBy;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [activities, total] = await Promise.all([
    Activity.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Activity.countDocuments(filter),
  ]);

  return {
    activities,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  };
};

const getActivityById = async (id) => {
  const activity = await Activity.findById(id)
    .populate('createdBy', 'name')
    .populate('submissions.student', 'name studentId')
    .populate('submissions.submittedBy', 'name');
  if (!activity) throw new AppError('Activity not found', 404);
  return activity;
};

const updateActivity = async (id, data, userId) => {
  const activity = await Activity.findById(id);
  if (!activity) throw new AppError('Activity not found', 404);
  if (activity.createdBy.toString() !== userId.toString()) {
    throw new AppError('You can only edit your own activities', 403);
  }
  Object.assign(activity, data);
  await activity.save();
  return activity;
};

const deleteActivity = async (id, userId, role) => {
  const activity = await Activity.findById(id);
  if (!activity) throw new AppError('Activity not found', 404);
  if (role === 'TEACHER' && activity.createdBy.toString() !== userId.toString()) {
    throw new AppError('You can only delete your own activities', 403);
  }
  await Activity.findByIdAndDelete(id);
  return activity;
};

const addSubmission = async (activityId, { studentId, notes, attachments }, userId) => {
  const activity = await Activity.findById(activityId);
  if (!activity) throw new AppError('Activity not found', 404);
  activity.submissions.push({
    student: studentId,
    submittedBy: userId,
    notes,
    attachments: attachments || [],
  });
  await activity.save();
  return activity;
};

const getActivitiesForParent = async (studentClasses, { page = 1, limit = 20 }) => {
  const filter = {
    isActive: true,
    $or: studentClasses.map((c) => ({ className: c.className, $or: [{ section: c.section }, { section: null }] })),
  };
  const skip = (Number(page) - 1) * Number(limit);
  const [activities, total] = await Promise.all([
    Activity.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Activity.countDocuments(filter),
  ]);
  return { activities, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } };
};

module.exports = {
  createActivity, getActivities, getActivityById,
  updateActivity, deleteActivity, addSubmission, getActivitiesForParent,
};
