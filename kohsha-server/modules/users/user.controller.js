const service = require('./user.service');

const getAll = async (req, res, next) => {
  try {
    const result = await service.getUsers(req.query);
    res.json(result);
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const user = await service.getUserById(req.params.id);
    res.json({ user });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const user = await service.updateUser(req.params.id, req.body);
    res.json({ message: 'User updated', user });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await service.deleteUser(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) { next(error); }
};

const toggleActive = async (req, res, next) => {
  try {
    const user = await service.toggleActive(req.params.id);
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) { next(error); }
};

const getTeachers = async (req, res, next) => {
  try {
    const result = await service.getTeachers(req.query);
    res.json(result);
  } catch (error) { next(error); }
};

const assignClasses = async (req, res, next) => {
  try {
    const user = await service.assignClasses(req.params.id, req.body.classes);
    res.json({ message: 'Classes assigned', user });
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, update, remove, toggleActive, getTeachers, assignClasses };
