const Enquiry = require('./enquiry.model');
const Student = require('../students/student.model');
const { AppError } = require('../../middleware/errorHandler');
const { ENQUIRY_STATUS } = require('../../config/constants');

const createEnquiry = async (data) => {
  return Enquiry.create(data);
};

const getEnquiries = async ({ page = 1, limit = 20, status, admissionClass, search, sortBy = 'createdAt', sortOrder = -1 }) => {
  const filter = {};
  if (status) filter.status = status;
  if (admissionClass) filter.admissionClass = admissionClass;
  if (search) {
    filter.$or = [
      { studentName: { $regex: search, $options: 'i' } },
      { fatherName: { $regex: search, $options: 'i' } },
      { motherName: { $regex: search, $options: 'i' } },
      { fatherPhone: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const [enquiries, total] = await Promise.all([
    Enquiry.find(filter)
      .populate('assignedTo', 'name')
      .populate('notes.addedBy', 'name')
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit),
    Enquiry.countDocuments(filter),
  ]);

  return {
    enquiries,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getEnquiryById = async (id) => {
  const enquiry = await Enquiry.findById(id)
    .populate('assignedTo', 'name email')
    .populate('notes.addedBy', 'name')
    .populate('convertedToStudent');
  if (!enquiry) throw new AppError('Enquiry not found', 404);
  return enquiry;
};

const updateEnquiry = async (id, data) => {
  const enquiry = await Enquiry.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!enquiry) throw new AppError('Enquiry not found', 404);
  return enquiry;
};

const updateStatus = async (id, status, userId) => {
  const enquiry = await Enquiry.findById(id);
  if (!enquiry) throw new AppError('Enquiry not found', 404);
  enquiry.status = status;
  enquiry.notes.push({ text: `Status changed to ${status}`, addedBy: userId });
  await enquiry.save();
  return enquiry;
};

const addNote = async (id, text, userId) => {
  const enquiry = await Enquiry.findById(id);
  if (!enquiry) throw new AppError('Enquiry not found', 404);
  enquiry.notes.push({ text, addedBy: userId });
  await enquiry.save();
  return enquiry;
};

const convertToStudent = async (enquiryId, { section }, userId) => {
  const enquiry = await Enquiry.findById(enquiryId);
  if (!enquiry) throw new AppError('Enquiry not found', 404);
  if (enquiry.status === ENQUIRY_STATUS.CONVERTED) {
    throw new AppError('Enquiry already converted', 400);
  }

  const studentId = await Student.generateStudentId();
  const student = await Student.create({
    studentId,
    name: enquiry.studentName,
    dateOfBirth: enquiry.dateOfBirth,
    gender: enquiry.gender,
    motherTongue: enquiry.motherTongue,
    className: enquiry.admissionClass,
    section,
    address: enquiry.address,
    fatherName: enquiry.fatherName,
    fatherEmail: enquiry.fatherEmail,
    fatherPhone: enquiry.fatherPhone,
    fatherProfession: enquiry.fatherProfession,
    motherName: enquiry.motherName,
    motherEmail: enquiry.motherEmail,
    motherPhone: enquiry.motherPhone,
    motherProfession: enquiry.motherProfession,
    enquiryRef: enquiry._id,
  });

  enquiry.status = ENQUIRY_STATUS.CONVERTED;
  enquiry.convertedToStudent = student._id;
  enquiry.convertedAt = new Date();
  enquiry.notes.push({ text: `Converted to student: ${studentId}`, addedBy: userId });
  await enquiry.save();

  return { enquiry, student };
};

const deleteEnquiry = async (id) => {
  const enquiry = await Enquiry.findByIdAndDelete(id);
  if (!enquiry) throw new AppError('Enquiry not found', 404);
  return enquiry;
};

const getStats = async () => {
  const stats = await Enquiry.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const total = await Enquiry.countDocuments();
  const followUpsToday = await Enquiry.countDocuments({
    followUpDate: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      $lte: new Date(new Date().setHours(23, 59, 59, 999)),
    },
  });
  return { stats, total, followUpsToday };
};

module.exports = {
  createEnquiry, getEnquiries, getEnquiryById, updateEnquiry,
  updateStatus, addNote, convertToStudent, deleteEnquiry, getStats,
};
