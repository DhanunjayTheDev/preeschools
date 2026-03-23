const mongoose = require('mongoose');
const { TEACHER_REGISTRATION_STATUS } = require('../../config/constants');

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addedAt: { type: Date, default: Date.now },
});

const teacherRegistrationSchema = new mongoose.Schema({
  // Personal Info
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },

  // Address
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' },
  },

  // Professional Info
  qualification: { type: String, required: true, trim: true },
  specialization: { type: String, trim: true },
  experienceYears: { type: Number, default: 0 },
  previousSchool: { type: String, trim: true },
  subjects: [{ type: String, trim: true }],
  preferredClasses: [{ type: String, trim: true }],

  // Application Details
  source: { type: String, enum: ['Walk-in', 'Phone', 'Website', 'Referral', 'Job Portal', 'Social Media', 'Other'], default: 'Walk-in' },
  expectedSalary: { type: Number },
  availableFrom: { type: Date },
  resumeUrl: { type: String },

  // Management
  status: {
    type: String,
    enum: Object.values(TEACHER_REGISTRATION_STATUS),
    default: TEACHER_REGISTRATION_STATUS.PENDING,
  },
  notes: [noteSchema],
  interviewDate: { type: Date },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  convertedToUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  convertedAt: { type: Date },
}, { timestamps: true });

teacherRegistrationSchema.index({ status: 1 });
teacherRegistrationSchema.index({ createdAt: -1 });
teacherRegistrationSchema.index({ phone: 1 });

module.exports = mongoose.model('TeacherRegistration', teacherRegistrationSchema);
