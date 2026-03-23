const User = require('../auth/user.model');
const { AppError } = require('../../middleware/errorHandler');

const getUsers = async ({ page = 1, limit = 20, role, search, isActive }) => {
  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  return {
    users,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  };
};

const getUserById = async (id) => {
  const user = await User.findById(id).select('-password').populate('children');
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const updateUser = async (id, data) => {
  // Prevent password update through this endpoint
  delete data.password;
  const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password');
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const toggleActive = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new AppError('User not found', 404);
  user.isActive = !user.isActive;
  await user.save();
  return user;
};

// Teacher-specific
const getTeachers = async (query) => {
  return getUsers({ ...query, role: 'TEACHER' });
};

const assignClasses = async (teacherId, classes) => {
  const user = await User.findById(teacherId);
  if (!user || user.role !== 'TEACHER') throw new AppError('Teacher not found', 404);
  user.assignedClasses = classes;
  await user.save();
  return user;
};

module.exports = { getUsers, getUserById, updateUser, deleteUser, toggleActive, getTeachers, assignClasses };
