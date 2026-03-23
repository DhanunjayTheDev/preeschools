const mongoose = require('mongoose');
const { ENQUIRY_STATUS } = require('../../config/constants');

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addedAt: { type: Date, default: Date.now },
});

const enquirySchema = new mongoose.Schema({
  // Student Info
  studentName: { type: String, required: true, trim: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  motherTongue: { type: String, trim: true },
  admissionClass: { type: String, required: true },
  previousClass: { type: String },
  previousSchool: { type: String },

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

  // Enquiry Management
  status: {
    type: String,
    enum: Object.values(ENQUIRY_STATUS),
    default: ENQUIRY_STATUS.NEW,
  },
  source: { type: String, enum: ['Walk-in', 'Phone', 'Website', 'Referral', 'Social Media', 'Other'], default: 'Walk-in' },
  notes: [noteSchema],
  followUpDate: { type: Date },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  convertedToStudent: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  convertedAt: { type: Date },
}, { timestamps: true });

enquirySchema.index({ status: 1 });
enquirySchema.index({ followUpDate: 1 });
enquirySchema.index({ admissionClass: 1 });
enquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
