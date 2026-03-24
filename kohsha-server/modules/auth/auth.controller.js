const authService = require('./auth.service');

const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({ message: 'Registration successful', user, token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.json({ message: 'Login successful', user, token });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user._id, req.body);
    res.json({ message: 'Profile updated', user });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.user._id, req.body);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

const savePushToken = async (req, res, next) => {
  try {
    const { pushToken, platform } = req.body;
    if (!pushToken) return res.status(400).json({ message: 'Push token is required' });
    const User = require('./user.model');
    const user = await User.findById(req.user._id);
    // Avoid duplicates
    const exists = user.pushTokens?.some((t) => t.token === pushToken);
    if (!exists) {
      user.pushTokens = user.pushTokens || [];
      user.pushTokens.push({ token: pushToken, platform: platform || 'android' });
      await user.save();
    }
    res.json({ message: 'Push token saved' });
  } catch (error) {
    next(error);
  }
};

const removePushToken = async (req, res, next) => {
  try {
    const { pushToken } = req.body;
    if (!pushToken) return res.status(400).json({ message: 'Push token is required' });
    const User = require('./user.model');
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { pushTokens: { token: pushToken } },
    });
    res.json({ message: 'Push token removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, updateProfile, changePassword, savePushToken, removePushToken };
