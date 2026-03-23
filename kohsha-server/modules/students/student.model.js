const mongoose = require('mongoose');
const { STUDENT_STATUS } = require('../../config/constants');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, unique: true, required: true },
  name: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  motherTongue: { type: String, trim: true },
  className: { type: String, required: true },
  section: { type: String, required: true },
  admissionDate: { type: Date, default: Date.now },
  photo: { type: String },

  // Address
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' },
  },

  // Father Details
  fatherName: { type: String, trim: true },
  fatherEmail: { type: String, trim: true, lowercase: true },
  fatherPhone: { type: String, trim: true },
  fatherProfession: { type: String, trim: true },

  // Mother Details
  motherName: { type: String, trim: true },
  motherEmail: { type: String, trim: true, lowercase: true },
  motherPhone: { type: String, trim: true },
  motherProfession: { type: String, trim: true },

  // Linked parent user account
  parentUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // Source enquiry
  enquiryRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Enquiry' },

  status: {
    type: String,
    enum: Object.values(STUDENT_STATUS),
    default: STUDENT_STATUS.ACTIVE,
  },

  // Fee plan assignment
  feePlan: { type: mongoose.Schema.Types.ObjectId, ref: 'FeePlan' },
}, { timestamps: true });

studentSchema.index({ className: 1, section: 1 });
studentSchema.index({ status: 1 });
studentSchema.index({ parentUser: 1 });

// Auto-generate student ID
studentSchema.statics.generateStudentId = async function () {
  const year = new Date().getFullYear().toString().slice(-2);
  const count = await this.countDocuments();
  const seq = (count + 1).toString().padStart(4, '0');
  return `KA${year}${seq}`;
};

module.exports = mongoose.model('Student', studentSchema);
