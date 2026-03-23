const studentService = require('./student.service');

const create = async (req, res, next) => {
  try {
    if (req.file) req.body.photo = `/uploads/students/${req.file.filename}`;
    const student = await studentService.createStudent(req.body);
    res.status(201).json({ message: 'Student created', student });
  } catch (error) { next(error); }
};

const getAll = async (req, res, next) => {
  try {
    const result = await studentService.getStudents(req.query);
    res.json(result);
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    res.json({ student });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    if (req.file) req.body.photo = `/uploads/students/${req.file.filename}`;
    const student = await studentService.updateStudent(req.params.id, req.body);
    res.json({ message: 'Student updated', student });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    await studentService.deleteStudent(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (error) { next(error); }
};

const getByClass = async (req, res, next) => {
  try {
    const students = await studentService.getStudentsByClass(req.params.className, req.query.section);
    res.json({ students });
  } catch (error) { next(error); }
};

const getMyChildren = async (req, res, next) => {
  try {
    const students = await studentService.getStudentsByParent(req.user._id);
    res.json({ students });
  } catch (error) { next(error); }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await studentService.getStats();
    res.json(stats);
  } catch (error) { next(error); }
};

module.exports = { create, getAll, getById, update, remove, getByClass, getMyChildren, getStats };
