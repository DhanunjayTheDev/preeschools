const Announcement = require('./announcement.model');
const User = require('../auth/user.model');
const Notification = require('../notifications/notification.model');
const { AppError } = require('../../middleware/errorHandler');

const createAnnouncement = async (data, userId) => {
  console.log('📝 Creating announcement:', { data, createdBy: userId });
  
  const announcement = await Announcement.create({ ...data, createdBy: userId });
  await announcement.populate('createdBy', 'name');
  console.log('✅ Announcement created:', announcement._id);

  // Build recipient list based on targeting
  const userFilter = { isActive: true };
  if (data.targetRoles && data.targetRoles.length > 0) {
    userFilter.role = { $in: data.targetRoles };
  }
  if (data.targetClasses && data.targetClasses.length > 0) {
    // For teachers: match assigned classes; for parents: match via children
    // Simplified: we target by role only for now, class-based filtering in queries
  }

  console.log('🔍 Looking for users with filter:', userFilter);
  const targetUsers = await User.find(userFilter).select('_id email role');
  console.log(`👥 Found ${targetUsers.length} target users:`, targetUsers.map(u => ({ id: u._id, email: u.email, role: u.role })));

  announcement.recipients = targetUsers.map((u) => ({ user: u._id, status: 'SENT' }));
  await announcement.save();

  // Create in-app notifications
  const notifications = targetUsers.map((u) => ({
    user: u._id,
    title: announcement.title,
    message: announcement.content.substring(0, 200),
    type: 'ANNOUNCEMENT',
    link: `/announcements/${announcement._id}`,
    metadata: { announcementId: announcement._id },
  }));
  
  if (notifications.length > 0) {
    console.log(`🔔 Creating ${notifications.length} notifications`);
    await Notification.insertMany(notifications);
    console.log('✅ Notifications created successfully');
  } else {
    console.warn('⚠️ No notifications created - no target users found!');
  }

  return announcement;
};

const getAnnouncements = async ({ page = 1, limit = 20, type, targetRole, search }) => {
  const filter = { isPublished: true };
  if (type) filter.type = type;
  if (targetRole) filter.targetRoles = targetRole;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
    ];
  }
  // Only show published or past-scheduled
  filter.$and = [
    { $or: [{ scheduledAt: null }, { scheduledAt: { $lte: new Date() } }] },
  ];

  const skip = (Number(page) - 1) * Number(limit);
  const [announcements, total] = await Promise.all([
    Announcement.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Announcement.countDocuments(filter),
  ]);

  return {
    announcements,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  };
};

const getAnnouncementById = async (id, userId) => {
  const announcement = await Announcement.findById(id).populate('createdBy', 'name');
  if (!announcement) throw new AppError('Announcement not found', 404);

  // Mark as read for this user
  if (userId) {
    const recipient = announcement.recipients.find((r) => r.user.toString() === userId.toString());
    if (recipient && recipient.status !== 'READ') {
      recipient.status = 'READ';
      recipient.readAt = new Date();
      await announcement.save();
    }
  }

  return announcement;
};

const getMyAnnouncements = async (userId, role, { page = 1, limit = 20 }) => {
  const filter = {
    isPublished: true,
    targetRoles: role,
    $or: [{ scheduledAt: null }, { scheduledAt: { $lte: new Date() } }],
  };
  const skip = (Number(page) - 1) * Number(limit);
  const [announcements, total] = await Promise.all([
    Announcement.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Announcement.countDocuments(filter),
  ]);

  // Enrich with read status for current user
  const enriched = announcements.map((a) => {
    const obj = a.toObject();
    const recipient = a.recipients.find((r) => r.user.toString() === userId.toString());
    obj.readStatus = recipient ? recipient.status : 'SENT';
    delete obj.recipients;
    return obj;
  });

  return { announcements: enriched, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } };
};

const updateAnnouncement = async (id, data) => {
  const announcement = await Announcement.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!announcement) throw new AppError('Announcement not found', 404);
  return announcement;
};

const deleteAnnouncement = async (id) => {
  const announcement = await Announcement.findByIdAndDelete(id);
  if (!announcement) throw new AppError('Announcement not found', 404);
  
  // Delete related notifications
  await Notification.deleteMany({ 'metadata.announcementId': id });
  
  return announcement;
};

const getReadStats = async (id) => {
  const announcement = await Announcement.findById(id);
  if (!announcement) throw new AppError('Announcement not found', 404);
  const total = announcement.recipients.length;
  const read = announcement.recipients.filter((r) => r.status === 'READ').length;
  const delivered = announcement.recipients.filter((r) => r.status === 'DELIVERED').length;
  return { total, read, delivered, sent: total - read - delivered };
};

module.exports = {
  createAnnouncement, getAnnouncements, getAnnouncementById,
  getMyAnnouncements, updateAnnouncement, deleteAnnouncement, getReadStats,
};
