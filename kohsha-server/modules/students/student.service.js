const Student = require('./student.model');
const { AppError } = require('../../middleware/errorHandler');

const createStudent = async (data) => {
  const studentId = await Student.generateStudentId();
  return Student.create({ ...data, studentId });
};

const getStudents = async ({ page = 1, limit = 20, className, section, status, search, sortBy = 'createdAt', sortOrder = -1 }) => {
  const filter = {};
  if (className) filter.className = className;
  if (section) filter.section = section;
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } },
      { fatherName: { $regex: search, $options: 'i' } },
      { fatherPhone: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [students, total] = await Promise.all([
    Student.find(filter)
      .populate('parentUser', 'name email')
      .populate('feePlan')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    Student.countDocuments(filter),
  ]);

  return {
    students,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
  };
};

const getStudentById = async (id) => {
  const student = await Student.findById(id)
    .populate('parentUser', 'name email phone')
    .populate('feePlan')
    .populate('enquiryRef');
  if (!student) throw new AppError('Student not found', 404);
  return student;
};

const updateStudent = async (id, data) => {
  const student = await Student.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!student) throw new AppError('Student not found', 404);
  return student;
};

const deleteStudent = async (id) => {
  const student = await Student.findByIdAndDelete(id);
  if (!student) throw new AppError('Student not found', 404);
  return student;
};

const getStudentsByClass = async (className, section) => {
  const filter = { className, status: 'ACTIVE' };
  if (section) filter.section = section;
  return Student.find(filter).sort({ name: 1 });
};

const getStudentsByParent = async (parentUserId) => {
  return Student.find({ parentUser: parentUserId }).populate('feePlan');
};

const getStats = async () => {
  const total = await Student.countDocuments();
  const active = await Student.countDocuments({ status: 'ACTIVE' });
  const byClass = await Student.aggregate([
    { $match: { status: 'ACTIVE' } },
    { $group: { _id: { className: '$className', section: '$section' }, count: { $sum: 1 } } },
    { $sort: { '_id.className': 1, '_id.section': 1 } },
  ]);
  return { total, active, inactive: total - active, byClass };
};

module.exports = {
  createStudent, getStudents, getStudentById, updateStudent,
  deleteStudent, getStudentsByClass, getStudentsByParent, getStats,
};
