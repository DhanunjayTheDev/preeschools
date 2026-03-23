const jwt = require('jsonwebtoken');
const User = require('./user.model');
const { AppError } = require('../../middleware/errorHandler');

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const register = async ({ name, email, password, phone, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }
  const user = await User.create({ name, email, password, phone, role });
  const token = generateToken(user._id, user.role);
  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !user.isActive) {
    throw new AppError('Invalid credentials', 401);
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }
  user.lastLogin = new Date();
  await user.save();
  const token = generateToken(user._id, user.role);
  return { user, token };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId).populate('children');
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const updateProfile = async (userId, updates) => {
  const allowed = ['name', 'phone', 'avatar'];
  const filtered = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) filtered[key] = updates[key];
  }
  const user = await User.findByIdAndUpdate(userId, filtered, { new: true, runValidators: true });
  if (!user) throw new AppError('User not found', 404);
  return user;
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found', 404);
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AppError('Current password is incorrect', 400);
  user.password = newPassword;
  await user.save();
};

module.exports = { register, login, getProfile, updateProfile, changePassword };
